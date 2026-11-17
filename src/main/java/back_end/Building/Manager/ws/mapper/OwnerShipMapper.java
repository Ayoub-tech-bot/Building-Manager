package back_end.Building.Manager.ws.mapper;

import back_end.Building.Manager.entity.OwnerShip;
import back_end.Building.Manager.ws.dto.OwnerShipDto;
import org.springframework.stereotype.Component;

import java.util.Collections;
import java.util.List;

@Component
public class OwnerShipMapper {

    public OwnerShipDto toDto(OwnerShip entity) {
        if (entity == null) {
            return null;
        }
        OwnerShipDto dto = new OwnerShipDto();
        dto.setId(entity.getId());
        dto.setStartDate(entity.getStartDate());
        dto.setEndDate(entity.getEndDate());
        dto.setActive(entity.isActive());

        if (entity.getApartment() != null) {
            dto.setApartmentId(entity.getApartment().getId());
            dto.setUnitNumber(entity.getApartment().getUnitNumber());
        }

        if (entity.getOwner() != null) {
            dto.setOwnerId(entity.getOwner().getId());
            dto.setOwnerUsername(entity.getOwner().getUsername());
            dto.setOwnerEmail(entity.getOwner().getEmail());
        }

        return dto;
    }

    public List<OwnerShipDto> toDtos(List<OwnerShip> entities) {
        if (entities == null) {
            return Collections.emptyList();
        }
        return entities.stream().map(this::toDto).toList();
    }
}
