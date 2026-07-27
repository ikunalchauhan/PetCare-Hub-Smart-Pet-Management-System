package com.petcare.hub.service;

import com.petcare.hub.exception.ResourceNotFoundException;
import com.petcare.hub.exception.UnauthorizedException;
import com.petcare.hub.model.MedicalRecord;
import com.petcare.hub.repository.MedicalRecordRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MedicalRecordService {

    private final MedicalRecordRepository medicalRecordRepository;
    private final PetService petService;

    public MedicalRecordService(MedicalRecordRepository medicalRecordRepository, PetService petService) {
        this.medicalRecordRepository = medicalRecordRepository;
        this.petService = petService;
    }

    public List<MedicalRecord> getForPet(String petId, String ownerId) {
        petService.getById(petId, ownerId);
        return medicalRecordRepository.findByPetIdOrderByVisitDateDesc(petId);
    }

    public List<MedicalRecord> getAllForOwner(String ownerId) {
        return medicalRecordRepository.findByOwnerIdOrderByVisitDateDesc(ownerId);
    }

    public MedicalRecord create(String petId, MedicalRecord record, String ownerId) {
        petService.getById(petId, ownerId);
        record.setId(null);
        record.setPetId(petId);
        record.setOwnerId(ownerId);
        return medicalRecordRepository.save(record);
    }

    public MedicalRecord update(String id, MedicalRecord updates, String ownerId) {
        MedicalRecord existing = getAndVerify(id, ownerId);
        existing.setVisitDate(updates.getVisitDate());
        existing.setDiagnosis(updates.getDiagnosis());
        existing.setTreatment(updates.getTreatment());
        existing.setVeterinarianName(updates.getVeterinarianName());
        existing.setClinicName(updates.getClinicName());
        existing.setNotes(updates.getNotes());
        existing.setAttachmentUrl(updates.getAttachmentUrl());
        return medicalRecordRepository.save(existing);
    }

    public void delete(String id, String ownerId) {
        MedicalRecord existing = getAndVerify(id, ownerId);
        medicalRecordRepository.delete(existing);
    }

    private MedicalRecord getAndVerify(String id, String ownerId) {
        MedicalRecord record = medicalRecordRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Medical record not found with id: " + id));
        if (!record.getOwnerId().equals(ownerId)) {
            throw new UnauthorizedException("You do not have permission to access this record");
        }
        return record;
    }
}
