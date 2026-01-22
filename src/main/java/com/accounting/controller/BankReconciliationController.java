package com.accounting.controller;

import com.accounting.model.BankAccount;
import com.accounting.model.BankStatement;
import com.accounting.service.AccountService;
import com.accounting.service.BankReconciliationService;
import com.accounting.service.CurrencyService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/bank")
@RequiredArgsConstructor
public class BankReconciliationController {

    private final BankReconciliationService bankReconciliationService;
    private final AccountService accountService;
    private final CurrencyService currencyService;

    @GetMapping("/accounts")
    public ResponseEntity<List<BankAccount>> listBankAccounts() {
        List<BankAccount> accounts = bankReconciliationService.findAllBankAccounts();
        return ResponseEntity.ok(accounts);
    }

    @GetMapping("/accounts/form-data")
    public ResponseEntity<Map<String, Object>> getFormData() {
        return ResponseEntity.ok(Map.of(
            "glAccounts", accountService.findActiveByType(com.accounting.model.AccountType.ASSET),
            "currencies", currencyService.findAll()
        ));
    }

    @PostMapping("/accounts/save")
    public ResponseEntity<BankAccount> saveBankAccount(@RequestBody BankAccount bankAccount) {
        return ResponseEntity.ok(bankReconciliationService.saveBankAccount(bankAccount));
    }

    @GetMapping("/accounts/{id}")
    public ResponseEntity<BankAccount> getBankAccount(@PathVariable Long id) {
        BankAccount bankAccount = bankReconciliationService.findBankAccountById(id)
                .orElseThrow(() -> new IllegalArgumentException("Bank account not found: " + id));
        return ResponseEntity.ok(bankAccount);
    }

    @GetMapping("/reconciliation")
    public ResponseEntity<List<BankAccount>> reconciliationHome() {
        return ResponseEntity.ok(bankReconciliationService.findActiveBankAccounts());
    }

    @GetMapping("/reconciliation/{bankAccountId}")
    public ResponseEntity<Map<String, Object>> reconcile(@PathVariable Long bankAccountId,
                            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
                            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        BankAccount bankAccount = bankReconciliationService.findBankAccountById(bankAccountId)
                .orElseThrow(() -> new IllegalArgumentException("Bank account not found: " + bankAccountId));

        if (startDate == null) {
            startDate = LocalDate.now().withDayOfMonth(1);
        }
        if (endDate == null) {
            endDate = LocalDate.now();
        }

        List<BankStatement> statements = bankReconciliationService
                .findStatementsByDateRange(bankAccountId, startDate, endDate);
        List<BankStatement> unreconciled = bankReconciliationService.findUnreconciledStatements(bankAccountId);

        return ResponseEntity.ok(Map.of(
            "bankAccount", bankAccount,
            "statements", statements,
            "unreconciledStatements", unreconciled,
            "reconciledBalance", bankReconciliationService.getReconciledBalance(bankAccountId),
            "startDate", startDate,
            "endDate", endDate
        ));
    }

    @PostMapping("/reconciliation/match")
    public ResponseEntity<Void> matchStatement(@RequestParam Long statementId,
                                 @RequestParam Long journalLineId) {
        bankReconciliationService.reconcileStatement(statementId, journalLineId);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/reconciliation/unmatch/{statementId}")
    public ResponseEntity<Void> unmatchStatement(@PathVariable Long statementId) {
        bankReconciliationService.unreconcileStatement(statementId);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/statements/import/{bankAccountId}")
    public ResponseEntity<Void> importStatements(@PathVariable Long bankAccountId,
                                   @RequestBody BankStatement statement) {
        BankAccount bankAccount = bankReconciliationService.findBankAccountById(bankAccountId)
                .orElseThrow(() -> new IllegalArgumentException("Bank account not found: " + bankAccountId));

        statement.setBankAccount(bankAccount);
        bankReconciliationService.importStatement(statement);

        return ResponseEntity.ok().build();
    }
}