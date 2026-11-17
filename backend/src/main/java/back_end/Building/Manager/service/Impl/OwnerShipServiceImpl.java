package back_end.Building.Manager.service.Impl;

import back_end.Building.Manager.entity.Apartment;
import back_end.Building.Manager.entity.OwnerShip;
import back_end.Building.Manager.entity.User;
import back_end.Building.Manager.enums.Role;
import back_end.Building.Manager.repository.OwnerShipRepository;
import back_end.Building.Manager.service.Interface.ApartmentService;
import back_end.Building.Manager.service.Interface.OwnerShipService;
import back_end.Building.Manager.service.Interface.UserService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@Transactional
public class OwnerShipServiceImpl implements OwnerShipService {

    private final OwnerShipRepository ownerShipRepository;
    private final UserService userService;
    private final ApartmentService apartmentService;

    public OwnerShipServiceImpl(OwnerShipRepository ownerShipRepository,
                                UserService userService,
                                ApartmentService apartmentService) {
        this.ownerShipRepository = ownerShipRepository;
        this.userService = userService;
        this.apartmentService = apartmentService;
    }

    @Override
    public OwnerShip assignOwnerShip(UUID ownerId, int apartmentId) {
        User owner = userService.findById(ownerId)
                .orElseThrow(() -> new IllegalArgumentException("Cannot assign ownership: User not found with id " + ownerId));

        Apartment apartment = apartmentService.findApartmentById(apartmentId)
                .orElseThrow(() -> new IllegalArgumentException("Cannot assign ownership: Apartment not found with id " + apartmentId));

        if (owner.getRole() != Role.Owner) {
            throw new IllegalArgumentException("Cannot assign ownership: User does not have role Owner");
        }

        if (ownerShipRepository.existsByApartmentIdAndEndDateIsNull(apartmentId)) {
            throw new IllegalArgumentException("Cannot assign ownership: Apartment " + apartment.getUnitNumber() + " already has an active owner");
        }

        OwnerShip ownerShip = new OwnerShip();
        ownerShip.setOwner(owner);
        ownerShip.setApartment(apartment);
        ownerShip.setStartDate(LocalDate.now());
        ownerShip.setEndDate(null);

        return ownerShipRepository.save(ownerShip);
    }

    @Override
    public OwnerShip transferOwnerShip(UUID newOwnerId, int apartmentId, LocalDate transferDate) {
        if (transferDate == null) {
            transferDate = LocalDate.now();
        }

        User newOwner = userService.findById(newOwnerId)
                .orElseThrow(() -> new IllegalArgumentException("Cannot transfer ownership: New owner not found with id " + newOwnerId));

        if (newOwner.getRole() != Role.Owner) {
            throw new IllegalArgumentException("Cannot transfer ownership: User does not have role Owner");
        }

        Apartment apartment = apartmentService.findApartmentById(apartmentId)
                .orElseThrow(() -> new IllegalArgumentException("Cannot transfer ownership: Apartment not found with id " + apartmentId));

        OwnerShip currentOwnership = ownerShipRepository.findByApartmentIdAndEndDateIsNull(apartmentId)
                .orElseThrow(() -> new IllegalArgumentException("Cannot transfer ownership: Apartment has no active owner to transfer from"));

        if (currentOwnership.getOwner().getId().equals(newOwnerId)) {
            throw new IllegalArgumentException("Cannot transfer ownership: Apartment is already owned by this user");
        }

        currentOwnership.setEndDate(transferDate);
        ownerShipRepository.save(currentOwnership);

        OwnerShip newOwnership = new OwnerShip();
        newOwnership.setApartment(apartment);
        newOwnership.setOwner(newOwner);
        newOwnership.setStartDate(transferDate);
        newOwnership.setEndDate(null);

        return ownerShipRepository.save(newOwnership);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<User> getCurrentOwner(int apartmentId) {
        return ownerShipRepository.findByApartmentIdAndEndDateIsNull(apartmentId)
                .map(OwnerShip::getOwner);
    }

    @Override
    @Transactional(readOnly = true)
    public List<OwnerShip> getApartmentHistory(int apartmentId) {
        return ownerShipRepository.findByApartmentIdOrderByStartDateDesc(apartmentId);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Apartment> getApartmentsByOwner(UUID ownerId) {
        return ownerShipRepository.findByOwnerIdAndEndDateIsNull(ownerId)
                .stream()
                .map(OwnerShip::getApartment)
                .toList();
    }
}
