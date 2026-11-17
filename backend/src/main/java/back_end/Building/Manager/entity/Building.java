package back_end.Building.Manager.entity;

import jakarta.persistence.*;

@Entity
public class Building {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    private String name;
    private Integer floorsCount;

    @ManyToOne
    @JoinColumn(name = "residence_id", nullable = false)
    private Residence residence;

    public Building() {}

    public Building(String name, Integer floorsCount, Residence residence) {
        this.name = name;
        this.floorsCount = floorsCount;
        this.residence = residence;
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

    public Residence getResidence() {
        return residence;
    }

    public void setResidence(Residence residence) {
        this.residence = residence;
    }

    @Override
    public String toString() {
        return "Building{" +
                "id=" + id +
                ", name='" + name + '\'' +
                ", floorsCount=" + floorsCount +
                '}';
    }
}

