package back_end.Building.Manager.ws.dto;

import java.time.LocalDate;
import java.util.UUID;

public class OwnerShipDto {

    private int id;
    private int apartmentId;
    private String unitNumber;
    private UUID ownerId;
    private String ownerUsername;
    private String ownerEmail;
    private LocalDate startDate;
    private LocalDate endDate;
    private boolean active;

    public OwnerShipDto() {}

    public OwnerShipDto(int id, int apartmentId, String unitNumber, UUID ownerId,
                        String ownerUsername, String ownerEmail, LocalDate startDate,
                        LocalDate endDate, boolean active) {
        this.id = id;
        this.apartmentId = apartmentId;
        this.unitNumber = unitNumber;
        this.ownerId = ownerId;
        this.ownerUsername = ownerUsername;
        this.ownerEmail = ownerEmail;
        this.startDate = startDate;
        this.endDate = endDate;
        this.active = active;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public int getApartmentId() {
        return apartmentId;
    }

    public void setApartmentId(int apartmentId) {
        this.apartmentId = apartmentId;
    }

    public String getUnitNumber() {
        return unitNumber;
    }

    public void setUnitNumber(String unitNumber) {
        this.unitNumber = unitNumber;
    }

    public UUID getOwnerId() {
        return ownerId;
    }

    public void setOwnerId(UUID ownerId) {
        this.ownerId = ownerId;
    }

    public String getOwnerUsername() {
        return ownerUsername;
    }

    public void setOwnerUsername(String ownerUsername) {
        this.ownerUsername = ownerUsername;
    }

    public String getOwnerEmail() {
        return ownerEmail;
    }

    public void setOwnerEmail(String ownerEmail) {
        this.ownerEmail = ownerEmail;
    }

    public LocalDate getStartDate() {
        return startDate;
    }

    public void setStartDate(LocalDate startDate) {
        this.startDate = startDate;
    }

    public LocalDate getEndDate() {
        return endDate;
    }

    public void setEndDate(LocalDate endDate) {
        this.endDate = endDate;
    }

    public boolean isActive() {
        return active;
    }

    public void setActive(boolean active) {
        this.active = active;
    }
}
