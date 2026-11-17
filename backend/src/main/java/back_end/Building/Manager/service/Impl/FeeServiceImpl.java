package back_end.Building.Manager.service.Impl;

import back_end.Building.Manager.entity.Fee;
import back_end.Building.Manager.enums.FeeStatus;
import back_end.Building.Manager.enums.FeeType;
import back_end.Building.Manager.repository.ApartmentRepository;
import back_end.Building.Manager.repository.FeeRepository;
import back_end.Building.Manager.service.Interface.FeeService;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class FeeServiceImpl implements FeeService {
    private final FeeRepository feeRepository;
    private final ApartmentRepository apartmentRepository;

    public FeeServiceImpl(FeeRepository feeRepository, ApartmentRepository apartmentRepository) {
        this.feeRepository = feeRepository;
        this.apartmentRepository = apartmentRepository;
    }



    @Override
    @Transactional
    public Fee createFee(Fee fee) {
        if (fee == null) {
            throw new IllegalArgumentException("Can't create fee without fee data");
        }
        if (fee.getApartment() == null || !apartmentRepository.existsById(fee.getApartment().getId())) {
            throw new IllegalArgumentException("Cannot create fee: Apartment does not exist");
        }
        if (fee.getStatus() == null) {
            fee.setStatus(FeeStatus.UNPAID);
        }
        return feeRepository.save(fee);
    }

    @Override
    @Transactional
    public Optional<Fee> updateFee(int id, Fee updatedFee) {
        if (updatedFee == null) {
            throw new IllegalArgumentException("Can't update fee without fee data");
        }
        return feeRepository.findById(id).map(exist -> {
            if (updatedFee.getStatus() != null) {
                exist.setStatus(updatedFee.getStatus());
            }
            if (updatedFee.getAmount() != null) {
                exist.setAmount(updatedFee.getAmount());
            }
            if (updatedFee.getType() != null) {
                exist.setType(updatedFee.getType());
            }
            if (updatedFee.getPeriod() != null) {
                exist.setPeriod(updatedFee.getPeriod());
            }
            if (updatedFee.getDueDate() != null) {
                exist.setDueDate(updatedFee.getDueDate());
            }
            if (updatedFee.getApartment() != null && apartmentRepository.existsById(updatedFee.getApartment().getId())) {
                exist.setApartment(updatedFee.getApartment());
            }
            return feeRepository.save(exist);
        });
    }

    @Override
    public boolean deleteFee(int id) {
        if (!feeRepository.existsById(id)) {
            return false;
        }
        feeRepository.deleteById(id);
        return true;
    }

    @Override
    public Optional<Fee> findFeeById(int id) {
        return feeRepository.findById(id);
    }

    @Override
    public List<Fee> findAllByOrderByPeriodDesc() {
        return feeRepository.findAllByOrderByPeriodDesc();
    }

    @Override
    public List<Fee> findByStatus(FeeStatus status) {
        return feeRepository.findByStatus(status);
    }

    @Override
    public List<Fee> findByStatusAndType(FeeStatus status, FeeType type) {
        return feeRepository.findByStatusAndType(status, type);
    }

    @Override
    public List<Fee> findByApartmentId(int apartmentId) {
        if (!apartmentRepository.existsById(apartmentId)) {
            throw new IllegalArgumentException("Can't find apartment with id " + apartmentId);
        }
        return feeRepository.findByApartmentId(apartmentId);
    }
}
