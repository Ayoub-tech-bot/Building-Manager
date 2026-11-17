package back_end.Building.Manager.repository;

import back_end.Building.Manager.entity.OwnerShip;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface OwnerShipRepository extends JpaRepository<OwnerShip, Integer> {
    Optional<OwnerShip> findByApartmentIdAndEndDateIsNull(int apartmentId);
    List<OwnerShip> findByOwnerIdAndEndDateIsNull(UUID ownerId);
    List<OwnerShip> findByApartmentIdOrderByStartDateDesc(int apartmentId);
    boolean existsByApartmentIdAndEndDateIsNull(int apartmentId);

}
