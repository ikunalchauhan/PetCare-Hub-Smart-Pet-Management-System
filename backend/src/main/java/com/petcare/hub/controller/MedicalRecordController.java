package com.petcare.hub.controller;

import com.petcare.hub.model.MedicalRecord;
import com.petcare.hub.security.SecurityUtils;
import com.petcare.hub.service.MedicalRecordService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@Tag(name = "Medical Records", description = "Pet medical history and visit records")
public class MedicalRecordController {

    private final MedicalRecordService medicalRecordService;
    private final SecurityUtils securityUtils;

    public MedicalRecordController(MedicalRecordService medicalRecordService, SecurityUtils securityUtils) {
        this.medicalRecordService = medicalRecordService;
        this.securityUtils = securityUtils;
    }

    @GetMapping("/pets/{petId}/medical-records")
    @Operation(summary = "List medical records for a pet")
    public ResponseEntity<List<MedicalRecord>> getForPet(@PathVariable String petId) {
        return ResponseEntity.ok(medicalRecordService.getForPet(petId, securityUtils.getCurrentUserId()));
    }

    @GetMapping("/medical-records")
    @Operation(summary = "List all medical records for the current user")
    public ResponseEntity<List<MedicalRecord>> getAll() {
        return ResponseEntity.ok(medicalRecordService.getAllForOwner(securityUtils.getCurrentUserId()));
    }

    @PostMapping("/pets/{petId}/medical-records")
    @Operation(summary = "Add a medical record for a pet")
    public ResponseEntity<MedicalRecord> create(@PathVariable String petId, @Valid @RequestBody MedicalRecord record) {
        MedicalRecord created = medicalRecordService.create(petId, record, securityUtils.getCurrentUserId());
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PutMapping("/medical-records/{id}")
    @Operation(summary = "Update a medical record")
    public ResponseEntity<MedicalRecord> update(@PathVariable String id, @Valid @RequestBody MedicalRecord record) {
        return ResponseEntity.ok(medicalRecordService.update(id, record, securityUtils.getCurrentUserId()));
    }

    @DeleteMapping("/medical-records/{id}")
    @Operation(summary = "Delete a medical record")
    public ResponseEntity<Void> delete(@PathVariable String id) {
        medicalRecordService.delete(id, securityUtils.getCurrentUserId());
        return ResponseEntity.noContent().build();
    }
}
