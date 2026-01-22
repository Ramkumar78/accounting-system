package com.accounting.dto;

import lombok.Data;

@Data
public class UserRegistrationDto {
    private String username;
    private String password;
    private String fullName;
    private String email;
}
