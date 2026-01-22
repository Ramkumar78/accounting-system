package com.accounting.service;

import com.accounting.exception.AccountingException;
import com.accounting.model.Role;
import com.accounting.model.User;
import com.accounting.repository.RoleRepository;
import com.accounting.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private RoleRepository roleRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @InjectMocks
    private UserService userService;

    @Test
    void createUser_NewUser_Success() {
        User user = new User();
        user.setUsername("newuser");
        user.setEmail("new@example.com");

        when(userRepository.existsByUsername("newuser")).thenReturn(false);
        when(userRepository.existsByEmail("new@example.com")).thenReturn(false);
        when(roleRepository.findByName("ROLE_USER")).thenReturn(Optional.of(new Role("ROLE_USER")));
        when(passwordEncoder.encode("password")).thenReturn("encodedPassword");
        when(userRepository.save(any(User.class))).thenReturn(user);

        User created = userService.createUser(user, "password", "ROLE_USER");

        assertNotNull(created);
        verify(userRepository).save(user);
    }

    @Test
    void createUser_ExistingUsername_ThrowsException() {
        User user = new User();
        user.setUsername("existing");

        when(userRepository.existsByUsername("existing")).thenReturn(true);

        assertThrows(AccountingException.class, () -> userService.createUser(user, "pass", "ROLE_USER"));
    }
}
