package back_end.Building.Manager.ws.dto;

import jakarta.validation.constraints.NotNull;
import java.util.UUID;

public class AssignOwnerShipRequestDto {

    @NotNull(message = "Owner ID is required")
    private UUID ownerId;

    @NotNull(message = "Apartment ID is required")
    private Integer apartmentId;

    public AssignOwnerShipRequestDto() {}

    public AssignOwnerShipRequestDto(UUID ownerId, Integer apartmentId) {
        this.ownerId = ownerId;
        this.apartmentId = apartmentId;
    }

    public UUID getOwnerId() {
        return ownerId;
    }

    public void setOwnerId(UUID ownerId) {
        this.ownerId = ownerId;
    }

    public Integer getApartmentId() {
        return apartmentId;
    }

    public void setApartmentId(Integer apartmentId) {
        this.apartmentId = apartmentId;
    }
}
