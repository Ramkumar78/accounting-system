package com.accounting.controller;

import com.accounting.dto.LedgerDTO;
import com.accounting.service.AccountService;
import com.accounting.service.LedgerService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.Map;

@RestController
@RequestMapping("/ledger")
@RequiredArgsConstructor
public class LedgerController {

    private final LedgerService ledgerService;
    private final AccountService accountService;

    @GetMapping("/accounts")
    public ResponseEntity<Map<String, Object>> getAccounts() {
        return ResponseEntity.ok(Map.of("accounts", accountService.findAllActive()));
    }

    @GetMapping("/view/{accountId}")
    public ResponseEntity<LedgerDTO> viewLedger(@PathVariable Long accountId,
                             @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
                             @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        if (startDate == null) {
            startDate = LocalDate.now().withDayOfYear(1);
        }
        if (endDate == null) {
            endDate = LocalDate.now();
        }

        LedgerDTO ledger = ledgerService.generateLedger(accountId, startDate, endDate);
        return ResponseEntity.ok(ledger);
    }
}