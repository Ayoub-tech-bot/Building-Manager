package back_end.Building.Manager.service.Interface;

import back_end.Building.Manager.entity.Apartment;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface ApartmentService {
    Apartment createApartment(int residenceId,Apartment apartment);
    Optional<Apartment> updateApartment(int id, Apartment apartment);
    Optional<Apartment> findApartmentById(int apartmentId);
    boolean deleteApartment(int apartmentId);
    List<Apartment> findAllApartments();
    List<Apartment> findByResidenceId(int residenceId);

}
