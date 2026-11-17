package back_end.Building.Manager.entity;

import back_end.Building.Manager.enums.FeeStatus;
import back_end.Building.Manager.enums.FeeType;
import jakarta.persistence.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.YearMonth;

@Entity
public class Fee {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;
    private YearMonth period;
    private BigDecimal amount;
    @Enumerated(EnumType.STRING)
    private FeeType type;
    private LocalDate dueDate;
    @Enumerated(EnumType.STRING)
    private FeeStatus status;
    @ManyToOne
    @JoinColumn(name = "apartment_id")
    private Apartment apartment;


    public Apartment getApartment() {
        return apartment;
    }

    public void setApartment(Apartment apartment) {
        this.apartment = apartment;
    }

    public Fee() {}

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public YearMonth getPeriod() {
        return period;
    }

    public void setPeriod(YearMonth period) {
        this.period = period;
    }

    public BigDecimal getAmount() {
        return amount;
    }

    public void setAmount(BigDecimal amount) {
        this.amount = amount;
    }

    public FeeType getType() {
        return type;
    }

    public void setType(FeeType type) {
        this.type = type;
    }

    public LocalDate getDueDate() {
        return dueDate;
    }

    public void setDueDate(LocalDate dueDate) {
        this.dueDate = dueDate;
    }

    public FeeStatus getStatus() {
        return status;
    }

    public void setStatus(FeeStatus status) {
        this.status = status;
    }

    @Override
    public String toString() {
        return "Fee{" +
                "id=" + id +
                ", period=" + period +
                ", amount=" + amount +
                ", type=" + type +
                ", dueDate=" + dueDate +
                ", status=" + status +
                ", apartment=" + apartment +
                '}';
    }

    public Fee(FeeStatus status, LocalDate dueDate, FeeType type, BigDecimal amount, YearMonth period, Apartment apartment) {
        this.status = status;
        this.dueDate = dueDate;
        this.type = type;
        this.amount = amount;
        this.period = period;
        this.apartment = apartment;
    }
}
