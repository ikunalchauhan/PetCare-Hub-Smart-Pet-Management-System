package com.petcare.hub.service;

import com.petcare.hub.model.Appointment;
import com.petcare.hub.model.Expense;
import com.petcare.hub.model.Medicine;
import com.petcare.hub.model.Vaccination;
import com.petcare.hub.repository.AppointmentRepository;
import com.petcare.hub.repository.ExpenseRepository;
import com.petcare.hub.repository.MedicineRepository;
import com.petcare.hub.repository.PetRepository;
import com.petcare.hub.repository.VaccinationRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class DashboardService {

    private final PetRepository petRepository;
    private final VaccinationRepository vaccinationRepository;
    private final AppointmentRepository appointmentRepository;
    private final MedicineRepository medicineRepository;
    private final ExpenseRepository expenseRepository;

    public DashboardService(PetRepository petRepository,
                             VaccinationRepository vaccinationRepository,
                             AppointmentRepository appointmentRepository,
                             MedicineRepository medicineRepository,
                             ExpenseRepository expenseRepository) {
        this.petRepository = petRepository;
        this.vaccinationRepository = vaccinationRepository;
        this.appointmentRepository = appointmentRepository;
        this.medicineRepository = medicineRepository;
        this.expenseRepository = expenseRepository;
    }

    public Map<String, Object> getSummary(String ownerId) {
        LocalDate today = LocalDate.now();
        LocalDateTime now = LocalDateTime.now();

        long totalPets = petRepository.countByOwnerId(ownerId);

        List<Vaccination> allVaccinations = vaccinationRepository.findByOwnerIdOrderByNextDueDateAsc(ownerId);
        List<Vaccination> dueSoon = allVaccinations.stream()
                .filter(v -> !v.getNextDueDate().isBefore(today) && !v.getNextDueDate().isAfter(today.plusDays(30)))
                .collect(Collectors.toList());
        List<Vaccination> overdue = allVaccinations.stream()
                .filter(v -> v.getNextDueDate().isBefore(today))
                .collect(Collectors.toList());

        List<Appointment> allUpcomingAppointments = appointmentRepository.findByOwnerIdOrderByAppointmentDateAsc(ownerId).stream()
                .filter(a -> a.getAppointmentDate().isAfter(now) && "SCHEDULED".equals(a.getStatus()))
                .collect(Collectors.toList());
        List<Appointment> upcomingAppointments = allUpcomingAppointments.stream()
                .limit(10)
                .collect(Collectors.toList());

        List<Medicine> activeMedicines = medicineRepository.findByOwnerIdAndActiveTrue(ownerId);

        List<Expense> allExpenses = expenseRepository.findByOwnerIdOrderByExpenseDateDesc(ownerId);
        double totalExpenses = allExpenses.stream().mapToDouble(Expense::getAmount).sum();
        double thisMonthExpenses = allExpenses.stream()
                .filter(e -> e.getExpenseDate().getMonthValue() == today.getMonthValue()
                        && e.getExpenseDate().getYear() == today.getYear())
                .mapToDouble(Expense::getAmount).sum();

        Map<String, Double> expensesByCategory = allExpenses.stream()
                .collect(Collectors.groupingBy(Expense::getCategory, Collectors.summingDouble(Expense::getAmount)));

        Map<String, Double> monthlyTrend = new LinkedHashMap<>();
        for (int i = 5; i >= 0; i--) {
            LocalDate month = today.minusMonths(i);
            String key = month.getYear() + "-" + String.format("%02d", month.getMonthValue());
            double sum = allExpenses.stream()
                    .filter(e -> e.getExpenseDate().getYear() == month.getYear()
                            && e.getExpenseDate().getMonthValue() == month.getMonthValue())
                    .mapToDouble(Expense::getAmount).sum();
            monthlyTrend.put(key, sum);
        }

        Map<String, Object> summary = new LinkedHashMap<>();
        summary.put("totalPets", totalPets);
        summary.put("vaccinationsDueSoon", dueSoon.size());
        summary.put("vaccinationsOverdue", overdue.size());
        summary.put("upcomingAppointmentsCount", allUpcomingAppointments.size());
        summary.put("activeMedicinesCount", activeMedicines.size());
        summary.put("totalExpenses", totalExpenses);
        summary.put("thisMonthExpenses", thisMonthExpenses);
        summary.put("expensesByCategory", expensesByCategory);
        summary.put("monthlyExpenseTrend", monthlyTrend);
        summary.put("upcomingAppointments", upcomingAppointments);
        summary.put("vaccinationReminders", dueSoon);
        summary.put("overdueVaccinations", overdue);
        summary.put("activeMedicines", activeMedicines);

        return summary;
    }
}
