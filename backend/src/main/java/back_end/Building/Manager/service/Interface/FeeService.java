package back_end.Building.Manager.service.Interface;

import back_end.Building.Manager.entity.Fee;
import back_end.Building.Manager.enums.FeeStatus;
import back_end.Building.Manager.enums.FeeType;

import java.util.List;
import java.util.Optional;

public interface FeeService {
    Fee createFee(Fee fee);
    Optional<Fee> updateFee(int id, Fee fee);
    boolean deleteFee(int id);
    Optional<Fee> findFeeById(int id);
    List<Fee> findAllByOrderByPeriodDesc();
    List<Fee> findByStatus(FeeStatus status);
    List<Fee> findByStatusAndType(FeeStatus status, FeeType type);
    List<Fee> findByApartmentId(int apartmentId);
}
