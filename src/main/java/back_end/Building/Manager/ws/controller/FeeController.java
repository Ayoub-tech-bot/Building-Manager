package back_end.Building.Manager.ws.controller;

import back_end.Building.Manager.entity.Fee;
import back_end.Building.Manager.enums.FeeStatus;
import back_end.Building.Manager.enums.FeeType;
import back_end.Building.Manager.service.Interface.FeeService;
import back_end.Building.Manager.ws.dto.FeeDto;
import back_end.Building.Manager.ws.mapper.FeeMapper;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/fees")
public class FeeController {

    private final FeeService feeService;
    private final FeeMapper feeMapper;

    public FeeController(FeeService feeService, FeeMapper feeMapper) {
        this.feeService = feeService;
        this.feeMapper = feeMapper;
    }

    @GetMapping
    public ResponseEntity<List<FeeDto>> findAllFees() {
        List<Fee> fees = feeService.findAllByOrderByPeriodDesc();
        return ResponseEntity.ok(feeMapper.toDtos(fees));
    }

    @GetMapping("/{id}")
    public ResponseEntity<FeeDto> findFeeById(@PathVariable int id) {
        return feeService.findFeeById(id)
                .map(feeMapper::toDto)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<FeeDto> createFee(@Valid @RequestBody FeeDto feeDto) {
        Fee fee = feeMapper.toEntity(feeDto);
        Fee saved = feeService.createFee(fee);
        return ResponseEntity.status(HttpStatus.CREATED).body(feeMapper.toDto(saved));
    }

    @PutMapping("/{id}")
    public ResponseEntity<FeeDto> updateFee(@PathVariable int id, @Valid @RequestBody FeeDto feeDto) {
        Fee fee = feeMapper.toEntity(feeDto);
        return feeService.updateFee(id, fee)
                .map(feeMapper::toDto)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteFee(@PathVariable int id) {
        if (!feeService.deleteFee(id)) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/apartment/{apartmentId}")
    public ResponseEntity<List<FeeDto>> findByApartmentId(@PathVariable int apartmentId) {
        List<Fee> fees = feeService.findByApartmentId(apartmentId);
        return ResponseEntity.ok(feeMapper.toDtos(fees));
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<List<FeeDto>> findByStatus(@PathVariable FeeStatus status) {
        List<Fee> fees = feeService.findByStatus(status);
        return ResponseEntity.ok(feeMapper.toDtos(fees));
    }

    @GetMapping("/filter")
    public ResponseEntity<List<FeeDto>> findByStatusAndType(@RequestParam FeeStatus status,
                                                            @RequestParam FeeType type) {
        List<Fee> fees = feeService.findByStatusAndType(status, type);
        return ResponseEntity.ok(feeMapper.toDtos(fees));
    }
}
