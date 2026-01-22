package com.accounting.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DashboardDTO {
    private BigDecimal totalAssets = BigDecimal.ZERO;
    private BigDecimal totalLiabilities = BigDecimal.ZERO;
    private BigDecimal totalEquity = BigDecimal.ZERO;
    private BigDecimal totalRevenue = BigDecimal.ZERO;
    private BigDecimal totalExpenses = BigDecimal.ZERO;
    private BigDecimal netIncome = BigDecimal.ZERO;
    private BigDecimal cashBalance = BigDecimal.ZERO;
    private BigDecimal accountsReceivable = BigDecimal.ZERO;
    private BigDecimal accountsPayable = BigDecimal.ZERO;
    private Long pendingJournalEntries = 0L;
    private Long overdueInvoices = 0L;
    private BigDecimal overdueAmount = BigDecimal.ZERO;
    private List<RecentTransactionDTO> recentTransactions = new ArrayList<>();
}