package back_end.Building.Manager.entity;

import jakarta.persistence.*;

import java.math.BigDecimal;

@Entity
public class Apartment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;
    private String unitNumber;
    private BigDecimal sizeM2;
    @ManyToOne
    @JoinColumn(name = "residence_id")
    private Residence residence;

    public Apartment() {}

    public Apartment(BigDecimal sizeM2, String unitNumber) {
        this.sizeM2 = sizeM2;
        this.unitNumber = unitNumber;
    }

    public Residence getResidence() {
        return residence;
    }

    public void setResidence(Residence residence) {
        this.residence = residence;
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

    @Override
    public String toString() {
        return "Apartment{" +
                "id=" + id +
                ", unitNumber='" + unitNumber + '\'' +
                ", sizeM2=" + sizeM2 +
                '}';
    }
}
