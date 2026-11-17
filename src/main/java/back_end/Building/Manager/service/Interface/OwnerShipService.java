package back_end.Building.Manager.service.Interface;

import back_end.Building.Manager.entity.Apartment;
import back_end.Building.Manager.entity.OwnerShip;
import back_end.Building.Manager.entity.User;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface OwnerShipService {
    OwnerShip assignOwnerShip(UUID ownerId, int apartmentId);
    OwnerShip transferOwnerShip(UUID ownerId, int apartmentId, LocalDate transferDate);
    Optional<User> getCurrentOwner(int apartmentId);
    List<OwnerShip> getApartmentHistory(int apartmentId);
    List<Apartment> getApartmentsByOwner(UUID ownerId);
}
