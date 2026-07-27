package com.petcare.hub.service;

import com.petcare.hub.exception.ResourceNotFoundException;
import com.petcare.hub.exception.UnauthorizedException;
import com.petcare.hub.model.Medicine;
import com.petcare.hub.repository.MedicineRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MedicineService {

    private final MedicineRepository medicineRepository;
    private final PetService petService;

    public MedicineService(MedicineRepository medicineRepository, PetService petService) {
        this.medicineRepository = medicineRepository;
        this.petService = petService;
    }

    public List<Medicine> getForPet(String petId, String ownerId) {
        petService.getById(petId, ownerId);
        return medicineRepository.findByPetIdOrderByStartDateDesc(petId);
    }

    public List<Medicine> getAllForOwner(String ownerId) {
        return medicineRepository.findByOwnerIdOrderByStartDateDesc(ownerId);
    }

    public List<Medicine> getActiveForOwner(String ownerId) {
        return medicineRepository.findByOwnerIdAndActiveTrue(ownerId);
    }

    public Medicine create(String petId, Medicine medicine, String ownerId) {
        petService.getById(petId, ownerId);
        medicine.setId(null);
        medicine.setPetId(petId);
        medicine.setOwnerId(ownerId);
        return medicineRepository.save(medicine);
    }

    public Medicine update(String id, Medicine updates, String ownerId) {
        Medicine existing = getAndVerify(id, ownerId);
        existing.setName(updates.getName());
        existing.setDosage(updates.getDosage());
        existing.setFrequency(updates.getFrequency());
        existing.setStartDate(updates.getStartDate());
        existing.setEndDate(updates.getEndDate());
        existing.setPrescribedBy(updates.getPrescribedBy());
        existing.setInstructions(updates.getInstructions());
        existing.setActive(updates.isActive());
        return medicineRepository.save(existing);
    }

    public void delete(String id, String ownerId) {
        Medicine existing = getAndVerify(id, ownerId);
        medicineRepository.delete(existing);
    }

    private Medicine getAndVerify(String id, String ownerId) {
        Medicine medicine = medicineRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Medicine not found with id: " + id));
        if (!medicine.getOwnerId().equals(ownerId)) {
            throw new UnauthorizedException("You do not have permission to access this record");
        }
        return medicine;
    }
}
