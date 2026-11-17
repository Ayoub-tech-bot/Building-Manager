package back_end.Building.Manager.ws.controller;

import back_end.Building.Manager.entity.Residence;
import back_end.Building.Manager.service.Interface.ResidenceService;
import back_end.Building.Manager.ws.dto.ResidenceDto;
import back_end.Building.Manager.ws.mapper.ResidenceMapper;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/residences")
public class ResidenceController {

    private final ResidenceService residenceService;
    private final ResidenceMapper residenceMapper;

    public ResidenceController(ResidenceService residenceService, ResidenceMapper residenceMapper) {
        this.residenceService = residenceService;
        this.residenceMapper = residenceMapper;
    }

    @GetMapping
    public ResponseEntity<List<ResidenceDto>> findAllResidences() {
        List<Residence> residences = residenceService.findAllResidences();
        return ResponseEntity.ok(residenceMapper.toDtos(residences));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ResidenceDto> findResidenceById(@PathVariable int id) {
        return residenceService.findResidenceById(id)
                .map(residenceMapper::toDto)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<ResidenceDto> createResidence(@RequestBody ResidenceDto residenceDto) {
        Residence residence = residenceMapper.toEntity(residenceDto);
        Residence saved = residenceService.createResidence(residence);
        return ResponseEntity.status(HttpStatus.CREATED).body(residenceMapper.toDto(saved));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ResidenceDto> updateResidence(@PathVariable int id, @RequestBody ResidenceDto residenceDto) {
        Residence residence = residenceMapper.toEntity(residenceDto);
        return residenceService.updateResidence(id, residence)
                .map(residenceMapper::toDto)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteResidenceById(@PathVariable int id) {
        if (!residenceService.deleteResidence(id)) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.noContent().build();
    }
}
