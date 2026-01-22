package com.accounting.steps;

import com.accounting.model.Account;
import com.accounting.model.AccountType;
import com.accounting.service.AccountService;
import io.cucumber.java.en.Given;
import io.cucumber.java.en.Then;
import io.cucumber.java.en.When;
import io.cucumber.spring.CucumberContextConfiguration;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import static org.junit.jupiter.api.Assertions.*;

@CucumberContextConfiguration
@SpringBootTest
public class AccountSteps {

    @Autowired
    private AccountService accountService;

    private Account account;

    @Given("I have a new account with code {string} and name {string}")
    public void i_have_a_new_account_with_code_and_name(String code, String name) {
        // Clean up before test
        accountService.findAll().stream()
            .filter(a -> a.getCode().equals(code))
            .findFirst()
            .ifPresent(a -> {
                // In a real scenario, we might delete it, but here we just ensure it doesn't conflict
                // Or we pick a different code for testing.
                // However, since we can't easily delete due to constraints, let's just create a new object.
            });

        account = new Account();
        account.setCode(code);
        account.setName(name);
        account.setAccountType(AccountType.ASSET);
        account.setIsActive(true);
    }

    @When("I save the account")
    public void i_save_the_account() {
        accountService.save(account);
    }

    @Then("the account should be saved successfully")
    public void the_account_should_be_saved_successfully() {
        assertNotNull(account.getId());
    }

    @Then("the account list should contain {string}")
    public void the_account_list_should_contain(String code) {
        boolean exists = accountService.findAll().stream()
                .anyMatch(a -> a.getCode().equals(code));
        assertTrue(exists);
    }
}
