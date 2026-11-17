package back_end.Building.Manager.service.Interface;

import back_end.Building.Manager.entity.Apartment;

import java.util.List;
import java.util.Optional;

public interface ApartmentService {

    /** Create an apartment linked to a Residence directly (legacy / no building). */
    Apartment createApartment(int residenceId, Apartment apartment);

    /** Create an apartment linked to a Building (preferred – 3-tier hierarchy). */
    Apartment createApartmentInBuilding(int buildingId, Apartment apartment);

    Optional<Apartment> updateApartment(int id, Apartment apartment);

    Optional<Apartment> findApartmentById(int apartmentId);

    boolean deleteApartment(int apartmentId);

    List<Apartment> findAllApartments();

    List<Apartment> findByResidenceId(int residenceId);

    List<Apartment> findByBuildingId(int buildingId);
}
