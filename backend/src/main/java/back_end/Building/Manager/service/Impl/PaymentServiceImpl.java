package back_end.Building.Manager.service.Impl;

import back_end.Building.Manager.entity.Fee;
import back_end.Building.Manager.entity.Payment;
import back_end.Building.Manager.enums.FeeStatus;
import back_end.Building.Manager.repository.ApartmentRepository;
import back_end.Building.Manager.repository.FeeRepository;
import back_end.Building.Manager.repository.PaymentRepository;
import back_end.Building.Manager.service.Interface.PaymentService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class PaymentServiceImpl implements PaymentService {

    private final PaymentRepository paymentRepository;
    private final FeeRepository feeRepository;
    private final ApartmentRepository apartmentRepository;

    public PaymentServiceImpl(PaymentRepository paymentRepository,
                              FeeRepository feeRepository,
                              ApartmentRepository apartmentRepository) {
        this.paymentRepository = paymentRepository;
        this.feeRepository = feeRepository;
        this.apartmentRepository = apartmentRepository;
    }

    @Override
    public Payment createPayment(Payment payment) {
        if (payment == null) {
            throw new IllegalArgumentException("Cannot create an empty payment object");
        }
        if (payment.getAmount() == null || payment.getAmount().compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("Payment amount must be greater than zero");
        }
        if (payment.getFee() == null || payment.getFee().getId() <= 0) {
            throw new IllegalArgumentException("Payment must be associated with a valid fee");
        }

        Fee fee = feeRepository.findById(payment.getFee().getId())
                .orElseThrow(() -> new IllegalArgumentException("Fee with id " + payment.getFee().getId() + " does not exist"));

        if (fee.getStatus() == FeeStatus.PAID) {
            throw new IllegalArgumentException("Fee is already fully paid");
        }
        if (fee.getStatus() == FeeStatus.CANCELLED) {
            throw new IllegalArgumentException("Cannot record payment for a cancelled fee");
        }

        BigDecimal existingPaid = paymentRepository.getTotalPaidByFeeId(fee.getId());
        BigDecimal outstandingBalance = fee.getAmount().subtract(existingPaid);

        if (payment.getAmount().compareTo(outstandingBalance) > 0) {
            throw new IllegalArgumentException("Payment amount of " + payment.getAmount() +
                    " exceeds outstanding balance of " + outstandingBalance);
        }

        BigDecimal newTotalPaid = existingPaid.add(payment.getAmount());
        if (newTotalPaid.compareTo(fee.getAmount()) >= 0) {
            fee.setStatus(FeeStatus.PAID);
        } else {
            fee.setStatus(FeeStatus.IN_PROGRESS);
        }
        feeRepository.save(fee);

        payment.setFee(fee);
        if (payment.getPaymentDate() == null) {
            payment.setPaymentDate(LocalDateTime.now());
        }

        return paymentRepository.save(payment);
    }

    @Override
    public Optional<Payment> updatePayment(int id, Payment updatedPayment) {
        if (updatedPayment == null) {
            throw new IllegalArgumentException("Cannot update an empty payment object");
        }

        return paymentRepository.findById(id).map(existing -> {
            Fee fee = existing.getFee();
            if (fee != null && fee.getStatus() == FeeStatus.CANCELLED) {
                throw new IllegalArgumentException("Cannot update payment for a cancelled fee");
            }

            if (updatedPayment.getAmount() != null) {
                if (updatedPayment.getAmount().compareTo(BigDecimal.ZERO) <= 0) {
                    throw new IllegalArgumentException("Payment amount must be greater than zero");
                }
                if (fee != null) {
                    BigDecimal totalPaidCurrent = paymentRepository.getTotalPaidByFeeId(fee.getId());
                    BigDecimal otherPayments = totalPaidCurrent.subtract(existing.getAmount());
                    BigDecimal newTotal = otherPayments.add(updatedPayment.getAmount());

                    if (newTotal.compareTo(fee.getAmount()) > 0) {
                        throw new IllegalArgumentException("Updated payment amount would cause total payments (" +
                                newTotal + ") to exceed fee amount (" + fee.getAmount() + ")");
                    }
                }
                existing.setAmount(updatedPayment.getAmount());
            }
            if (updatedPayment.getPaymentDate() != null) {
                existing.setPaymentDate(updatedPayment.getPaymentDate());
            }
            if (updatedPayment.getPaymentMethod() != null) {
                existing.setPaymentMethod(updatedPayment.getPaymentMethod());
            }

            Payment saved = paymentRepository.saveAndFlush(existing);

            // Re-sync fee status
            if (fee != null) {
                syncFeeStatus(fee);
            }

            return saved;
        });
    }

    @Override
    public boolean deletePayment(int id) {
        Optional<Payment> paymentOpt = paymentRepository.findById(id);
        if (paymentOpt.isEmpty()) {
            return false;
        }

        Payment payment = paymentOpt.get();
        Fee fee = payment.getFee();

        paymentRepository.delete(payment);
        paymentRepository.flush();

        // Re-sync fee status after deletion
        if (fee != null) {
            syncFeeStatus(fee);
        }

        return true;
    }

    private void syncFeeStatus(Fee fee) {
        if (fee == null || fee.getStatus() == FeeStatus.CANCELLED) {
            return;
        }
        BigDecimal totalPaid = paymentRepository.getTotalPaidByFeeId(fee.getId());

        if (totalPaid.compareTo(BigDecimal.ZERO) == 0) {
            fee.setStatus(FeeStatus.UNPAID);
        } else if (totalPaid.compareTo(fee.getAmount()) >= 0) {
            fee.setStatus(FeeStatus.PAID);
        } else {
            fee.setStatus(FeeStatus.IN_PROGRESS);
        }
        feeRepository.save(fee);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<Payment> findPaymentById(int id) {
        return paymentRepository.findById(id);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Payment> findAllPayments() {
        return paymentRepository.findAll();
    }

    @Override
    @Transactional(readOnly = true)
    public List<Payment> findByFeeId(int feeId) {
        return paymentRepository.findByFeeId(feeId);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Payment> findByFeeApartmentId(int apartmentId) {
        if (!apartmentRepository.existsById(apartmentId)) {
            throw new IllegalArgumentException("Apartment with id " + apartmentId + " does not exist");
        }
        return paymentRepository.findByFeeApartmentId(apartmentId);
    }

    @Override
    @Transactional(readOnly = true)
    public BigDecimal getOutstandingBalance(int feeId) {
        Fee fee = feeRepository.findById(feeId)
                .orElseThrow(() -> new IllegalArgumentException("Fee with id " + feeId + " does not exist"));

        BigDecimal totalPaid = paymentRepository.getTotalPaidByFeeId(feeId);
        BigDecimal balance = fee.getAmount().subtract(totalPaid);
        return balance.compareTo(BigDecimal.ZERO) < 0 ? BigDecimal.ZERO : balance;
    }
}
