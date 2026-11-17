package back_end.Building.Manager.ws.dto;

public class ResidenceDto {

    private int id;
    private String name;
    private String address;
    private String number;

    public ResidenceDto() {}

    public ResidenceDto(String number, String address, String name) {
        this.number = number;
        this.address = address;
        this.name = name;
    }

    public ResidenceDto(int id, String name, String address, String number) {
        this.id = id;
        this.name = name;
        this.address = address;
        this.number = number;
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

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getNumber() {
        return number;
    }

    public void setNumber(String number) {
        this.number = number;
    }
}
