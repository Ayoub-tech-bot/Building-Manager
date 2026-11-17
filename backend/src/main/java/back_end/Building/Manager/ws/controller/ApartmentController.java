package back_end.Building.Manager.ws.controller;

import back_end.Building.Manager.entity.Apartment;
import back_end.Building.Manager.service.Interface.ApartmentService;
import back_end.Building.Manager.ws.dto.ApartmentDto;
import back_end.Building.Manager.ws.mapper.ApartmentMapper;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/apartments")
public class ApartmentController {

    private final ApartmentService apartmentService;
    private final ApartmentMapper  apartmentMapper;

    public ApartmentController(ApartmentService apartmentService,
                               ApartmentMapper  apartmentMapper) {
        this.apartmentService = apartmentService;
        this.apartmentMapper  = apartmentMapper;
    }

    // ── GET all ───────────────────────────────────────────────────────────────
    @GetMapping
    public ResponseEntity<List<ApartmentDto>> findAllApartments() {
        return ResponseEntity.ok(apartmentMapper.toDtos(apartmentService.findAllApartments()));
    }

    // ── GET by id ─────────────────────────────────────────────────────────────
    @GetMapping("/{id}")
    public ResponseEntity<ApartmentDto> findApartmentById(@PathVariable int id) {
        return apartmentService.findApartmentById(id)
                .map(apartmentMapper::toDto)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // ── GET by residence ──────────────────────────────────────────────────────
    @GetMapping("/residence/{residenceId}")
    public ResponseEntity<List<ApartmentDto>> findByResidenceId(@PathVariable int residenceId) {
        return ResponseEntity.ok(
                apartmentMapper.toDtos(apartmentService.findByResidenceId(residenceId)));
    }

    // ── GET by building ───────────────────────────────────────────────────────
    @GetMapping("/building/{buildingId}")
    public ResponseEntity<List<ApartmentDto>> findByBuildingId(@PathVariable int buildingId) {
        return ResponseEntity.ok(
                apartmentMapper.toDtos(apartmentService.findByBuildingId(buildingId)));
    }

    // ── POST ──────────────────────────────────────────────────────────────────
    /**
     * If {@code buildingId} is supplied (non-null, > 0) the apartment is linked
     * to that building (3-tier hierarchy).  Otherwise it falls back to
     * {@code residenceId} for backward-compatibility.
     */
    @PostMapping
    public ResponseEntity<ApartmentDto> createApartment(@RequestBody ApartmentDto dto) {
        Apartment apartment = apartmentMapper.toEntity(dto);
        Apartment saved;

        if (dto.getBuildingId() != null && dto.getBuildingId() > 0) {
            saved = apartmentService.createApartmentInBuilding(dto.getBuildingId(), apartment);
        } else {
            saved = apartmentService.createApartment(dto.getResidenceId(), apartment);
        }

        return ResponseEntity.status(HttpStatus.CREATED).body(apartmentMapper.toDto(saved));
    }

    // ── PUT ───────────────────────────────────────────────────────────────────
    @PutMapping("/{id}")
    public ResponseEntity<ApartmentDto> updateApartment(@PathVariable int id,
                                                        @RequestBody ApartmentDto dto) {
        Apartment apartment = apartmentMapper.toEntity(dto);
        return apartmentService.updateApartment(id, apartment)
                .map(apartmentMapper::toDto)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // ── DELETE ────────────────────────────────────────────────────────────────
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteApartment(@PathVariable int id) {
        if (!apartmentService.deleteApartment(id)) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.noContent().build();
    }
}
