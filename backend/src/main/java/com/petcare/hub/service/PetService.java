package com.petcare.hub.service;

import com.petcare.hub.exception.ResourceNotFoundException;
import com.petcare.hub.exception.UnauthorizedException;
import com.petcare.hub.model.Pet;
import com.petcare.hub.repository.AppointmentRepository;
import com.petcare.hub.repository.ExpenseRepository;
import com.petcare.hub.repository.MedicalRecordRepository;
import com.petcare.hub.repository.MedicineRepository;
import com.petcare.hub.repository.PetDocumentRepository;
import com.petcare.hub.repository.PetRepository;
import com.petcare.hub.repository.VaccinationRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class PetService {

    private final PetRepository petRepository;
    private final VaccinationRepository vaccinationRepository;
    private final MedicalRecordRepository medicalRecordRepository;
    private final MedicineRepository medicineRepository;
    private final AppointmentRepository appointmentRepository;
    private final ExpenseRepository expenseRepository;
    private final PetDocumentRepository petDocumentRepository;

    public PetService(PetRepository petRepository,
                       VaccinationRepository vaccinationRepository,
                       MedicalRecordRepository medicalRecordRepository,
                       MedicineRepository medicineRepository,
                       AppointmentRepository appointmentRepository,
                       ExpenseRepository expenseRepository,
                       PetDocumentRepository petDocumentRepository) {
        this.petRepository = petRepository;
        this.vaccinationRepository = vaccinationRepository;
        this.medicalRecordRepository = medicalRecordRepository;
        this.medicineRepository = medicineRepository;
        this.appointmentRepository = appointmentRepository;
        this.expenseRepository = expenseRepository;
        this.petDocumentRepository = petDocumentRepository;
    }

    public List<Pet> getAllForOwner(String ownerId) {
        return petRepository.findByOwnerIdOrderByCreatedAtDesc(ownerId);
    }

    public Pet getById(String petId, String ownerId) {
        Pet pet = petRepository.findById(petId)
                .orElseThrow(() -> new ResourceNotFoundException("Pet not found with id: " + petId));
        verifyOwnership(pet, ownerId);
        return pet;
    }

    public Pet create(Pet pet, String ownerId) {
        pet.setId(null);
        pet.setOwnerId(ownerId);
        pet.setCreatedAt(LocalDateTime.now());
        pet.setUpdatedAt(LocalDateTime.now());
        return petRepository.save(pet);
    }

    public Pet update(String petId, Pet updates, String ownerId) {
        Pet existing = getById(petId, ownerId);
        existing.setName(updates.getName());
        existing.setSpecies(updates.getSpecies());
        existing.setBreed(updates.getBreed());
        existing.setGender(updates.getGender());
        existing.setDateOfBirth(updates.getDateOfBirth());
        existing.setWeightKg(updates.getWeightKg());
        existing.setColor(updates.getColor());
        existing.setMicrochipId(updates.getMicrochipId());
        existing.setPhotoUrl(updates.getPhotoUrl());
        existing.setNotes(updates.getNotes());
        existing.setActive(updates.isActive());
        existing.setUpdatedAt(LocalDateTime.now());
        return petRepository.save(existing);
    }

    public void delete(String petId, String ownerId) {
        Pet pet = getById(petId, ownerId);
        // Cascade-delete all related records to avoid orphaned data.
        vaccinationRepository.deleteByPetId(pet.getId());
        medicalRecordRepository.deleteByPetId(pet.getId());
        medicineRepository.deleteByPetId(pet.getId());
        appointmentRepository.deleteByPetId(pet.getId());
        expenseRepository.deleteByPetId(pet.getId());
        petDocumentRepository.deleteByPetId(pet.getId());
        petRepository.delete(pet);
    }

    public long countForOwner(String ownerId) {
        return petRepository.countByOwnerId(ownerId);
    }

    private void verifyOwnership(Pet pet, String ownerId) {
        if (!pet.getOwnerId().equals(ownerId)) {
            throw new UnauthorizedException("You do not have permission to access this pet");
        }
    }
}
