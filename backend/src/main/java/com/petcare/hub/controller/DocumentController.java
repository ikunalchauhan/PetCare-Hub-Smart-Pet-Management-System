package com.petcare.hub.controller;

import com.petcare.hub.model.PetDocument;
import com.petcare.hub.security.SecurityUtils;
import com.petcare.hub.service.DocumentService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api")
@Tag(name = "Documents", description = "Pet document uploads (vaccination certificates, insurance, etc.)")
public class DocumentController {

    private final DocumentService documentService;
    private final SecurityUtils securityUtils;

    public DocumentController(DocumentService documentService, SecurityUtils securityUtils) {
        this.documentService = documentService;
        this.securityUtils = securityUtils;
    }

    @GetMapping("/pets/{petId}/documents")
    @Operation(summary = "List documents for a pet")
    public ResponseEntity<List<PetDocument>> getForPet(@PathVariable String petId) {
        return ResponseEntity.ok(documentService.getForPet(petId, securityUtils.getCurrentUserId()));
    }

    @GetMapping("/documents")
    @Operation(summary = "List all documents for the current user")
    public ResponseEntity<List<PetDocument>> getAll() {
        return ResponseEntity.ok(documentService.getAllForOwner(securityUtils.getCurrentUserId()));
    }

    @PostMapping(value = "/pets/{petId}/documents", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @Operation(summary = "Upload a document/file for a pet")
    public ResponseEntity<PetDocument> upload(@PathVariable String petId,
                                               @RequestParam("file") MultipartFile file,
                                               @RequestParam(value = "category", required = false) String category,
                                               @RequestParam(value = "description", required = false) String description) {
        PetDocument created = documentService.upload(petId, file, category, description, securityUtils.getCurrentUserId());
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @DeleteMapping("/documents/{id}")
    @Operation(summary = "Delete a document")
    public ResponseEntity<Void> delete(@PathVariable String id) {
        documentService.delete(id, securityUtils.getCurrentUserId());
        return ResponseEntity.noContent().build();
    }
}
