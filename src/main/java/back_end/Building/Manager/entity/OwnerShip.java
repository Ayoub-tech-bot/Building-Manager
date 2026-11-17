package back_end.Building.Manager.entity;

import jakarta.persistence.*;

import java.time.LocalDate;

@Entity
public class OwnerShip {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;
    private LocalDate startDate;
    private LocalDate endDate;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User owner;
    @ManyToOne
    @JoinColumn(name = "apartment_id")
    private Apartment apartment;

    public OwnerShip() {}

    public OwnerShip(LocalDate endDate, LocalDate startDate) {
        this.endDate = endDate;
        this.startDate = startDate;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
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

    public User getOwner() {
        return owner;
    }

    public void setOwner(User owner) {
        this.owner = owner;
    }

    public Apartment getApartment() {
        return apartment;
    }

    public void setApartment(Apartment apartment) {
        this.apartment = apartment;
    }
    public boolean isActive() {
        return this.endDate == null;
    }


    @Override
    public String toString() {
        return "OwnerShip{" +
                "id=" + id +
                ", startDate=" + startDate +
                ", endDate=" + endDate +
                '}';
    }

    public void setEndDate(LocalDate endDate) {
        this.endDate = endDate;
    }
}
