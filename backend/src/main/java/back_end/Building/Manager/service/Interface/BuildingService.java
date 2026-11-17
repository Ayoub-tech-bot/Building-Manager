package back_end.Building.Manager.service.Interface;

import back_end.Building.Manager.entity.Building;

import java.util.List;
import java.util.Optional;

public interface BuildingService {
    List<Building> findAllBuildings();
    Optional<Building> findBuildingById(int id);
    Building createBuilding(int residenceId, Building building);
    Optional<Building> updateBuilding(int id, Building building);
    boolean deleteBuilding(int id);
    List<Building> findByResidenceId(int residenceId);
}

