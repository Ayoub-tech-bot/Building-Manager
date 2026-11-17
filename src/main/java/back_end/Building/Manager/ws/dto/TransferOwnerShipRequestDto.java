package back_end.Building.Manager.ws.dto;

import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;
import java.util.UUID;

public class TransferOwnerShipRequestDto {

    @NotNull(message = "New owner ID is required")
    private UUID newOwnerId;

    private LocalDate transferDate;

    public TransferOwnerShipRequestDto() {}

    public TransferOwnerShipRequestDto(UUID newOwnerId, LocalDate transferDate) {
        this.newOwnerId = newOwnerId;
        this.transferDate = transferDate;
    }

    public UUID getNewOwnerId() {
        return newOwnerId;
    }

    public void setNewOwnerId(UUID newOwnerId) {
        this.newOwnerId = newOwnerId;
    }

    public LocalDate getTransferDate() {
        return transferDate;
    }

    public void setTransferDate(LocalDate transferDate) {
        this.transferDate = transferDate;
    }
}
