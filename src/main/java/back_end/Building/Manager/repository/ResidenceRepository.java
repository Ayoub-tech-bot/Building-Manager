package back_end.Building.Manager.repository;

import back_end.Building.Manager.entity.Residence;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ResidenceRepository extends JpaRepository<Residence, Integer> {
}
