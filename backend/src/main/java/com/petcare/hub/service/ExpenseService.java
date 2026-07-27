package com.petcare.hub.service;

import com.petcare.hub.exception.ResourceNotFoundException;
import com.petcare.hub.exception.UnauthorizedException;
import com.petcare.hub.model.Expense;
import com.petcare.hub.repository.ExpenseRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class ExpenseService {

    private final ExpenseRepository expenseRepository;
    private final PetService petService;

    public ExpenseService(ExpenseRepository expenseRepository, PetService petService) {
        this.expenseRepository = expenseRepository;
        this.petService = petService;
    }

    public List<Expense> getForPet(String petId, String ownerId) {
        petService.getById(petId, ownerId);
        return expenseRepository.findByPetIdOrderByExpenseDateDesc(petId);
    }

    public List<Expense> getAllForOwner(String ownerId) {
        return expenseRepository.findByOwnerIdOrderByExpenseDateDesc(ownerId);
    }

    public Expense create(String petId, Expense expense, String ownerId) {
        petService.getById(petId, ownerId);
        expense.setId(null);
        expense.setPetId(petId);
        expense.setOwnerId(ownerId);
        return expenseRepository.save(expense);
    }

    public Expense update(String id, Expense updates, String ownerId) {
        Expense existing = getAndVerify(id, ownerId);
        existing.setCategory(updates.getCategory());
        existing.setAmount(updates.getAmount());
        existing.setExpenseDate(updates.getExpenseDate());
        existing.setDescription(updates.getDescription());
        return expenseRepository.save(existing);
    }

    public void delete(String id, String ownerId) {
        Expense existing = getAndVerify(id, ownerId);
        expenseRepository.delete(existing);
    }

    public Map<String, Double> getCategoryBreakdown(String ownerId) {
        return expenseRepository.findByOwnerIdOrderByExpenseDateDesc(ownerId).stream()
                .collect(Collectors.groupingBy(Expense::getCategory, Collectors.summingDouble(Expense::getAmount)));
    }

    public Map<String, Double> getMonthlyTrend(String ownerId, int months) {
        LocalDate cutoff = LocalDate.now().minusMonths(months);
        return expenseRepository.findByOwnerIdOrderByExpenseDateDesc(ownerId).stream()
                .filter(e -> !e.getExpenseDate().isBefore(cutoff))
                .collect(Collectors.groupingBy(
                        e -> e.getExpenseDate().getYear() + "-" + String.format("%02d", e.getExpenseDate().getMonthValue()),
                        Collectors.summingDouble(Expense::getAmount)));
    }

    private Expense getAndVerify(String id, String ownerId) {
        Expense expense = expenseRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Expense not found with id: " + id));
        if (!expense.getOwnerId().equals(ownerId)) {
            throw new UnauthorizedException("You do not have permission to access this expense");
        }
        return expense;
    }
}
