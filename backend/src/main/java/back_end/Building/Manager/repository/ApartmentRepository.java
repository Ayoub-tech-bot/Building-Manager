package back_end.Building.Manager.repository;

import back_end.Building.Manager.entity.Apartment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ApartmentRepository extends JpaRepository<Apartment, Integer> {

    /** All apartments that belong to a residence (legacy / direct link). */
    List<Apartment> findByResidenceId(int residenceId);

    /** All apartments inside a specific building. */
    List<Apartment> findByBuildingId(int buildingId);

    Apartment findApartmentById(int apartmentId);
}
