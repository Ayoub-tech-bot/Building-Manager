package back_end.Building.Manager.ws.controller;

import back_end.Building.Manager.entity.Apartment;
import back_end.Building.Manager.entity.OwnerShip;
import back_end.Building.Manager.service.Interface.OwnerShipService;
import back_end.Building.Manager.ws.dto.*;
import back_end.Building.Manager.ws.mapper.ApartmentMapper;
import back_end.Building.Manager.ws.mapper.OwnerShipMapper;
import back_end.Building.Manager.ws.mapper.UserMapper;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/ownerships")
public class OwnerShipController {

    private final OwnerShipService ownerShipService;
    private final OwnerShipMapper ownerShipMapper;
    private final UserMapper userMapper;
    private final ApartmentMapper apartmentMapper;

    public OwnerShipController(OwnerShipService ownerShipService,
                               OwnerShipMapper ownerShipMapper,
                               UserMapper userMapper,
                               ApartmentMapper apartmentMapper) {
        this.ownerShipService = ownerShipService;
        this.ownerShipMapper = ownerShipMapper;
        this.userMapper = userMapper;
        this.apartmentMapper = apartmentMapper;
    }

    @PostMapping("/assign")
    public ResponseEntity<OwnerShipDto> assignOwnerShip(@Valid @RequestBody AssignOwnerShipRequestDto request) {
        OwnerShip ownerShip = ownerShipService.assignOwnerShip(request.getOwnerId(), request.getApartmentId());
        return ResponseEntity.status(HttpStatus.CREATED).body(ownerShipMapper.toDto(ownerShip));
    }

    @PostMapping("/apartments/{apartmentId}/transfer")
    public ResponseEntity<OwnerShipDto> transferOwnerShip(@PathVariable int apartmentId,
                                                          @Valid @RequestBody TransferOwnerShipRequestDto request) {
        OwnerShip newOwnerShip = ownerShipService.transferOwnerShip(
                request.getNewOwnerId(),
                apartmentId,
                request.getTransferDate()
        );
        return ResponseEntity.ok(ownerShipMapper.toDto(newOwnerShip));
    }

    @GetMapping("/apartments/{apartmentId}/current")
    public ResponseEntity<UserDto> getCurrentOwner(@PathVariable int apartmentId) {
        return ownerShipService.getCurrentOwner(apartmentId)
                .map(userMapper::toDto)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/apartments/{apartmentId}/history")
    public ResponseEntity<List<OwnerShipDto>> getApartmentHistory(@PathVariable int apartmentId) {
        List<OwnerShip> history = ownerShipService.getApartmentHistory(apartmentId);
        return ResponseEntity.ok(ownerShipMapper.toDtos(history));
    }

    @GetMapping("/owners/{ownerId}/apartments")
    public ResponseEntity<List<ApartmentDto>> getApartmentsByOwner(@PathVariable UUID ownerId) {
        List<Apartment> apartments = ownerShipService.getApartmentsByOwner(ownerId);
        return ResponseEntity.ok(apartmentMapper.toDtos(apartments));
    }
}
