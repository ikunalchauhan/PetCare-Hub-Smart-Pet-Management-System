package com.petcare.hub.config;

import com.petcare.hub.model.*;
import com.petcare.hub.repository.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

/**
 * Seeds a ready-to-use demo account with realistic sample data the first time
 * the application starts against an empty database. This makes it possible to
 * log in immediately (see credentials below) and see a fully populated
 * dashboard, pet profiles, vaccination reminders, medical history, medicines,
 * appointments and expense analytics — ideal for demos and evaluation.
 * <p>
 * Demo login: demo@petcarehub.dev / Demo@1234
 * <p>
 * This runner is idempotent: it checks for the demo user before inserting
 * anything, so it never duplicates data on subsequent restarts.
 */
@Component
public class DataSeeder implements CommandLineRunner {

    private static final String DEMO_EMAIL = "demo@petcarehub.dev";
    private static final String DEMO_PASSWORD = "Demo@1234";

    private final UserRepository userRepository;
    private final PetRepository petRepository;
    private final VaccinationRepository vaccinationRepository;
    private final MedicalRecordRepository medicalRecordRepository;
    private final MedicineRepository medicineRepository;
    private final AppointmentRepository appointmentRepository;
    private final ExpenseRepository expenseRepository;
    private final PasswordEncoder passwordEncoder;

    public DataSeeder(UserRepository userRepository,
                       PetRepository petRepository,
                       VaccinationRepository vaccinationRepository,
                       MedicalRecordRepository medicalRecordRepository,
                       MedicineRepository medicineRepository,
                       AppointmentRepository appointmentRepository,
                       ExpenseRepository expenseRepository,
                       PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.petRepository = petRepository;
        this.vaccinationRepository = vaccinationRepository;
        this.medicalRecordRepository = medicalRecordRepository;
        this.medicineRepository = medicineRepository;
        this.appointmentRepository = appointmentRepository;
        this.expenseRepository = expenseRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        if (userRepository.existsByEmail(DEMO_EMAIL)) {
            return; // already seeded — do nothing
        }

        User demoUser = new User();
        demoUser.setFullName("Alex Morgan");
        demoUser.setEmail(DEMO_EMAIL);
        demoUser.setPassword(passwordEncoder.encode(DEMO_PASSWORD));
        demoUser.setPhone("+1 (555) 234-7890");
        demoUser.setRole("USER");
        demoUser = userRepository.save(demoUser);
        final String ownerId = demoUser.getId();

        LocalDate today = LocalDate.now();

        Pet buddy = new Pet();
        buddy.setOwnerId(ownerId);
        buddy.setName("Buddy");
        buddy.setSpecies("Dog");
        buddy.setBreed("Golden Retriever");
        buddy.setGender("Male");
        buddy.setDateOfBirth(today.minusYears(3).minusMonths(2));
        buddy.setWeightKg(28.5);
        buddy.setColor("Golden");
        buddy.setMicrochipId("985121054327618");
        buddy.setNotes("Loves the park, mild grass pollen allergy in spring.");
        buddy = petRepository.save(buddy);

        Pet luna = new Pet();
        luna.setOwnerId(ownerId);
        luna.setName("Luna");
        luna.setSpecies("Cat");
        luna.setBreed("British Shorthair");
        luna.setGender("Female");
        luna.setDateOfBirth(today.minusYears(2).minusMonths(5));
        luna.setWeightKg(4.2);
        luna.setColor("Blue-Gray");
        luna.setMicrochipId("985121054398201");
        luna.setNotes("Indoor cat, slightly picky eater.");
        luna = petRepository.save(luna);

        Pet milo = new Pet();
        milo.setOwnerId(ownerId);
        milo.setName("Milo");
        milo.setSpecies("Rabbit");
        milo.setBreed("Holland Lop");
        milo.setGender("Male");
        milo.setDateOfBirth(today.minusMonths(10));
        milo.setWeightKg(1.6);
        milo.setColor("Brown & White");
        milo.setNotes("Young and energetic, still being litter-trained.");
        milo = petRepository.save(milo);

        seedVaccinations(buddy.getId(), luna.getId(), milo.getId(), ownerId, today);
        seedMedicalRecords(buddy.getId(), luna.getId(), milo.getId(), ownerId, today);
        seedMedicines(buddy.getId(), luna.getId(), ownerId, today);
        seedAppointments(buddy.getId(), luna.getId(), milo.getId(), ownerId, today);
        seedExpenses(buddy.getId(), luna.getId(), milo.getId(), ownerId, today);
    }

