package back_end.Building.Manager.ws.dto;

import back_end.Building.Manager.entity.Residence;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;

import java.math.BigDecimal;

public class ApartmentDto {
    private int id;
    private String unitNumber;
    private BigDecimal sizeM2;
    private int residenceId;

    public int getResidenceId() {
        return residenceId;
    }

    public void setResidenceId(int residenceId) {
        this.residenceId = residenceId;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getUnitNumber() {
        return unitNumber;
    }

    public void setUnitNumber(String unitNumber) {
        this.unitNumber = unitNumber;
    }

    public BigDecimal getSizeM2() {
        return sizeM2;
    }

    public void setSizeM2(BigDecimal sizeM2) {
        this.sizeM2 = sizeM2;
    }


    public ApartmentDto(int id, String unitNumber, BigDecimal sizeM2, int residenceId) {
        this.id = id;
        this.unitNumber = unitNumber;
        this.sizeM2 = sizeM2;
        this.residenceId = residenceId;
    }
    public ApartmentDto() {}

}
