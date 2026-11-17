package back_end.Building.Manager.ws.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class BuildingDto {

    private int id;

    @NotBlank(message = "Building name is required (e.g. Bâtiment A)")
    private String name;

    private Integer floorsCount;

    @NotNull(message = "Residence ID is required")
    private int residenceId;
    private Integer apartmentsCount;
    private Double totalAreaM2;

    public BuildingDto() {}

    public BuildingDto(int id, String name, Integer floorsCount, int residenceId) {
        this.id = id;
        this.name = name;
        this.floorsCount = floorsCount;
        this.residenceId = residenceId;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Integer getFloorsCount() {
        return floorsCount;
    }

    public void setFloorsCount(Integer floorsCount) {
        this.floorsCount = floorsCount;
    }

    public int getResidenceId() {
        return residenceId;
    }

    public void setResidenceId(int residenceId) {
        this.residenceId = residenceId;
    }

    public Integer getApartmentsCount() {
        return apartmentsCount;
    }

    public void setApartmentsCount(Integer apartmentsCount) {
        this.apartmentsCount = apartmentsCount;
    }

    public Double getTotalAreaM2() {
        return totalAreaM2;
    }

    public void setTotalAreaM2(Double totalAreaM2) {
        this.totalAreaM2 = totalAreaM2;
    }
}

