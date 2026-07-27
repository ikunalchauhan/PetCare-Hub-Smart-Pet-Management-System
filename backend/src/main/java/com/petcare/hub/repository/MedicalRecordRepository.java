package com.petcare.hub.repository;

import com.petcare.hub.model.MedicalRecord;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface MedicalRecordRepository extends MongoRepository<MedicalRecord, String> {
    List<MedicalRecord> findByPetIdOrderByVisitDateDesc(String petId);
    List<MedicalRecord> findByOwnerIdOrderByVisitDateDesc(String ownerId);
    void deleteByPetId(String petId);
}
