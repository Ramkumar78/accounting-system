Feature: Account Management
  As an admin
  I want to manage accounts
  So that I can maintain the chart of accounts

  Scenario: Create a new account
    Given I have a new account with code "9999" and name "Test Cash"
    When I save the account
    Then the account should be saved successfully
    And the account list should contain "9999"
