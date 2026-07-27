package com.petcare.hub.controller;

import com.petcare.hub.model.Appointment;
import com.petcare.hub.security.SecurityUtils;
import com.petcare.hub.service.AppointmentService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
@Tag(name = "Appointments", description = "Vet appointment scheduling and timeline")
public class AppointmentController {

    private final AppointmentService appointmentService;
    private final SecurityUtils securityUtils;

    public AppointmentController(AppointmentService appointmentService, SecurityUtils securityUtils) {
        this.appointmentService = appointmentService;
        this.securityUtils = securityUtils;
    }

    @GetMapping("/pets/{petId}/appointments")
    @Operation(summary = "List appointments for a pet")
    public ResponseEntity<List<Appointment>> getForPet(@PathVariable String petId) {
        return ResponseEntity.ok(appointmentService.getForPet(petId, securityUtils.getCurrentUserId()));
    }

    @GetMapping("/appointments")
    @Operation(summary = "List all appointments for the current user")
    public ResponseEntity<List<Appointment>> getAll() {
        return ResponseEntity.ok(appointmentService.getAllForOwner(securityUtils.getCurrentUserId()));
    }

    @GetMapping("/appointments/upcoming")
    @Operation(summary = "List upcoming appointments within N days (default 30)")
    public ResponseEntity<List<Appointment>> getUpcoming(@RequestParam(defaultValue = "30") int daysAhead) {
        return ResponseEntity.ok(appointmentService.getUpcoming(securityUtils.getCurrentUserId(), daysAhead));
    }

    @PostMapping("/pets/{petId}/appointments")
    @Operation(summary = "Schedule a new appointment for a pet")
    public ResponseEntity<Appointment> create(@PathVariable String petId, @Valid @RequestBody Appointment appointment) {
        Appointment created = appointmentService.create(petId, appointment, securityUtils.getCurrentUserId());
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PutMapping("/appointments/{id}")
    @Operation(summary = "Update an appointment")
    public ResponseEntity<Appointment> update(@PathVariable String id, @Valid @RequestBody Appointment appointment) {
        return ResponseEntity.ok(appointmentService.update(id, appointment, securityUtils.getCurrentUserId()));
    }

    @PatchMapping("/appointments/{id}/status")
    @Operation(summary = "Update only the status of an appointment (SCHEDULED, COMPLETED, CANCELLED)")
    public ResponseEntity<Appointment> updateStatus(@PathVariable String id, @RequestBody Map<String, String> body) {
        return ResponseEntity.ok(appointmentService.updateStatus(id, body.get("status"), securityUtils.getCurrentUserId()));
    }

    @DeleteMapping("/appointments/{id}")
    @Operation(summary = "Delete an appointment")
    public ResponseEntity<Void> delete(@PathVariable String id) {
        appointmentService.delete(id, securityUtils.getCurrentUserId());
        return ResponseEntity.noContent().build();
    }
}
