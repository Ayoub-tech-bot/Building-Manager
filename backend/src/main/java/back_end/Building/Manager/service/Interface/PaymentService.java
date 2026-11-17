package back_end.Building.Manager.service.Interface;

import back_end.Building.Manager.entity.Payment;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

public interface PaymentService {
    Payment createPayment(Payment payment);
    Optional<Payment> updatePayment(int id, Payment payment);
    boolean deletePayment(int id);
    Optional<Payment> findPaymentById(int id);
    List<Payment> findAllPayments();
    List<Payment> findByFeeId(int feeId);
    List<Payment> findByFeeApartmentId(int apartmentId);
    BigDecimal getOutstandingBalance(int feeId);
}
