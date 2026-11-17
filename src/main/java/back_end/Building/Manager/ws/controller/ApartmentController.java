package back_end.Building.Manager.ws.controller;

import back_end.Building.Manager.entity.Apartment;
import back_end.Building.Manager.entity.Residence;
import back_end.Building.Manager.service.Interface.ApartmentService;
import back_end.Building.Manager.ws.dto.ApartmentDto;
import back_end.Building.Manager.ws.dto.ResidenceDto;
import back_end.Building.Manager.ws.mapper.ApartmentMapper;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/v1/apartments")
public class ApartmentController {
    private final ApartmentService apartmentService;
    private final ApartmentMapper apartmentMapper;
    public ApartmentController(ApartmentService apartmentService, ApartmentMapper apartmentMapper) {
        this.apartmentService = apartmentService;
        this.apartmentMapper =  apartmentMapper;
    }

    @GetMapping
    public ResponseEntity<List<ApartmentDto>> findAllApartments() {
        List<Apartment> list = apartmentService.findAllApartments();
        return ResponseEntity.ok(apartmentMapper.toDtos(list));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApartmentDto> findApartmentById(@PathVariable int id) {
        return apartmentService.findApartmentById(id)
                .map(apartmentMapper::toDto)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<ApartmentDto> createApartment(@RequestBody ApartmentDto apartmentDtoDto) {
        Apartment apartment = apartmentMapper.toEntity(apartmentDtoDto);
        Apartment saved = apartmentService.createApartment(apartmentDtoDto.getResidenceId(),apartment);
        return ResponseEntity.status(HttpStatus.CREATED).body(apartmentMapper.toDto(saved));
    }
    @PutMapping("/{id}")
    public ResponseEntity<ApartmentDto> updateApartment(@PathVariable int id,@RequestBody ApartmentDto apartmentDto) {
        Apartment apartment = apartmentMapper.toEntity(apartmentDto);
        return apartmentService.updateApartment(id, apartment)
                .map(apartmentMapper::toDto)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteApartment(@PathVariable int id) {
        if (!apartmentService.deleteApartment(id)) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.noContent().build();
    }
    @GetMapping("/residence/{residenceId}")
    public ResponseEntity<List<ApartmentDto>> findByResidenceId(@PathVariable int residenceId) {
        List<Apartment> list = apartmentService.findByResidenceId(residenceId);
        return ResponseEntity.ok(apartmentMapper.toDtos(list));

    }








}