    private void seedVaccinations(String buddyId, String lunaId, String miloId, String ownerId, LocalDate today) {
        vaccinationRepository.save(vaccination(buddyId, ownerId, "Rabies", today.minusMonths(11), today.plusDays(20), "Dr. Emily Carter", "Sunrise Animal Clinic", "RB-2291"));
        vaccinationRepository.save(vaccination(buddyId, ownerId, "DHPP", today.minusMonths(10), today.plusDays(5), "Dr. Emily Carter", "Sunrise Animal Clinic", "DH-8842"));
        vaccinationRepository.save(vaccination(buddyId, ownerId, "Bordetella", today.minusMonths(4), today.plusMonths(8), "Dr. Emily Carter", "Sunrise Animal Clinic", "BD-1027"));

        vaccinationRepository.save(vaccination(lunaId, ownerId, "FVRCP", today.minusMonths(9), today.minusDays(10), "Dr. Raj Patel", "Willow Vet Hospital", "FV-3345"));
        vaccinationRepository.save(vaccination(lunaId, ownerId, "Rabies", today.minusMonths(6), today.plusMonths(6), "Dr. Raj Patel", "Willow Vet Hospital", "RB-5521"));

        vaccinationRepository.save(vaccination(miloId, ownerId, "RHDV2", today.minusMonths(2), today.plusDays(15), "Dr. Priya Nair", "Willow Vet Hospital", "RH-0098"));
    }

    private Vaccination vaccination(String petId, String ownerId, String name, LocalDate given, LocalDate due, String vet, String clinic, String batch) {
        Vaccination v = new Vaccination();
        v.setPetId(petId);
        v.setOwnerId(ownerId);
        v.setVaccineName(name);
        v.setDateAdministered(given);
        v.setNextDueDate(due);
        v.setVeterinarianName(vet);
        v.setClinicName(clinic);
        v.setBatchNumber(batch);
        return v;
    }

    private void seedMedicalRecords(String buddyId, String lunaId, String miloId, String ownerId, LocalDate today) {
        medicalRecordRepository.save(record(buddyId, ownerId, today.minusMonths(4), "Mild ear infection", "Prescribed ear drops for 10 days", "Dr. Emily Carter", "Sunrise Animal Clinic", "Fully recovered, no recurrence."));
        medicalRecordRepository.save(record(buddyId, ownerId, today.minusMonths(1), "Annual wellness exam", "Bloodwork normal, weight stable", "Dr. Emily Carter", "Sunrise Animal Clinic", "Recommended dental cleaning next visit."));
        medicalRecordRepository.save(record(lunaId, ownerId, today.minusMonths(2), "Dental checkup", "Mild tartar buildup, cleaning scheduled", "Dr. Raj Patel", "Willow Vet Hospital", null));
        medicalRecordRepository.save(record(miloId, ownerId, today.minusDays(20), "Routine checkup", "Healthy, growing well", "Dr. Priya Nair", "Willow Vet Hospital", null));
    }

    private MedicalRecord record(String petId, String ownerId, LocalDate date, String diagnosis, String treatment, String vet, String clinic, String notes) {
        MedicalRecord r = new MedicalRecord();
        r.setPetId(petId);
        r.setOwnerId(ownerId);
        r.setVisitDate(date);
        r.setDiagnosis(diagnosis);
        r.setTreatment(treatment);
        r.setVeterinarianName(vet);
        r.setClinicName(clinic);
        r.setNotes(notes);
        return r;
    }

    private void seedMedicines(String buddyId, String lunaId, String ownerId, LocalDate today) {
        medicineRepository.save(medicine(buddyId, ownerId, "Heartgard Plus", "1 chewable", "Once monthly", today.minusMonths(6), null, "Dr. Emily Carter", "Give with food", true));
        medicineRepository.save(medicine(buddyId, ownerId, "Otibiotic Ear Drops", "3 drops", "Twice daily", today.minusMonths(4), today.minusMonths(4).plusDays(10), "Dr. Emily Carter", "Completed course for ear infection", false));
        medicineRepository.save(medicine(lunaId, ownerId, "Revolution Plus", "1 dose", "Once monthly", today.minusMonths(3), null, "Dr. Raj Patel", "Flea and worm prevention", true));
    }

