package com.accounting.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RecentTransactionDTO {
    private Long id;
    private String desc;
    private BigDecimal amount;
    private LocalDate date;
}
