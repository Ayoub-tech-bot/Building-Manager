package back_end.Building.Manager.config;

import back_end.Building.Manager.entity.Apartment;
import back_end.Building.Manager.entity.Building;
import back_end.Building.Manager.entity.OwnerShip;
import back_end.Building.Manager.entity.Residence;
import back_end.Building.Manager.entity.User;
import back_end.Building.Manager.enums.Role;
import back_end.Building.Manager.repository.ApartmentRepository;
import back_end.Building.Manager.repository.BuildingRepository;
import back_end.Building.Manager.repository.OwnerShipRepository;
import back_end.Building.Manager.repository.ResidenceRepository;
import back_end.Building.Manager.repository.UserReppsitory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Configuration;

import java.math.BigDecimal;
import java.time.LocalDate;

@Configuration
public class DataInitializer implements CommandLineRunner {

    private final ResidenceRepository residenceRepository;
    private final BuildingRepository buildingRepository;
    private final ApartmentRepository apartmentRepository;
    private final UserReppsitory userRepository;
    private final OwnerShipRepository ownerShipRepository;

    public DataInitializer(ResidenceRepository residenceRepository,
                           BuildingRepository buildingRepository,
                           ApartmentRepository apartmentRepository,
                           UserReppsitory userRepository,
                           OwnerShipRepository ownerShipRepository) {
        this.residenceRepository = residenceRepository;
        this.buildingRepository = buildingRepository;
        this.apartmentRepository = apartmentRepository;
        this.userRepository = userRepository;
        this.ownerShipRepository = ownerShipRepository;
    }

    @Override
    public void run(String... args) {
        // Only initialize if database is completely empty
        if (residenceRepository.count() > 0) {
            return;
        }

        // 1. Residence
        Residence residence = new Residence("Résidence Les Oliviers", "Casablanca, Maroc", "0522441860");
        residence = residenceRepository.save(residence);

        // 2. Buildings
        Building buildingA = buildingRepository.save(new Building("Bâtiment A", 4, residence));
        Building buildingB = buildingRepository.save(new Building("Bâtiment B", 4, residence));
        Building buildingC = buildingRepository.save(new Building("Bâtiment C", 4, residence));

        // 3. Users
        User syndic = createUser("Nora Alaoui", "nora.alaoui@habita.ma", "05 22 44 18 60", Role.Syndic);
        User karim = createUser("Karim El Amrani", "karim.amrani@gmail.com", "06 61 14 25 36", Role.Owner);
        User youssef = createUser("Youssef Tazi", "youssef.tazi@outlook.com", "06 62 88 99 00", Role.Owner);
        User salma = createUser("Salma Idrissi", "salma.idrissi@gmail.com", "06 63 45 67 89", Role.Owner);
        User omar = createUser("Omar Berrada", "omar.berrada@yahoo.fr", "06 70 12 34 56", Role.Owner);
        User mehdi = createUser("Mehdi Amrani", "mehdi.amrani@gmail.com", "06 68 55 44 33", Role.Owner);
        User amina = createUser("Amina Chraïbi", "amina.chraibi@menara.ma", "06 65 21 43 65", Role.Owner);
        User fatima = createUser("Fatima Zahra Bennani", "fz.bennani@gmail.com", "06 72 33 22 11", Role.Owner);

        // 4. Apartments
        Apartment aptA12 = createApartment("A-12", new BigDecimal("86.0"), 2, buildingA);
        Apartment aptB04 = createApartment("B-04", new BigDecimal("92.5"), 0, buildingB);
        Apartment aptC08 = createApartment("C-08", new BigDecimal("74.0"), 1, buildingC);
        Apartment aptA03 = createApartment("A-03", new BigDecimal("86.0"), 0, buildingA);
        Apartment aptB07 = createApartment("B-07", new BigDecimal("110.0"), 2, buildingB);
        Apartment aptC02 = createApartment("C-02", new BigDecimal("68.0"), 0, buildingC);
        createApartment("A-15", new BigDecimal("95.0"), 3, buildingA); // Vacant
        createApartment("B-11", new BigDecimal("80.0"), 3, buildingB); // Vacant

        // 5. Ownership assignments
        assign(karim, aptA12, LocalDate.of(2026, 8, 1));
        assign(youssef, aptB04, LocalDate.of(2025, 1, 15));
        assign(salma, aptC08, LocalDate.of(2025, 4, 10));
        assign(omar, aptA03, LocalDate.of(2024, 11, 20));
        assign(mehdi, aptB07, LocalDate.of(2025, 6, 1));
        assign(amina, aptC02, LocalDate.of(2025, 9, 5));
    }

    private User createUser(String username, String email, String phone, Role role) {
        User u = new User();
        u.setUsername(username);
        u.setEmail(email);
        u.setPassword("password123");
        u.setPhoneNumber(phone);
        u.setRole(role);
        return userRepository.save(u);
    }

    private Apartment createApartment(String unitNumber, BigDecimal sizeM2, int floor, Building building) {
        Apartment a = new Apartment();
        a.setUnitNumber(unitNumber);
        a.setSizeM2(sizeM2);
        a.setFloor(floor);
        a.setBuilding(building);
        return apartmentRepository.save(a);
    }

    private void assign(User user, Apartment apartment, LocalDate date) {
        OwnerShip os = new OwnerShip();
        os.setOwner(user);
        os.setApartment(apartment);
        os.setStartDate(date);
        os.setEndDate(null);
        ownerShipRepository.save(os);
    }
}
