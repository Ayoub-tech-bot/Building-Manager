package back_end.Building.Manager.service.Impl;

import back_end.Building.Manager.repository.ResidenceRepository;
import back_end.Building.Manager.entity.Residence;
import back_end.Building.Manager.service.Interface.ResidenceService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class ResidenceServiceImpl implements ResidenceService {

    private final ResidenceRepository repository;

    public ResidenceServiceImpl(ResidenceRepository repository) {
        this.repository = repository;
    }

    @Override
    @Transactional(readOnly = true)
    public List<Residence> findAllResidences() {
        return repository.findAll();
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<Residence> findResidenceById(int residenceId) {
        return repository.findById(residenceId);
    }

    @Override
    public Residence createResidence(Residence residence) {
        if (residence == null) {
            throw new IllegalArgumentException("Residence cannot be null");
        }
        return repository.save(residence);
    }

    @Override
    public Optional<Residence> updateResidence(int id, Residence updatedResidence) {
        return repository.findById(id)
                .map(existing -> {
                    existing.setName(updatedResidence.getName());
                    existing.setAddress(updatedResidence.getAddress());
                    existing.setNumber(updatedResidence.getNumber());
                    return repository.save(existing);
                });
    }

    @Override
    public boolean deleteResidence(int residenceId) {
        if (!repository.existsById(residenceId)) {
            return false;
        }
        repository.deleteById(residenceId);
        return true;
    }
}
