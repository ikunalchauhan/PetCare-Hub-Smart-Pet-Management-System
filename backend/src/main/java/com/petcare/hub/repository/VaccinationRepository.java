package com.petcare.hub.repository;

import com.petcare.hub.model.Vaccination;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.time.LocalDate;
import java.util.List;

public interface VaccinationRepository extends MongoRepository<Vaccination, String> {
    List<Vaccination> findByPetIdOrderByNextDueDateAsc(String petId);
    List<Vaccination> findByOwnerIdOrderByNextDueDateAsc(String ownerId);
    List<Vaccination> findByOwnerIdAndNextDueDateBetween(String ownerId, LocalDate start, LocalDate end);
    void deleteByPetId(String petId);
}
