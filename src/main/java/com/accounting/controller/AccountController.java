package com.accounting.controller;

import com.accounting.model.Account;
import com.accounting.model.AccountType;
import com.accounting.service.AccountService;
import com.accounting.service.CurrencyService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/accounts")
@RequiredArgsConstructor
public class AccountController {

    private final AccountService accountService;
    private final CurrencyService currencyService;

    @GetMapping
    public ResponseEntity<List<Map<String, Object>>> listAccounts() {
        List<Account> accounts = accountService.findAllActive();
        List<Map<String, Object>> result = accounts.stream().map(account -> {
            Map<String, Object> map = new HashMap<>();
            map.put("id", account.getId());
            map.put("code", account.getCode());
            map.put("name", account.getName());
            map.put("type", account.getAccountType());
            map.put("description", account.getDescription());
            map.put("balance", accountService.getBalance(account.getId()));
            return map;
        }).collect(Collectors.toList());
        return ResponseEntity.ok(result);
    }

    @GetMapping("/all")
    public ResponseEntity<List<Account>> listAllAccounts() {
        return ResponseEntity.ok(accountService.findAll());
    }

    // For form data (types, currencies, parents), we can have a separate endpoint or fetch them individually
    @GetMapping("/form-data")
    public ResponseEntity<Map<String, Object>> getFormData() {
        return ResponseEntity.ok(Map.of(
            "accountTypes", AccountType.values(),
            "currencies", currencyService.findAll(),
            "parentAccounts", accountService.findAllActive()
        ));
    }

    @PostMapping("/save")
    public ResponseEntity<Account> saveAccount(@RequestBody Account account) {
        return ResponseEntity.ok(accountService.save(account));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Account> getAccount(@PathVariable Long id) {
        Account account = accountService.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Account not found: " + id));
        return ResponseEntity.ok(account);
    }

    @GetMapping("/{id}/balance")
    public ResponseEntity<Map<String, Object>> getAccountBalance(@PathVariable Long id) {
        Account account = accountService.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Account not found: " + id));
        BigDecimal balance = accountService.getBalance(id);
        return ResponseEntity.ok(Map.of("account", account, "balance", balance));
    }

    @PostMapping("/deactivate/{id}")
    public ResponseEntity<Void> deactivateAccount(@PathVariable Long id) {
        accountService.deactivate(id);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/activate/{id}")
    public ResponseEntity<Void> activateAccount(@PathVariable Long id) {
        accountService.activate(id);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/by-type/{type}")
    public ResponseEntity<List<Account>> listByType(@PathVariable String type) {
        AccountType accountType = AccountType.valueOf(type.toUpperCase());
        return ResponseEntity.ok(accountService.findActiveByType(accountType));
    }
}