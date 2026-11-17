package back_end.Building.Manager.repository;

import back_end.Building.Manager.entity.Fee;
import back_end.Building.Manager.enums.FeeStatus;
import back_end.Building.Manager.enums.FeeType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FeeRepository extends JpaRepository<Fee, Integer> {
    List<Fee> findAllByOrderByPeriodDesc();
    List<Fee> findByStatus(FeeStatus status);
    List<Fee> findByStatusAndType(FeeStatus status, FeeType type);
    List<Fee> findByApartmentId(int apartmentId);
}
