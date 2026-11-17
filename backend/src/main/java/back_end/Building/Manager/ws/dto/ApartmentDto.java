package back_end.Building.Manager.ws.dto;

import java.math.BigDecimal;

public class ApartmentDto {
    private int id;
    private String unitNumber;
    private BigDecimal sizeM2;
    private Integer floor;

    // Residence (top-level) info — derived via Building
    private int residenceId;
    private String residenceName;

    // Building (direct parent) info
    private Integer buildingId;
    private String buildingName;

    public ApartmentDto() {}

    public ApartmentDto(int id, String unitNumber, BigDecimal sizeM2, int residenceId) {
        this.id = id;
        this.unitNumber = unitNumber;
        this.sizeM2 = sizeM2;
        this.residenceId = residenceId;
    }

    // ── id ───────────────────────────────────────────────────────────────────
    public int getId() { return id; }
    public void setId(int id) { this.id = id; }

    // ── unitNumber ────────────────────────────────────────────────────────────
    public String getUnitNumber() { return unitNumber; }
    public void setUnitNumber(String unitNumber) { this.unitNumber = unitNumber; }

    // ── sizeM2 ────────────────────────────────────────────────────────────────
    public BigDecimal getSizeM2() { return sizeM2; }
    public void setSizeM2(BigDecimal sizeM2) { this.sizeM2 = sizeM2; }

    // ── floor ─────────────────────────────────────────────────────────────────
    public Integer getFloor() { return floor; }
    public void setFloor(Integer floor) { this.floor = floor; }

    // ── residenceId / residenceName ───────────────────────────────────────────
    public int getResidenceId() { return residenceId; }
    public void setResidenceId(int residenceId) { this.residenceId = residenceId; }

    public String getResidenceName() { return residenceName; }
    public void setResidenceName(String residenceName) { this.residenceName = residenceName; }

    // ── buildingId / buildingName ─────────────────────────────────────────────
    public Integer getBuildingId() { return buildingId; }
    public void setBuildingId(Integer buildingId) { this.buildingId = buildingId; }

    public String getBuildingName() { return buildingName; }
    public void setBuildingName(String buildingName) { this.buildingName = buildingName; }
}
