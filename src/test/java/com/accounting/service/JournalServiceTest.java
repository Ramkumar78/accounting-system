package com.accounting.service;

import com.accounting.dto.JournalEntryDTO;
import com.accounting.exception.AccountingException;
import com.accounting.model.*;
import com.accounting.repository.AccountRepository;
import com.accounting.repository.JournalEntryRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class JournalServiceTest {

    @Mock
    private JournalEntryRepository journalEntryRepository;

    @Mock
    private AccountRepository accountRepository;

    @InjectMocks
    private JournalService journalService;

    private JournalEntryDTO validDto;
    private Account debitAccount;
    private Account creditAccount;

    @BeforeEach
    void setUp() {
        debitAccount = new Account();
        debitAccount.setId(1L);
        debitAccount.setIsActive(true);

        creditAccount = new Account();
        creditAccount.setId(2L);
        creditAccount.setIsActive(true);

        validDto = new JournalEntryDTO();
        validDto.setEntryDate(LocalDate.now());
        validDto.setDescription("Test Entry");

        JournalEntryDTO.JournalEntryLineDTO debitLine = new JournalEntryDTO.JournalEntryLineDTO();
        debitLine.setAccountId(1L);
        debitLine.setDebitAmount(new BigDecimal("100.00"));

        JournalEntryDTO.JournalEntryLineDTO creditLine = new JournalEntryDTO.JournalEntryLineDTO();
        creditLine.setAccountId(2L);
        creditLine.setCreditAmount(new BigDecimal("100.00"));

        List<JournalEntryDTO.JournalEntryLineDTO> lines = new ArrayList<>();
        lines.add(debitLine);
        lines.add(creditLine);
        validDto.setLines(lines);
    }

    @Test
    void createEntry_ValidBalancedEntry_Success() {
        when(accountRepository.findById(1L)).thenReturn(Optional.of(debitAccount));
        when(accountRepository.findById(2L)).thenReturn(Optional.of(creditAccount));
        when(journalEntryRepository.save(any(JournalEntry.class))).thenAnswer(i -> i.getArguments()[0]);

        JournalEntry result = journalService.createEntry(validDto, new User());

        assertNotNull(result);
        assertEquals(EntryStatus.DRAFT, result.getStatus());
        assertEquals(2, result.getLines().size());
        verify(journalEntryRepository).save(any(JournalEntry.class));
    }

    @Test
    void createEntry_Unbalanced_ThrowsException() {
        validDto.getLines().get(0).setDebitAmount(new BigDecimal("150.00")); // Debit 150, Credit 100

        when(accountRepository.findById(1L)).thenReturn(Optional.of(debitAccount));
        when(accountRepository.findById(2L)).thenReturn(Optional.of(creditAccount));

        assertThrows(AccountingException.class, () -> journalService.createEntry(validDto, new User()));
    }

    @Test
    void postEntry_DraftEntry_Success() {
        JournalEntry draftEntry = new JournalEntry();
        draftEntry.setId(1L);
        draftEntry.setStatus(EntryStatus.DRAFT);

        JournalEntryLine line1 = new JournalEntryLine();
        line1.setAccount(debitAccount);
        line1.setDebitAmount(new BigDecimal("100"));
        line1.setCreditAmount(BigDecimal.ZERO);

        JournalEntryLine line2 = new JournalEntryLine();
        line2.setAccount(creditAccount);
        line2.setDebitAmount(BigDecimal.ZERO);
        line2.setCreditAmount(new BigDecimal("100"));

        draftEntry.setLines(new ArrayList<>());
        draftEntry.getLines().add(line1);
        draftEntry.getLines().add(line2);

        when(journalEntryRepository.findByIdWithLines(1L)).thenReturn(Optional.of(draftEntry));
        when(journalEntryRepository.save(any(JournalEntry.class))).thenAnswer(i -> i.getArguments()[0]);

        JournalEntry posted = journalService.postEntry(1L);

        assertEquals(EntryStatus.POSTED, posted.getStatus());
        assertNotNull(posted.getPostedAt());
    }

    @Test
    void postEntry_AlreadyPosted_ThrowsException() {
        JournalEntry postedEntry = new JournalEntry();
        postedEntry.setId(1L);
        postedEntry.setStatus(EntryStatus.POSTED);

        when(journalEntryRepository.findByIdWithLines(1L)).thenReturn(Optional.of(postedEntry));

        assertThrows(AccountingException.class, () -> journalService.postEntry(1L));
    }
}
