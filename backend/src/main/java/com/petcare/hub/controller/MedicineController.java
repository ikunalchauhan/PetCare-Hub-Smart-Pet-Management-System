package com.petcare.hub.controller;

import com.petcare.hub.model.Medicine;
import com.petcare.hub.security.SecurityUtils;
import com.petcare.hub.service.MedicineService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@Tag(name = "Medicines", description = "Medicine tracking and prescriptions")
public class MedicineController {

    private final MedicineService medicineService;
    private final SecurityUtils securityUtils;

    public MedicineController(MedicineService medicineService, SecurityUtils securityUtils) {
        this.medicineService = medicineService;
        this.securityUtils = securityUtils;
    }

    @GetMapping("/pets/{petId}/medicines")
    @Operation(summary = "List medicines for a pet")
    public ResponseEntity<List<Medicine>> getForPet(@PathVariable String petId) {
        return ResponseEntity.ok(medicineService.getForPet(petId, securityUtils.getCurrentUserId()));
    }

    @GetMapping("/medicines")
    @Operation(summary = "List all medicines for the current user")
    public ResponseEntity<List<Medicine>> getAll() {
        return ResponseEntity.ok(medicineService.getAllForOwner(securityUtils.getCurrentUserId()));
    }

    @GetMapping("/medicines/active")
    @Operation(summary = "List currently active medicines for the current user")
    public ResponseEntity<List<Medicine>> getActive() {
        return ResponseEntity.ok(medicineService.getActiveForOwner(securityUtils.getCurrentUserId()));
    }

    @PostMapping("/pets/{petId}/medicines")
    @Operation(summary = "Add a medicine record for a pet")
    public ResponseEntity<Medicine> create(@PathVariable String petId, @Valid @RequestBody Medicine medicine) {
        Medicine created = medicineService.create(petId, medicine, securityUtils.getCurrentUserId());
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PutMapping("/medicines/{id}")
    @Operation(summary = "Update a medicine record")
    public ResponseEntity<Medicine> update(@PathVariable String id, @Valid @RequestBody Medicine medicine) {
        return ResponseEntity.ok(medicineService.update(id, medicine, securityUtils.getCurrentUserId()));
    }

    @DeleteMapping("/medicines/{id}")
    @Operation(summary = "Delete a medicine record")
    public ResponseEntity<Void> delete(@PathVariable String id) {
        medicineService.delete(id, securityUtils.getCurrentUserId());
        return ResponseEntity.noContent().build();
    }
}
