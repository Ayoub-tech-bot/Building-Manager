package back_end.Building.Manager.repository;

import back_end.Building.Manager.entity.Payment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Integer> {
    List<Payment> findByFeeId(int feeId);
    List<Payment> findByFeeApartmentId(int apartmentId);
    @Query("SELECT COALESCE(SUM(p.amount), 0) FROM Payment p WHERE p.fee.id = :feeId")
    BigDecimal getTotalPaidByFeeId(@Param("feeId") int feeId);
}
