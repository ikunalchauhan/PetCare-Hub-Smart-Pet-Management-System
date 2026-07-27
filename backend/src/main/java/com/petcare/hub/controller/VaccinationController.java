package com.petcare.hub.controller;

import com.petcare.hub.model.Vaccination;
import com.petcare.hub.security.SecurityUtils;
import com.petcare.hub.service.VaccinationService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@Tag(name = "Vaccinations", description = "Vaccination records and reminders")
public class VaccinationController {

    private final VaccinationService vaccinationService;
    private final SecurityUtils securityUtils;

    public VaccinationController(VaccinationService vaccinationService, SecurityUtils securityUtils) {
        this.vaccinationService = vaccinationService;
        this.securityUtils = securityUtils;
    }

    @GetMapping("/pets/{petId}/vaccinations")
    @Operation(summary = "List vaccination records for a pet")
    public ResponseEntity<List<Vaccination>> getForPet(@PathVariable String petId) {
        return ResponseEntity.ok(vaccinationService.getForPet(petId, securityUtils.getCurrentUserId()));
    }

    @GetMapping("/vaccinations")
    @Operation(summary = "List all vaccination records for the current user")
    public ResponseEntity<List<Vaccination>> getAll() {
        return ResponseEntity.ok(vaccinationService.getAllForOwner(securityUtils.getCurrentUserId()));
    }

    @GetMapping("/vaccinations/reminders")
    @Operation(summary = "List vaccinations due within the next N days (default 30)")
    public ResponseEntity<List<Vaccination>> getReminders(@RequestParam(defaultValue = "30") int daysAhead) {
        return ResponseEntity.ok(vaccinationService.getUpcomingReminders(securityUtils.getCurrentUserId(), daysAhead));
    }

    @PostMapping("/pets/{petId}/vaccinations")
    @Operation(summary = "Add a vaccination record for a pet")
    public ResponseEntity<Vaccination> create(@PathVariable String petId, @Valid @RequestBody Vaccination vaccination) {
        Vaccination created = vaccinationService.create(petId, vaccination, securityUtils.getCurrentUserId());
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PutMapping("/vaccinations/{id}")
    @Operation(summary = "Update a vaccination record")
    public ResponseEntity<Vaccination> update(@PathVariable String id, @Valid @RequestBody Vaccination vaccination) {
        return ResponseEntity.ok(vaccinationService.update(id, vaccination, securityUtils.getCurrentUserId()));
    }

    @DeleteMapping("/vaccinations/{id}")
    @Operation(summary = "Delete a vaccination record")
    public ResponseEntity<Void> delete(@PathVariable String id) {
        vaccinationService.delete(id, securityUtils.getCurrentUserId());
        return ResponseEntity.noContent().build();
    }
}
