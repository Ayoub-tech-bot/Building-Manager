package back_end.Building.Manager.ws.dto;

import back_end.Building.Manager.enums.FeeStatus;

import java.math.BigDecimal;
import java.time.YearMonth;

public class FeeBalanceDto {

    private int feeId;
    private YearMonth period;
    private BigDecimal feeAmount;
    private BigDecimal totalPaid;
    private BigDecimal outstandingBalance;
    private FeeStatus status;

    public FeeBalanceDto() {}

    public FeeBalanceDto(int feeId, YearMonth period, BigDecimal feeAmount, BigDecimal totalPaid,
                         BigDecimal outstandingBalance, FeeStatus status) {
        this.feeId = feeId;
        this.period = period;
        this.feeAmount = feeAmount;
        this.totalPaid = totalPaid;
        this.outstandingBalance = outstandingBalance;
        this.status = status;
    }

    public int getFeeId() {
        return feeId;
    }

    public void setFeeId(int feeId) {
        this.feeId = feeId;
    }

    public YearMonth getPeriod() {
        return period;
    }

    public void setPeriod(YearMonth period) {
        this.period = period;
    }

    public BigDecimal getFeeAmount() {
        return feeAmount;
    }

    public void setFeeAmount(BigDecimal feeAmount) {
        this.feeAmount = feeAmount;
    }

    public BigDecimal getTotalPaid() {
        return totalPaid;
    }

    public void setTotalPaid(BigDecimal totalPaid) {
        this.totalPaid = totalPaid;
    }

    public BigDecimal getOutstandingBalance() {
        return outstandingBalance;
    }

    public void setOutstandingBalance(BigDecimal outstandingBalance) {
        this.outstandingBalance = outstandingBalance;
    }

    public FeeStatus getStatus() {
        return status;
    }

    public void setStatus(FeeStatus status) {
        this.status = status;
    }

    @Override
    public String toString() {
        return "FeeBalanceDto{" +
                "feeId=" + feeId +
                ", period=" + period +
                ", feeAmount=" + feeAmount +
                ", totalPaid=" + totalPaid +
                ", outstandingBalance=" + outstandingBalance +
                ", status=" + status +
                '}';
    }
}
