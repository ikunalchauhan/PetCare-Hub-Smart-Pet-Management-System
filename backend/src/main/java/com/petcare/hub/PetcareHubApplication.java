package com.petcare.hub;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * PetCare Hub - Smart Pet Management System
 * <p>
 * Entry point for the Spring Boot application. When started, this application
 * serves both the REST API (under /api/**) and the pre-built React frontend
 * (from src/main/resources/static), giving a single-run experience:
 * one JAR, one command, everything available on the same port.
 */
@SpringBootApplication
public class PetcareHubApplication {

    public static void main(String[] args) {
        SpringApplication.run(PetcareHubApplication.class, args);
    }
}
