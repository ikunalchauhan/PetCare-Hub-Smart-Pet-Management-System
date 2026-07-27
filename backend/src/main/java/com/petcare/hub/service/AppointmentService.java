package com.petcare.hub.service;

import com.petcare.hub.exception.ResourceNotFoundException;
import com.petcare.hub.exception.UnauthorizedException;
import com.petcare.hub.model.Appointment;
import com.petcare.hub.repository.AppointmentRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class AppointmentService {

    private final AppointmentRepository appointmentRepository;
    private final PetService petService;

    public AppointmentService(AppointmentRepository appointmentRepository, PetService petService) {
        this.appointmentRepository = appointmentRepository;
        this.petService = petService;
    }

    public List<Appointment> getForPet(String petId, String ownerId) {
        petService.getById(petId, ownerId);
        return appointmentRepository.findByPetIdOrderByAppointmentDateDesc(petId);
    }

    public List<Appointment> getAllForOwner(String ownerId) {
        return appointmentRepository.findByOwnerIdOrderByAppointmentDateAsc(ownerId);
    }

    public List<Appointment> getUpcoming(String ownerId, int daysAhead) {
        LocalDateTime now = LocalDateTime.now();
        return appointmentRepository.findByOwnerIdAndAppointmentDateBetween(ownerId, now, now.plusDays(daysAhead));
    }

    public Appointment create(String petId, Appointment appointment, String ownerId) {
        petService.getById(petId, ownerId);
        appointment.setId(null);
        appointment.setPetId(petId);
        appointment.setOwnerId(ownerId);
        if (appointment.getStatus() == null || appointment.getStatus().isBlank()) {
            appointment.setStatus("SCHEDULED");
        }
        return appointmentRepository.save(appointment);
    }

    public Appointment update(String id, Appointment updates, String ownerId) {
        Appointment existing = getAndVerify(id, ownerId);
        existing.setTitle(updates.getTitle());
        existing.setAppointmentDate(updates.getAppointmentDate());
        existing.setVeterinarianName(updates.getVeterinarianName());
        existing.setClinicName(updates.getClinicName());
        existing.setReason(updates.getReason());
        existing.setStatus(updates.getStatus());
        existing.setNotes(updates.getNotes());
        return appointmentRepository.save(existing);
    }

    public Appointment updateStatus(String id, String status, String ownerId) {
        Appointment existing = getAndVerify(id, ownerId);
        existing.setStatus(status);
        return appointmentRepository.save(existing);
    }

    public void delete(String id, String ownerId) {
        Appointment existing = getAndVerify(id, ownerId);
        appointmentRepository.delete(existing);
    }

    private Appointment getAndVerify(String id, String ownerId) {
        Appointment appointment = appointmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Appointment not found with id: " + id));
        if (!appointment.getOwnerId().equals(ownerId)) {
            throw new UnauthorizedException("You do not have permission to access this appointment");
        }
        return appointment;
    }
}