    private Medicine medicine(String petId, String ownerId, String name, String dosage, String frequency, LocalDate start, LocalDate end, String prescribedBy, String instructions, boolean active) {
        Medicine m = new Medicine();
        m.setPetId(petId);
        m.setOwnerId(ownerId);
        m.setName(name);
        m.setDosage(dosage);
        m.setFrequency(frequency);
        m.setStartDate(start);
        m.setEndDate(end);
        m.setPrescribedBy(prescribedBy);
        m.setInstructions(instructions);
        m.setActive(active);
        return m;
    }

    private void seedAppointments(String buddyId, String lunaId, String miloId, String ownerId, LocalDate today) {
        appointmentRepository.save(appointment(buddyId, ownerId, "Dental Cleaning", LocalDateTime.of(today.plusDays(6), LocalTime.of(10, 30)), "Dr. Emily Carter", "Sunrise Animal Clinic", "Routine dental cleaning", "SCHEDULED"));
        appointmentRepository.save(appointment(lunaId, ownerId, "Vaccination Booster", LocalDateTime.of(today.plusDays(3), LocalTime.of(14, 0)), "Dr. Raj Patel", "Willow Vet Hospital", "FVRCP booster shot", "SCHEDULED"));
        appointmentRepository.save(appointment(miloId, ownerId, "Nail Trim & Checkup", LocalDateTime.of(today.plusDays(12), LocalTime.of(9, 0)), "Dr. Priya Nair", "Willow Vet Hospital", "Routine grooming and checkup", "SCHEDULED"));
        appointmentRepository.save(appointment(buddyId, ownerId, "Annual Wellness Exam", LocalDateTime.of(today.minusMonths(1), LocalTime.of(11, 0)), "Dr. Emily Carter", "Sunrise Animal Clinic", "Yearly physical exam", "COMPLETED"));
        appointmentRepository.save(appointment(lunaId, ownerId, "Dental Checkup", LocalDateTime.of(today.minusMonths(2), LocalTime.of(13, 30)), "Dr. Raj Patel", "Willow Vet Hospital", "Dental assessment", "COMPLETED"));
    }

    private Appointment appointment(String petId, String ownerId, String title, LocalDateTime date, String vet, String clinic, String reason, String status) {
        Appointment a = new Appointment();
        a.setPetId(petId);
        a.setOwnerId(ownerId);
        a.setTitle(title);
        a.setAppointmentDate(date);
        a.setVeterinarianName(vet);
        a.setClinicName(clinic);
        a.setReason(reason);
        a.setStatus(status);
        return a;
    }

    private void seedExpenses(String buddyId, String lunaId, String miloId, String ownerId, LocalDate today) {
        for (int i = 0; i < 6; i++) {
            LocalDate month = today.minusMonths(i);
            expenseRepository.save(expense(buddyId, ownerId, "FOOD", 45.0 + i, month.withDayOfMonth(Math.min(3, month.lengthOfMonth())), "Premium dry kibble - 15kg bag"));
            expenseRepository.save(expense(lunaId, ownerId, "FOOD", 28.0 + i * 0.5, month.withDayOfMonth(Math.min(5, month.lengthOfMonth())), "Grain-free cat food"));
        }
        expenseRepository.save(expense(buddyId, ownerId, "MEDICAL", 180.0, today.minusMonths(4), "Ear infection treatment"));
        expenseRepository.save(expense(buddyId, ownerId, "GROOMING", 55.0, today.minusMonths(1), "Full grooming session"));
        expenseRepository.save(expense(lunaId, ownerId, "MEDICAL", 95.0, today.minusMonths(2), "Dental checkup"));
        expenseRepository.save(expense(lunaId, ownerId, "ACCESSORIES", 32.0, today.minusDays(15), "New scratching post"));
        expenseRepository.save(expense(miloId, ownerId, "ACCESSORIES", 40.0, today.minusDays(25), "Hutch bedding and toys"));
        expenseRepository.save(expense(buddyId, ownerId, "INSURANCE", 65.0, today.minusDays(2), "Monthly pet insurance premium"));
        expenseRepository.save(expense(lunaId, ownerId, "INSURANCE", 38.0, today.minusDays(2), "Monthly pet insurance premium"));
        expenseRepository.save(expense(miloId, ownerId, "MEDICAL", 60.0, today.minusDays(20), "Routine checkup fee"));
    }

    private Expense expense(String petId, String ownerId, String category, double amount, LocalDate date, String description) {
        Expense e = new Expense();
        e.setPetId(petId);
        e.setOwnerId(ownerId);
        e.setCategory(category);
        e.setAmount(amount);
        e.setExpenseDate(date);
        e.setDescription(description);
        return e;
    }
}
