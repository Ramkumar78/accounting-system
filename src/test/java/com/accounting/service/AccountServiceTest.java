package com.accounting.service;

import com.accounting.exception.AccountingException;
import com.accounting.model.Account;
import com.accounting.model.AccountType;
import com.accounting.repository.AccountRepository;
import com.accounting.repository.JournalEntryLineRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AccountServiceTest {

    @Mock
    private AccountRepository accountRepository;

    @Mock
    private JournalEntryLineRepository journalEntryLineRepository;

    @InjectMocks
    private AccountService accountService;

    private Account testAccount;

    @BeforeEach
    void setUp() {
        testAccount = new Account();
        testAccount.setId(1L);
        testAccount.setCode("1001");
        testAccount.setName("Cash");
        testAccount.setAccountType(AccountType.ASSET);
        testAccount.setIsActive(true);
    }

    @Test
    void save_NewAccount_Success() {
        testAccount.setId(null);
        when(accountRepository.existsByCode("1001")).thenReturn(false);
        when(accountRepository.save(any(Account.class))).thenReturn(testAccount);

        Account saved = accountService.save(testAccount);

        assertNotNull(saved);
        assertEquals("1001", saved.getCode());
        verify(accountRepository).save(testAccount);
    }

    @Test
    void save_ExistingCode_ThrowsException() {
        testAccount.setId(null); // New account
        when(accountRepository.existsByCode("1001")).thenReturn(true);

        assertThrows(AccountingException.class, () -> accountService.save(testAccount));
        verify(accountRepository, never()).save(any());
    }

    @Test
    void deactivate_AccountWithZeroBalance_Success() {
        when(accountRepository.findById(1L)).thenReturn(Optional.of(testAccount));
        when(journalEntryLineRepository.sumDebitByAccountId(1L)).thenReturn(BigDecimal.ZERO);
        when(journalEntryLineRepository.sumCreditByAccountId(1L)).thenReturn(BigDecimal.ZERO);

        accountService.deactivate(1L);

        assertFalse(testAccount.getIsActive());
        verify(accountRepository).save(testAccount);
    }

    @Test
    void deactivate_AccountWithNonZeroBalance_ThrowsException() {
        when(accountRepository.findById(1L)).thenReturn(Optional.of(testAccount));
        when(journalEntryLineRepository.sumDebitByAccountId(1L)).thenReturn(new BigDecimal("100.00"));
        when(journalEntryLineRepository.sumCreditByAccountId(1L)).thenReturn(BigDecimal.ZERO);

        assertThrows(AccountingException.class, () -> accountService.deactivate(1L));
        assertTrue(testAccount.getIsActive());
    }

    @Test
    void getBalance_AssetAccount_ReturnsDebitMinusCredit() {
        // Asset is usually Debit normal
        // If isDebitNormal logic depends on enum, assuming ASSET is debit normal
        testAccount.setAccountType(AccountType.ASSET);

        // Mock the logic inside Account.isDebitNormal() if it's not a simple getter
        // Assuming AccountType.ASSET implies debit normal.
        // Since I can't see Account.java deeply, I'll rely on service logic.
        // Service calls account.isDebitNormal().

        when(accountRepository.findById(1L)).thenReturn(Optional.of(testAccount));
        when(journalEntryLineRepository.sumDebitByAccountId(1L)).thenReturn(new BigDecimal("100.00"));
        when(journalEntryLineRepository.sumCreditByAccountId(1L)).thenReturn(new BigDecimal("20.00"));

        BigDecimal balance = accountService.getBalance(1L);

        assertEquals(new BigDecimal("80.00"), balance);
    }
}
