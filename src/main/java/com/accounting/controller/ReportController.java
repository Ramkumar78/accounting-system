package com.accounting.controller;

import com.accounting.dto.BalanceSheetDTO;
import com.accounting.dto.ProfitLossDTO;
import com.accounting.dto.TrialBalanceDTO;
import com.accounting.service.LedgerService;
import com.accounting.service.ReportService;
import com.accounting.service.AccountService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import com.accounting.dto.LedgerDTO;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.Map;

@RestController
@RequestMapping("/reports")
@RequiredArgsConstructor
public class ReportController {

    private final ReportService reportService;
    private final LedgerService ledgerService;
    private final AccountService accountService;

    @GetMapping("/trial-balance")
    public ResponseEntity<TrialBalanceDTO> trialBalance(@RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate asOfDate) {
        if (asOfDate == null) {
            asOfDate = LocalDate.now();
        }
        return ResponseEntity.ok(reportService.generateTrialBalance(asOfDate));
    }

    @GetMapping("/profit-loss")
    public ResponseEntity<ProfitLossDTO> profitLoss(@RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
                             @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        if (startDate == null) {
            startDate = LocalDate.now().withDayOfYear(1);
        }
        if (endDate == null) {
            endDate = LocalDate.now();
        }
        return ResponseEntity.ok(reportService.generateProfitLoss(startDate, endDate));
    }

    @GetMapping("/balance-sheet")
    public ResponseEntity<BalanceSheetDTO> balanceSheet(@RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate asOfDate) {
        if (asOfDate == null) {
            asOfDate = LocalDate.now();
        }
        return ResponseEntity.ok(reportService.generateBalanceSheet(asOfDate));
    }

    @GetMapping("/general-ledger")
    public ResponseEntity<Map<String, Object>> generalLedger(@RequestParam(required = false) Long accountId,
                                @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
                                @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        if (startDate == null) {
            startDate = LocalDate.now().withDayOfYear(1);
        }
        if (endDate == null) {
            endDate = LocalDate.now();
        }

        LedgerDTO ledger = null;
        if (accountId != null) {
            ledger = ledgerService.generateLedger(accountId, startDate, endDate);
        }

        return ResponseEntity.ok(Map.of(
            "accounts", accountService.findAllActive(),
            "startDate", startDate,
            "endDate", endDate,
            "ledger", ledger != null ? ledger : "null"
        ));
    }
}