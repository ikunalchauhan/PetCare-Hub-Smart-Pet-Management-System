package com.petcare.hub.service;

import com.petcare.hub.exception.ResourceNotFoundException;
import com.petcare.hub.exception.UnauthorizedException;
import com.petcare.hub.model.Vaccination;
import com.petcare.hub.repository.VaccinationRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class VaccinationService {

    private final VaccinationRepository vaccinationRepository;
    private final PetService petService;

    public VaccinationService(VaccinationRepository vaccinationRepository, PetService petService) {
        this.vaccinationRepository = vaccinationRepository;
        this.petService = petService;
    }

    public List<Vaccination> getForPet(String petId, String ownerId) {
        petService.getById(petId, ownerId); // ownership check
        return vaccinationRepository.findByPetIdOrderByNextDueDateAsc(petId);
    }

    public List<Vaccination> getAllForOwner(String ownerId) {
        return vaccinationRepository.findByOwnerIdOrderByNextDueDateAsc(ownerId);
    }

    public List<Vaccination> getUpcomingReminders(String ownerId, int daysAhead) {
        LocalDate today = LocalDate.now();
        return vaccinationRepository.findByOwnerIdAndNextDueDateBetween(ownerId, today, today.plusDays(daysAhead));
    }

    public Vaccination create(String petId, Vaccination vaccination, String ownerId) {
        petService.getById(petId, ownerId);
        vaccination.setId(null);
        vaccination.setPetId(petId);
        vaccination.setOwnerId(ownerId);
        return vaccinationRepository.save(vaccination);
    }

    public Vaccination update(String id, Vaccination updates, String ownerId) {
        Vaccination existing = getAndVerify(id, ownerId);
        existing.setVaccineName(updates.getVaccineName());
        existing.setDateAdministered(updates.getDateAdministered());
        existing.setNextDueDate(updates.getNextDueDate());
        existing.setVeterinarianName(updates.getVeterinarianName());
        existing.setClinicName(updates.getClinicName());
        existing.setBatchNumber(updates.getBatchNumber());
        existing.setNotes(updates.getNotes());
        return vaccinationRepository.save(existing);
    }

    public void delete(String id, String ownerId) {
        Vaccination existing = getAndVerify(id, ownerId);
        vaccinationRepository.delete(existing);
    }

    private Vaccination getAndVerify(String id, String ownerId) {
        Vaccination vaccination = vaccinationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Vaccination record not found with id: " + id));
        if (!vaccination.getOwnerId().equals(ownerId)) {
            throw new UnauthorizedException("You do not have permission to access this record");
        }
        return vaccination;
    }
}
