package com.petcare.hub.repository;

import com.petcare.hub.model.PetDocument;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface PetDocumentRepository extends MongoRepository<PetDocument, String> {
    List<PetDocument> findByPetIdOrderByUploadedAtDesc(String petId);
    List<PetDocument> findByOwnerIdOrderByUploadedAtDesc(String ownerId);
    void deleteByPetId(String petId);
}
