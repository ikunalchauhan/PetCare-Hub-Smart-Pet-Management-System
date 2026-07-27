package com.petcare.hub.repository;

import com.petcare.hub.model.Medicine;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface MedicineRepository extends MongoRepository<Medicine, String> {
    List<Medicine> findByPetIdOrderByStartDateDesc(String petId);
    List<Medicine> findByOwnerIdOrderByStartDateDesc(String ownerId);
    List<Medicine> findByOwnerIdAndActiveTrue(String ownerId);
    void deleteByPetId(String petId);
}
