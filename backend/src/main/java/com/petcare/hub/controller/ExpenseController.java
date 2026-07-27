package com.petcare.hub.controller;

import com.petcare.hub.model.Expense;
import com.petcare.hub.security.SecurityUtils;
import com.petcare.hub.service.ExpenseService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
@Tag(name = "Expenses", description = "Pet expense tracking and analytics")
public class ExpenseController {

    private final ExpenseService expenseService;
    private final SecurityUtils securityUtils;

    public ExpenseController(ExpenseService expenseService, SecurityUtils securityUtils) {
        this.expenseService = expenseService;
        this.securityUtils = securityUtils;
    }

    @GetMapping("/pets/{petId}/expenses")
    @Operation(summary = "List expenses for a pet")
    public ResponseEntity<List<Expense>> getForPet(@PathVariable String petId) {
        return ResponseEntity.ok(expenseService.getForPet(petId, securityUtils.getCurrentUserId()));
    }

    @GetMapping("/expenses")
    @Operation(summary = "List all expenses for the current user")
    public ResponseEntity<List<Expense>> getAll() {
        return ResponseEntity.ok(expenseService.getAllForOwner(securityUtils.getCurrentUserId()));
    }

    @GetMapping("/expenses/breakdown")
    @Operation(summary = "Get total expenses grouped by category")
    public ResponseEntity<Map<String, Double>> getBreakdown() {
        return ResponseEntity.ok(expenseService.getCategoryBreakdown(securityUtils.getCurrentUserId()));
    }

    @GetMapping("/expenses/trend")
    @Operation(summary = "Get monthly expense totals for the past N months (default 6)")
    public ResponseEntity<Map<String, Double>> getTrend(@RequestParam(defaultValue = "6") int months) {
        return ResponseEntity.ok(expenseService.getMonthlyTrend(securityUtils.getCurrentUserId(), months));
    }

    @PostMapping("/pets/{petId}/expenses")
    @Operation(summary = "Add an expense for a pet")
    public ResponseEntity<Expense> create(@PathVariable String petId, @Valid @RequestBody Expense expense) {
        Expense created = expenseService.create(petId, expense, securityUtils.getCurrentUserId());
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PutMapping("/expenses/{id}")
    @Operation(summary = "Update an expense")
    public ResponseEntity<Expense> update(@PathVariable String id, @Valid @RequestBody Expense expense) {
        return ResponseEntity.ok(expenseService.update(id, expense, securityUtils.getCurrentUserId()));
    }

    @DeleteMapping("/expenses/{id}")
    @Operation(summary = "Delete an expense")
    public ResponseEntity<Void> delete(@PathVariable String id) {
        expenseService.delete(id, securityUtils.getCurrentUserId());
        return ResponseEntity.noContent().build();
    }
}
