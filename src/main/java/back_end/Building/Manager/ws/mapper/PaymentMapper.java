package back_end.Building.Manager.ws.mapper;

import back_end.Building.Manager.entity.Payment;
import back_end.Building.Manager.repository.FeeRepository;
import back_end.Building.Manager.ws.dto.PaymentDto;
import org.springframework.stereotype.Component;

import java.util.Collections;
import java.util.List;

@Component
public class PaymentMapper {

    private final FeeRepository feeRepository;

    public PaymentMapper(FeeRepository feeRepository) {
        this.feeRepository = feeRepository;
    }

    public Payment toEntity(PaymentDto dto) {
        if (dto == null) {
            return null;
        }

        Payment payment = new Payment();
        payment.setId(dto.getId());
        payment.setAmount(dto.getAmount());
        payment.setPaymentDate(dto.getPaymentDate());
        payment.setPaymentMethod(dto.getPaymentMethod());

        if (dto.getFeeId() > 0) {
            feeRepository.findById(dto.getFeeId()).ifPresent(payment::setFee);
        }

        return payment;
    }

    public PaymentDto toDto(Payment entity) {
        if (entity == null) {
            return null;
        }

        PaymentDto dto = new PaymentDto();
        dto.setId(entity.getId());
        dto.setAmount(entity.getAmount());
        dto.setPaymentDate(entity.getPaymentDate());
        dto.setPaymentMethod(entity.getPaymentMethod());

        if (entity.getFee() != null) {
            dto.setFeeId(entity.getFee().getId());
            if (entity.getFee().getApartment() != null) {
                dto.setApartmentId(entity.getFee().getApartment().getId());
            }
        }

        return dto;
    }

    public List<PaymentDto> toDtos(List<Payment> entities) {
        if (entities == null) {
            return Collections.emptyList();
        }
        return entities.stream().map(this::toDto).toList();
    }

    public List<Payment> toEntities(List<PaymentDto> dtos) {
        if (dtos == null) {
            return Collections.emptyList();
        }
        return dtos.stream().map(this::toEntity).toList();
    }
}
