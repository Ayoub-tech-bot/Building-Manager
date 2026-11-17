package back_end.Building.Manager.service.Interface;

import back_end.Building.Manager.entity.Residence;

import java.util.List;
import java.util.Optional;

public interface ResidenceService {
    List<Residence> findAllResidences();
    Optional<Residence> findResidenceById(int residenceId);
    Residence createResidence(Residence residence);
    Optional<Residence> updateResidence(int id, Residence residence);
    boolean deleteResidence(int residenceId);
}
