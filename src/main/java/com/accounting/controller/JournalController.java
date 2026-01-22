package com.accounting.controller;

import com.accounting.dto.JournalEntryDTO;
import com.accounting.model.Account;
import com.accounting.model.EntryStatus;
import com.accounting.model.JournalEntry;
import com.accounting.model.User;
import com.accounting.service.AccountService;
import com.accounting.service.JournalService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/journal")
@RequiredArgsConstructor
public class JournalController {

    private final JournalService journalService;
    private final AccountService accountService;

    @GetMapping
    public ResponseEntity<Page<JournalEntry>> listEntries(@RequestParam(defaultValue = "0") int page,
                              @RequestParam(defaultValue = "20") int size) {
        Page<JournalEntry> entries = journalService.findAll(
                PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "entryDate", "entryNumber")));
        return ResponseEntity.ok(entries);
    }

    @GetMapping("/form-data")
    public ResponseEntity<Map<String, Object>> getFormData() {
        return ResponseEntity.ok(Map.of(
            "accounts", accountService.findAllActive(),
            "statuses", EntryStatus.values()
        ));
    }

    @PostMapping("/save")
    public ResponseEntity<JournalEntry> saveEntry(@RequestBody JournalEntryDTO dto,
                            @AuthenticationPrincipal User user) {
        JournalEntry entry;
        if (dto.getId() == null) {
            entry = journalService.createEntry(dto, user);
        } else {
            entry = journalService.updateEntry(dto.getId(), dto);
        }
        return ResponseEntity.ok(entry);
    }

    @GetMapping("/{id}")
    public ResponseEntity<JournalEntryDTO> getEntry(@PathVariable Long id) {
        JournalEntry entry = journalService.findByIdWithLines(id)
                .orElseThrow(() -> new IllegalArgumentException("Journal entry not found: " + id));

        JournalEntryDTO dto = new JournalEntryDTO();
        dto.setId(entry.getId());
        dto.setEntryNumber(entry.getEntryNumber());
        dto.setEntryDate(entry.getEntryDate());
        dto.setDescription(entry.getDescription());
        dto.setReference(entry.getReference());

        entry.getLines().forEach(line -> {
            JournalEntryDTO.JournalEntryLineDTO lineDto = new JournalEntryDTO.JournalEntryLineDTO();
            lineDto.setId(line.getId());
            lineDto.setAccountId(line.getAccount().getId());
            lineDto.setAccountCode(line.getAccount().getCode());
            lineDto.setAccountName(line.getAccount().getName());
            lineDto.setDebitAmount(line.getDebitAmount());
            lineDto.setCreditAmount(line.getCreditAmount());
            lineDto.setDescription(line.getDescription());
            dto.addLine(lineDto);
        });

        return ResponseEntity.ok(dto);
    }

    @PostMapping("/post/{id}")
    public ResponseEntity<Void> postEntry(@PathVariable Long id) {
        journalService.postEntry(id);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/void/{id}")
    public ResponseEntity<Void> voidEntry(@PathVariable Long id) {
        journalService.voidEntry(id);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/delete/{id}")
    public ResponseEntity<Void> deleteEntry(@PathVariable Long id) {
        journalService.deleteEntry(id);
        return ResponseEntity.ok().build();
    }
}