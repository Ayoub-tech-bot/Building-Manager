package back_end.Building.Manager.ws.mapper;

import back_end.Building.Manager.entity.Apartment;
import back_end.Building.Manager.entity.Building;
import back_end.Building.Manager.entity.Residence;
import back_end.Building.Manager.ws.dto.ApartmentDto;
import org.springframework.stereotype.Component;

import java.util.Collections;
import java.util.List;

@Component
public class ApartmentMapper {

    /**
     * DTO → Entity.
     * NOTE: Building / Residence associations are NOT set here because we need
     * repository access.  The service layer is responsible for linking them.
     */
    public Apartment toEntity(ApartmentDto dto) {
        if (dto == null) return null;
        Apartment apt = new Apartment();
        apt.setId(dto.getId());
        apt.setUnitNumber(dto.getUnitNumber());
        apt.setSizeM2(dto.getSizeM2());
        apt.setFloor(dto.getFloor());
        return apt;
    }

    /**
     * Entity → DTO.
     * Populates the full hierarchy: building info + residence info (via building
     * or directly on the apartment for legacy rows).
     */
    public ApartmentDto toDto(Apartment entity) {
        if (entity == null) return null;

        ApartmentDto dto = new ApartmentDto();
        dto.setId(entity.getId());
        dto.setUnitNumber(entity.getUnitNumber());
        dto.setSizeM2(entity.getSizeM2());
        dto.setFloor(entity.getFloor());

        // Building (direct parent)
        Building building = entity.getBuilding();
        if (building != null) {
            dto.setBuildingId(building.getId());
            dto.setBuildingName(building.getName());
        }

        // Residence (top-level) — resolved through building or directly
        Residence residence = entity.getResidence();
        if (residence != null) {
            dto.setResidenceId(residence.getId());
            dto.setResidenceName(residence.getName());
        }

        return dto;
    }

    public List<ApartmentDto> toDtos(List<Apartment> entities) {
        if (entities == null) return Collections.emptyList();
        return entities.stream().map(this::toDto).toList();
    }

    public List<Apartment> toEntities(List<ApartmentDto> dtos) {
        if (dtos == null) return Collections.emptyList();
        return dtos.stream().map(this::toEntity).toList();
    }
}
