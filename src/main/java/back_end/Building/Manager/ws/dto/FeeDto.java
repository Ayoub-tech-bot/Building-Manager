package back_end.Building.Manager.ws.dto;

import back_end.Building.Manager.enums.FeeStatus;
import back_end.Building.Manager.enums.FeeType;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.YearMonth;

public class FeeDto {
    private int id;

    @NotNull(message = "Period is required (e.g. 2026-10)")
    private YearMonth period;

    @NotNull(message = "Amount is required")
    @Positive(message = "Amount must be greater than zero")
    private BigDecimal amount;

    @NotNull(message = "Fee type is required")
    private FeeType type;

    private LocalDate dueDate;
    private FeeStatus status;

    @NotNull(message = "Apartment ID is required")
    private int apartmentId;

    public FeeDto(int id, YearMonth period, BigDecimal amount, FeeType type, LocalDate dueDate, FeeStatus status, int apartmentId) {
        this.id = id;
        this.period = period;
        this.amount = amount;
        this.type = type;
        this.dueDate = dueDate;
        this.status = status;
        this.apartmentId = apartmentId;
    }
    public FeeDto(){

    }

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

    public int getApartmentId() {
        return apartmentId;
    }

    public void setApartmentId(int apartmentId) {
        this.apartmentId = apartmentId;
    }
}
