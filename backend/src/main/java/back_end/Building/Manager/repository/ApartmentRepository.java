package back_end.Building.Manager.repository;

import back_end.Building.Manager.entity.Apartment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ApartmentRepository extends JpaRepository<Apartment, Integer> {

    List<Apartment> findByResidenceId(int residenceId);

    Apartment findApartmentById(int apartmentId);
}
