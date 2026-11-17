package back_end.Building.Manager.service.Impl;

import back_end.Building.Manager.entity.Building;
import back_end.Building.Manager.entity.Residence;
import back_end.Building.Manager.repository.BuildingRepository;
import back_end.Building.Manager.repository.ResidenceRepository;
import back_end.Building.Manager.service.Interface.BuildingService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class BuildingServiceImpl implements BuildingService {

    private final BuildingRepository buildingRepository;
    private final ResidenceRepository residenceRepository;

    public BuildingServiceImpl(BuildingRepository buildingRepository, ResidenceRepository residenceRepository) {
        this.buildingRepository = buildingRepository;
        this.residenceRepository = residenceRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public List<Building> findAllBuildings() {
        return buildingRepository.findAll();
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<Building> findBuildingById(int id) {
        return buildingRepository.findById(id);
    }

    @Override
    public Building createBuilding(int residenceId, Building building) {
        Residence residence = residenceRepository.findById(residenceId)
                .orElseGet(() -> {
                    List<Residence> all = residenceRepository.findAll();
                    if (!all.isEmpty()) return all.get(0);
                    return residenceRepository.save(new Residence("Résidence Les Oliviers", "Casablanca, Maroc", "0522441860"));
                });
        building.setResidence(residence);
        return buildingRepository.save(building);
    }

    @Override
    public Optional<Building> updateBuilding(int id, Building updatedBuilding) {
        if (updatedBuilding == null) {
            throw new IllegalArgumentException("Building cannot be null");
        }
        return buildingRepository.findById(id).map(existing -> {
            existing.setName(updatedBuilding.getName());
            existing.setFloorsCount(updatedBuilding.getFloorsCount());
            return buildingRepository.save(existing);
        });
    }

    @Override
    public boolean deleteBuilding(int id) {
        if (!buildingRepository.existsById(id)) {
            return false;
        }
        buildingRepository.deleteById(id);
        return true;
    }

    @Override
    @Transactional(readOnly = true)
    public List<Building> findByResidenceId(int residenceId) {
        return buildingRepository.findByResidenceId(residenceId);
    }
}

