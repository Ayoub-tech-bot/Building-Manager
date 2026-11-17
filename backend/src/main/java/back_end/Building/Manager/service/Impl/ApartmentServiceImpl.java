package back_end.Building.Manager.service.Impl;

import back_end.Building.Manager.entity.Apartment;
import back_end.Building.Manager.entity.Building;
import back_end.Building.Manager.entity.Residence;
import back_end.Building.Manager.repository.ApartmentRepository;
import back_end.Building.Manager.repository.BuildingRepository;
import back_end.Building.Manager.repository.ResidenceRepository;
import back_end.Building.Manager.service.Interface.ApartmentService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class ApartmentServiceImpl implements ApartmentService {

    private final ApartmentRepository apartmentRepository;
    private final ResidenceRepository residenceRepository;
    private final BuildingRepository  buildingRepository;

    public ApartmentServiceImpl(ApartmentRepository apartmentRepository,
                                ResidenceRepository residenceRepository,
                                BuildingRepository  buildingRepository) {
        this.apartmentRepository = apartmentRepository;
        this.residenceRepository = residenceRepository;
        this.buildingRepository  = buildingRepository;
    }

    // ── Create (legacy – direct Residence link) ───────────────────────────────
    @Override
    @Transactional
    public Apartment createApartment(int residenceId, Apartment apartment) {
        Residence residence = residenceRepository.findById(residenceId)
                .orElseThrow(() -> new RuntimeException(
                        "Residence with id " + residenceId + " not found"));
        apartment.setResidence(residence);
        return apartmentRepository.save(apartment);
    }

    // ── Create (preferred – Building link, Residence derived) ─────────────────
    @Override
    @Transactional
    public Apartment createApartmentInBuilding(int buildingId, Apartment apartment) {
        Building building = buildingRepository.findById(buildingId)
                .orElseThrow(() -> new RuntimeException(
                        "Building with id " + buildingId + " not found"));
        apartment.setBuilding(building);           // also sets residence via entity logic
        return apartmentRepository.save(apartment);
    }

    // ── Update ────────────────────────────────────────────────────────────────
    @Override
    @Transactional
    public Optional<Apartment> updateApartment(int id, Apartment updateApartment) {
        if (updateApartment == null) {
            throw new IllegalArgumentException("Apartment cannot be null");
        }
        return apartmentRepository.findById(id).map(exist -> {
            exist.setUnitNumber(updateApartment.getUnitNumber());
            exist.setSizeM2(updateApartment.getSizeM2());
            if (updateApartment.getFloor() != null) {
                exist.setFloor(updateApartment.getFloor());
            }
            // If a new building was provided, re-link
            if (updateApartment.getBuilding() != null) {
                exist.setBuilding(updateApartment.getBuilding());
            }
            return apartmentRepository.save(exist);
        });
    }

    // ── Queries ───────────────────────────────────────────────────────────────
    @Override
    @Transactional(readOnly = true)
    public Optional<Apartment> findApartmentById(int apartmentId) {
        return apartmentRepository.findById(apartmentId);
    }

    @Override
    @Transactional
    public boolean deleteApartment(int apartmentId) {
        if (!apartmentRepository.existsById(apartmentId)) return false;
        apartmentRepository.deleteById(apartmentId);
        return true;
    }

    @Override
    @Transactional(readOnly = true)
    public List<Apartment> findAllApartments() {
        return apartmentRepository.findAll();
    }

    @Override
    @Transactional(readOnly = true)
    public List<Apartment> findByResidenceId(int residenceId) {
        return apartmentRepository.findByResidenceId(residenceId);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Apartment> findByBuildingId(int buildingId) {
        return apartmentRepository.findByBuildingId(buildingId);
    }
}
