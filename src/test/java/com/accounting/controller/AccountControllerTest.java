package com.accounting.controller;

import com.accounting.model.Account;
import com.accounting.model.AccountType;
import com.accounting.service.AccountService;
import com.accounting.service.CurrencyService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import java.math.BigDecimal;
import java.util.Arrays;
import java.util.Collections;
import java.util.Optional;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(AccountController.class)
@AutoConfigureMockMvc(addFilters = false) // Bypass security filters for unit testing logic mostly, or use WithMockUser properly with config
public class AccountControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private AccountService accountService;

    @MockBean
    private CurrencyService currencyService;

    private Account testAccount;

    @BeforeEach
    void setUp() {
        testAccount = new Account();
        testAccount.setId(1L);
        testAccount.setCode("1001");
        testAccount.setName("Cash");
        testAccount.setAccountType(AccountType.ASSET);
        testAccount.setIsActive(true);
        testAccount.setDescription("Cash on hand");
    }

    @Test
    @WithMockUser
    void testListAccounts() throws Exception {
        Mockito.when(accountService.findAllActive()).thenReturn(Arrays.asList(testAccount));
        Mockito.when(accountService.getBalance(1L)).thenReturn(BigDecimal.TEN);

        mockMvc.perform(get("/accounts")
                .accept(MediaType.APPLICATION_JSON)
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].code").value("1001"))
                .andExpect(jsonPath("$[0].name").value("Cash"))
                .andExpect(jsonPath("$[0].balance").value(10));
    }

    @Test
    @WithMockUser
    void testGetAccount() throws Exception {
        Mockito.when(accountService.findById(1L)).thenReturn(Optional.of(testAccount));

        mockMvc.perform(get("/accounts/1")
                .accept(MediaType.APPLICATION_JSON)
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value("1001"));
    }

    @Test
    @WithMockUser
    void testGetAccountNotFound() throws Exception {
        Mockito.when(accountService.findById(99L)).thenReturn(Optional.empty());

        mockMvc.perform(get("/accounts/99")
                .accept(MediaType.APPLICATION_JSON)
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isBadRequest()) // GlobalExceptionHandler maps IllegalArgumentException to BadRequest
                .andExpect(jsonPath("$.error").value("Invalid Input"));
                // Note: Optional.orElseThrow throws IllegalArgumentException in Controller
    }

    @Test
    @WithMockUser
    void testSaveAccount() throws Exception {
        Mockito.when(accountService.save(any(Account.class))).thenReturn(testAccount);

        String accountJson = "{\"code\":\"1001\",\"name\":\"Cash\",\"accountType\":\"ASSET\"}";

        mockMvc.perform(post("/accounts/save")
                .with(csrf())
                .contentType(MediaType.APPLICATION_JSON)
                .content(accountJson))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1));
    }

    @Test
    @WithMockUser
    void testDeactivateAccount() throws Exception {
        Mockito.doNothing().when(accountService).deactivate(1L);

        mockMvc.perform(post("/accounts/deactivate/1")
                .with(csrf())
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk());
    }

    @Test
    @WithMockUser
    void testActivateAccount() throws Exception {
        Mockito.doNothing().when(accountService).activate(1L);

        mockMvc.perform(post("/accounts/activate/1")
                .with(csrf())
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk());
    }
}
