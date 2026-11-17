package back_end.Building.Manager.repository;

import back_end.Building.Manager.entity.Building;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BuildingRepository extends JpaRepository<Building, Integer> {
    List<Building> findByResidenceId(int residenceId);
}

