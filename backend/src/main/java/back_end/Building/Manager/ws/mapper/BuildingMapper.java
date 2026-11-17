package back_end.Building.Manager.ws.mapper;

import back_end.Building.Manager.entity.Building;
import back_end.Building.Manager.ws.dto.BuildingDto;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Component;

import java.util.Collections;
import java.util.List;

@Component
public class BuildingMapper {

    public Building toEntity(BuildingDto dto) {
        if (dto == null) {
            return null;
        }
        Building building = new Building();
        BeanUtils.copyProperties(dto, building);
        return building;
    }

    public BuildingDto toDto(Building entity) {
        if (entity == null) {
            return null;
        }
        BuildingDto dto = new BuildingDto();
        BeanUtils.copyProperties(entity, dto);
        if (entity.getResidence() != null) {
            dto.setResidenceId(entity.getResidence().getId());
        }
        return dto;
    }

    public List<BuildingDto> toDtos(List<Building> entities) {
        if (entities == null) {
            return Collections.emptyList();
        }
        return entities.stream().map(this::toDto).toList();
    }

    public List<Building> toEntities(List<BuildingDto> dtos) {
        if (dtos == null) {
            return Collections.emptyList();
        }
        return dtos.stream().map(this::toEntity).toList();
    }
}

