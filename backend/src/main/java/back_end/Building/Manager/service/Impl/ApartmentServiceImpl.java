package back_end.Building.Manager.service.Impl;

import back_end.Building.Manager.entity.Residence;
import back_end.Building.Manager.repository.ApartmentRepository;
import back_end.Building.Manager.entity.Apartment;
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
    public ApartmentServiceImpl(ApartmentRepository apartmentRepository, ResidenceRepository residenceRepository) {
        this.apartmentRepository = apartmentRepository;
        this.residenceRepository = residenceRepository;
    }



    @Override
    @Transactional
    public Apartment createApartment(int residenceId, Apartment apartment) {
        Residence residence = residenceRepository.findById(residenceId)
                .orElseThrow(() ->new RuntimeException("residence with the following id : "+residenceId +" ,was not found"));
        apartment.setResidence(residence);
        return apartmentRepository.save(apartment);
    }

    @Override
    @Transactional
    public Optional<Apartment> updateApartment(int id, Apartment updateApartment) {
        if( updateApartment == null ) {
            throw new IllegalArgumentException("Apartment cannot be null");
        }
        return apartmentRepository.findById(id).map(exist ->{
                    exist.setUnitNumber(updateApartment.getUnitNumber());
                    exist.setSizeM2(updateApartment.getSizeM2());
                    return apartmentRepository.save(exist);

                });
    }

    @Override
    @Transactional
    public Optional<Apartment> findApartmentById(int apartmentId) {
        return apartmentRepository.findById(apartmentId);
    }

    @Override
    @Transactional
    public boolean deleteApartment(int  apartmentId) {
        if(!apartmentRepository.existsById(apartmentId)) {
            return false;
        }
        apartmentRepository.deleteById(apartmentId);
        return true;
    }

    @Override
    @Transactional
    public List<Apartment> findAllApartments() {
        return apartmentRepository.findAll();

    }

    @Override
    public List<Apartment> findByResidenceId(int residenceId) {

        return apartmentRepository.findByResidenceId(residenceId);
    }
}
