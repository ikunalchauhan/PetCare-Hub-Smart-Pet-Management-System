package com.petcare.hub.controller;

import com.petcare.hub.model.Pet;
import com.petcare.hub.security.SecurityUtils;
import com.petcare.hub.service.PetService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/pets")
@Tag(name = "Pets", description = "Pet profile management")
public class PetController {

    private final PetService petService;
    private final SecurityUtils securityUtils;

    public PetController(PetService petService, SecurityUtils securityUtils) {
        this.petService = petService;
        this.securityUtils = securityUtils;
    }

    @GetMapping
    @Operation(summary = "List all pets belonging to the current user")
    public ResponseEntity<List<Pet>> getAll() {
        return ResponseEntity.ok(petService.getAllForOwner(securityUtils.getCurrentUserId()));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get a single pet's profile")
    public ResponseEntity<Pet> getById(@PathVariable String id) {
        return ResponseEntity.ok(petService.getById(id, securityUtils.getCurrentUserId()));
    }

    @PostMapping
    @Operation(summary = "Create a new pet profile")
    public ResponseEntity<Pet> create(@Valid @RequestBody Pet pet) {
        Pet created = petService.create(pet, securityUtils.getCurrentUserId());
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update an existing pet profile")
    public ResponseEntity<Pet> update(@PathVariable String id, @Valid @RequestBody Pet pet) {
        return ResponseEntity.ok(petService.update(id, pet, securityUtils.getCurrentUserId()));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete a pet profile and all related records")
    public ResponseEntity<Void> delete(@PathVariable String id) {
        petService.delete(id, securityUtils.getCurrentUserId());
        return ResponseEntity.noContent().build();
    }
}
