package com.petcare.hub.service;

import com.petcare.hub.exception.BadRequestException;
import com.petcare.hub.exception.ResourceNotFoundException;
import com.petcare.hub.exception.UnauthorizedException;
import com.petcare.hub.model.PetDocument;
import com.petcare.hub.repository.PetDocumentRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.UUID;

@Service
public class DocumentService {

    private final PetDocumentRepository petDocumentRepository;
    private final PetService petService;
    private final String uploadDir;

    public DocumentService(PetDocumentRepository petDocumentRepository,
                            PetService petService,
                            @Value("${app.upload.dir}") String uploadDir) {
        this.petDocumentRepository = petDocumentRepository;
        this.petService = petService;
        this.uploadDir = uploadDir;
        try {
            Files.createDirectories(Paths.get(uploadDir));
        } catch (IOException e) {
            throw new RuntimeException("Could not initialize upload directory: " + uploadDir, e);
        }
    }

    public List<PetDocument> getForPet(String petId, String ownerId) {
        petService.getById(petId, ownerId);
        return petDocumentRepository.findByPetIdOrderByUploadedAtDesc(petId);
    }

    public List<PetDocument> getAllForOwner(String ownerId) {
        return petDocumentRepository.findByOwnerIdOrderByUploadedAtDesc(ownerId);
    }

    public PetDocument upload(String petId, MultipartFile file, String category, String description, String ownerId) {
        petService.getById(petId, ownerId);

        if (file == null || file.isEmpty()) {
            throw new BadRequestException("Please attach a file to upload");
        }

        String originalName = StringUtils.cleanPath(file.getOriginalFilename() == null ? "file" : file.getOriginalFilename());
        String extension = originalName.contains(".") ? originalName.substring(originalName.lastIndexOf('.')) : "";
        String storedName = UUID.randomUUID() + extension;

        try {
            Path targetPath = Paths.get(uploadDir).resolve(storedName).normalize();
            Files.copy(file.getInputStream(), targetPath, StandardCopyOption.REPLACE_EXISTING);
        } catch (IOException e) {
            throw new RuntimeException("Failed to store uploaded file", e);
        }

        PetDocument document = new PetDocument();
        document.setPetId(petId);
        document.setOwnerId(ownerId);
        document.setFileName(storedName);
        document.setOriginalFileName(originalName);
        document.setContentType(file.getContentType());
        document.setFileSize(file.getSize());
        document.setStoredPath("/uploads/" + storedName);
        document.setCategory(category == null || category.isBlank() ? "OTHER" : category.toUpperCase());
        document.setDescription(description);

        return petDocumentRepository.save(document);
    }

    public void delete(String id, String ownerId) {
        PetDocument document = petDocumentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Document not found with id: " + id));
        if (!document.getOwnerId().equals(ownerId)) {
            throw new UnauthorizedException("You do not have permission to delete this document");
        }
        try {
            Files.deleteIfExists(Paths.get(uploadDir).resolve(document.getFileName()));
        } catch (IOException ignored) {
            // Non-fatal: proceed with removing the database record regardless.
        }
        petDocumentRepository.delete(document);
    }
}
