package back_end.Building.Manager.ws.controller;

import back_end.Building.Manager.entity.Fee;
import back_end.Building.Manager.entity.Payment;
import back_end.Building.Manager.service.Interface.FeeService;
import back_end.Building.Manager.service.Interface.PaymentService;
import back_end.Building.Manager.ws.dto.FeeBalanceDto;
import back_end.Building.Manager.ws.dto.PaymentDto;
import back_end.Building.Manager.ws.mapper.PaymentMapper;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/v1/payments")
public class PaymentController {

    private final PaymentService paymentService;
    private final PaymentMapper paymentMapper;
    private final FeeService feeService;

    public PaymentController(PaymentService paymentService,
                             PaymentMapper paymentMapper,
                             FeeService feeService) {
        this.paymentService = paymentService;
        this.paymentMapper = paymentMapper;
        this.feeService = feeService;
    }

    @GetMapping
    public ResponseEntity<List<PaymentDto>> findAllPayments() {
        List<Payment> payments = paymentService.findAllPayments();
        return ResponseEntity.ok(paymentMapper.toDtos(payments));
    }

    @GetMapping("/{id}")
    public ResponseEntity<PaymentDto> findPaymentById(@PathVariable int id) {
        return paymentService.findPaymentById(id)
                .map(paymentMapper::toDto)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<PaymentDto> createPayment(@Valid @RequestBody PaymentDto paymentDto) {
        Payment payment = paymentMapper.toEntity(paymentDto);
        Payment saved = paymentService.createPayment(payment);
        return ResponseEntity.status(HttpStatus.CREATED).body(paymentMapper.toDto(saved));
    }

    @PutMapping("/{id}")
    public ResponseEntity<PaymentDto> updatePayment(@PathVariable int id, @Valid @RequestBody PaymentDto paymentDto) {
        Payment payment = paymentMapper.toEntity(paymentDto);
        return paymentService.updatePayment(id, payment)
                .map(paymentMapper::toDto)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePayment(@PathVariable int id) {
        if (!paymentService.deletePayment(id)) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/fee/{feeId}")
    public ResponseEntity<List<PaymentDto>> findByFeeId(@PathVariable int feeId) {
        List<Payment> payments = paymentService.findByFeeId(feeId);
        return ResponseEntity.ok(paymentMapper.toDtos(payments));
    }

    @GetMapping("/apartment/{apartmentId}")
    public ResponseEntity<List<PaymentDto>> findByApartmentId(@PathVariable int apartmentId) {
        List<Payment> payments = paymentService.findByFeeApartmentId(apartmentId);
        return ResponseEntity.ok(paymentMapper.toDtos(payments));
    }

    @GetMapping("/fee/{feeId}/balance")
    public ResponseEntity<FeeBalanceDto> getFeeBalance(@PathVariable int feeId) {
        return feeService.findFeeById(feeId).map(fee -> {
            BigDecimal outstandingBalance = paymentService.getOutstandingBalance(feeId);
            BigDecimal totalPaid = fee.getAmount().subtract(outstandingBalance);
            if (totalPaid.compareTo(BigDecimal.ZERO) < 0) {
                totalPaid = BigDecimal.ZERO;
            }

            FeeBalanceDto balanceDto = new FeeBalanceDto(
                    fee.getId(),
                    fee.getPeriod(),
                    fee.getAmount(),
                    totalPaid,
                    outstandingBalance,
                    fee.getStatus()
            );
            return ResponseEntity.ok(balanceDto);
        }).orElse(ResponseEntity.notFound().build());
    }
}
