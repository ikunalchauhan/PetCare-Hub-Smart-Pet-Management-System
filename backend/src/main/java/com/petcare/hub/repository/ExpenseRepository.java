package com.petcare.hub.repository;

import com.petcare.hub.model.Expense;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.time.LocalDate;
import java.util.List;

public interface ExpenseRepository extends MongoRepository<Expense, String> {
    List<Expense> findByPetIdOrderByExpenseDateDesc(String petId);
    List<Expense> findByOwnerIdOrderByExpenseDateDesc(String ownerId);
    List<Expense> findByOwnerIdAndExpenseDateBetween(String ownerId, LocalDate start, LocalDate end);
    void deleteByPetId(String petId);
}
