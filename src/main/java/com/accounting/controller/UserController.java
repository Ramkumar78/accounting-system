package com.accounting.controller;

import com.accounting.model.User;
import com.accounting.service.UserService;
import lombok.RequiredArgsConstructor;
import com.accounting.model.Role;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping
    public ResponseEntity<List<User>> listUsers() {
        return ResponseEntity.ok(userService.findAll());
    }

    @GetMapping("/roles")
    public ResponseEntity<List<Role>> listRoles() {
        return ResponseEntity.ok(userService.findAllRoles());
    }

    @PostMapping("/save")
    public ResponseEntity<User> saveUser(@RequestBody User user,
                           @RequestParam String password,
                           @RequestParam String roleName) {
        return ResponseEntity.ok(userService.createUser(user, password, roleName));
    }

    @GetMapping("/{id}")
    public ResponseEntity<User> getUser(@PathVariable Long id) {
        User user = userService.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("User not found: " + id));
        return ResponseEntity.ok(user);
    }

    @PostMapping("/update/{id}")
    public ResponseEntity<User> updateUser(@PathVariable Long id,
                             @RequestBody User user) {
        return ResponseEntity.ok(userService.updateUser(id, user));
    }

    @PostMapping("/change-password/{id}")
    public ResponseEntity<Void> changePassword(@PathVariable Long id,
                                 @RequestParam String newPassword) {
        userService.changePassword(id, newPassword);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/change-role/{id}")
    public ResponseEntity<Void> changeRole(@PathVariable Long id,
                             @RequestParam String roleName) {
        userService.changeRole(id, roleName);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/disable/{id}")
    public ResponseEntity<Void> disableUser(@PathVariable Long id) {
        userService.disableUser(id);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/enable/{id}")
    public ResponseEntity<Void> enableUser(@PathVariable Long id) {
        userService.enableUser(id);
        return ResponseEntity.ok().build();
    }
}