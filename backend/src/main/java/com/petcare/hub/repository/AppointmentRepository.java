package com.petcare.hub.repository;

import com.petcare.hub.model.Appointment;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.time.LocalDateTime;
import java.util.List;

public interface AppointmentRepository extends MongoRepository<Appointment, String> {
    List<Appointment> findByPetIdOrderByAppointmentDateDesc(String petId);
    List<Appointment> findByOwnerIdOrderByAppointmentDateAsc(String ownerId);
    List<Appointment> findByOwnerIdAndAppointmentDateBetween(String ownerId, LocalDateTime start, LocalDateTime end);
    void deleteByPetId(String petId);
}
