package back_end.Building.Manager.ws.mapper;

import back_end.Building.Manager.entity.Fee;
import back_end.Building.Manager.repository.ApartmentRepository;
import back_end.Building.Manager.ws.dto.FeeDto;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Component;

import java.util.Collections;
import java.util.List;

@Component
public class FeeMapper {
    private final ApartmentRepository apartmentRepository;
    public FeeMapper(ApartmentRepository apartmentRepository) {
        this.apartmentRepository = apartmentRepository;
    }


    public Fee toEntity(FeeDto dto) {
        if (dto == null) {
            return null;
        }
        Fee fee = new Fee();
        fee.setId(dto.getId());
        fee.setPeriod(dto.getPeriod());
        fee.setAmount(dto.getAmount());
        fee.setDueDate(dto.getDueDate());
        fee.setType(dto.getType());
        fee.setStatus(dto.getStatus());
        if (dto.getApartmentId() > 0) {
            apartmentRepository.findById(dto.getApartmentId()).ifPresent(fee::setApartment);
        }

        return fee;
    }

    public FeeDto toDto(Fee entity) {
        if (entity == null) {
            return null;
        }
        FeeDto feeDto = new FeeDto();
        feeDto.setId(entity.getId());
        feeDto.setPeriod(entity.getPeriod());
        feeDto.setAmount(entity.getAmount());
        feeDto.setDueDate(entity.getDueDate());
        feeDto.setType(entity.getType());
        feeDto.setStatus(entity.getStatus());
        if(entity.getApartment() != null){
            feeDto.setApartmentId(entity.getApartment().getId());
        }

        return feeDto;
    }

    public List<FeeDto> toDtos(List<Fee> entities) {
        if (entities == null) {
            return Collections.emptyList();
        }
        return entities.stream().map(this::toDto).toList();
    }

    public List<Fee> toEntities(List<FeeDto> dtos) {
        if (dtos == null) {
            return Collections.emptyList();
        }
        return dtos.stream().map(this::toEntity).toList();
    }
}
