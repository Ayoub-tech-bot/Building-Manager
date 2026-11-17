package back_end.Building.Manager.ws.mapper;

import back_end.Building.Manager.entity.Residence;
import back_end.Building.Manager.ws.dto.ResidenceDto;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Component;

import java.util.Collections;
import java.util.List;

@Component
public class ResidenceMapper {

    public Residence toEntity(ResidenceDto dto) {
        if (dto == null) {
            return null;
        }
        Residence residence = new Residence();
        BeanUtils.copyProperties(dto, residence);
        return residence;
    }

    public ResidenceDto toDto(Residence entity) {
        if (entity == null) {
            return null;
        }
        ResidenceDto residenceDto = new ResidenceDto();
        BeanUtils.copyProperties(entity, residenceDto);
        return residenceDto;
    }

    public List<ResidenceDto> toDtos(List<Residence> entities) {
        if (entities == null) {
            return Collections.emptyList();
        }
        return entities.stream().map(this::toDto).toList();
    }

    public List<Residence> toEntities(List<ResidenceDto> dtos) {
        if (dtos == null) {
            return Collections.emptyList();
        }
        return dtos.stream().map(this::toEntity).toList();
    }
}
