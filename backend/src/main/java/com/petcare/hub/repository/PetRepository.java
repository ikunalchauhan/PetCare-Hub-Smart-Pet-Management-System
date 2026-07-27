package com.petcare.hub.repository;

import com.petcare.hub.model.Pet;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface PetRepository extends MongoRepository<Pet, String> {
    List<Pet> findByOwnerIdOrderByCreatedAtDesc(String ownerId);
    long countByOwnerId(String ownerId);
}
