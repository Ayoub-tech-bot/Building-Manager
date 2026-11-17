package back_end.Building.Manager.ws.mapper;

import back_end.Building.Manager.entity.Apartment;
import back_end.Building.Manager.ws.dto.ApartmentDto;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Component;

import java.util.Collections;
import java.util.List;
@Component
public class ApartmentMapper {

    public Apartment toEntity(ApartmentDto dto) {
        if (dto == null) {
            return null;
        }
        Apartment apartment = new Apartment();
        BeanUtils.copyProperties(dto, apartment);
        return apartment;
    }

    public ApartmentDto toDto(Apartment entity) {
        if (entity == null) return null;
        ApartmentDto apartmentDto = new ApartmentDto();
        BeanUtils.copyProperties(entity, apartmentDto);
        if (entity.getResidence() != null) {
            apartmentDto.setResidenceId(entity.getResidence().getId());
        }
        return apartmentDto;
    }

    public List<ApartmentDto> toDtos(List<Apartment> entities) {
        if (entities == null) {
            return Collections.emptyList();
        }
        return entities.stream().map(this::toDto).toList();
    }

    public List<Apartment> toEntities(List<ApartmentDto> dtos) {
        if (dtos == null) {
            return Collections.emptyList();
        }
        return dtos.stream().map(this::toEntity).toList();
    }
}
