package back_end.Building.Manager.ws.controller;

import back_end.Building.Manager.entity.Building;
import back_end.Building.Manager.service.Interface.BuildingService;
import back_end.Building.Manager.ws.dto.BuildingDto;
import back_end.Building.Manager.ws.mapper.BuildingMapper;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/buildings")
public class BuildingController {

    private final BuildingService buildingService;
    private final BuildingMapper buildingMapper;

    public BuildingController(BuildingService buildingService, BuildingMapper buildingMapper) {
        this.buildingService = buildingService;
        this.buildingMapper = buildingMapper;
    }

    @GetMapping
    public ResponseEntity<List<BuildingDto>> findAllBuildings() {
        List<Building> list = buildingService.findAllBuildings();
        return ResponseEntity.ok(buildingMapper.toDtos(list));
    }

    @GetMapping("/{id}")
    public ResponseEntity<BuildingDto> findBuildingById(@PathVariable int id) {
        return buildingService.findBuildingById(id)
                .map(buildingMapper::toDto)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<BuildingDto> createBuilding(@Valid @RequestBody BuildingDto buildingDto) {
        Building building = buildingMapper.toEntity(buildingDto);
        Building saved = buildingService.createBuilding(buildingDto.getResidenceId(), building);
        return ResponseEntity.status(HttpStatus.CREATED).body(buildingMapper.toDto(saved));
    }

    @PutMapping("/{id}")
    public ResponseEntity<BuildingDto> updateBuilding(@PathVariable int id, @Valid @RequestBody BuildingDto buildingDto) {
        Building building = buildingMapper.toEntity(buildingDto);
        return buildingService.updateBuilding(id, building)
                .map(buildingMapper::toDto)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteBuilding(@PathVariable int id) {
        if (!buildingService.deleteBuilding(id)) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/residence/{residenceId}")
    public ResponseEntity<List<BuildingDto>> findByResidenceId(@PathVariable int residenceId) {
        List<Building> list = buildingService.findByResidenceId(residenceId);
        return ResponseEntity.ok(buildingMapper.toDtos(list));
    }
}

