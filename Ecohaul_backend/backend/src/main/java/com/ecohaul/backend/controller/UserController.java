package com.ecohaul.backend.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.*;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@RestController
@RequestMapping("/api/v1/users")
@CrossOrigin(origins = "*")
public class UserController {
    
    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody Map<String, Object> userRequest) {
        try {
            String email = (String) userRequest.get("email");
            String password = (String) userRequest.get("password");
            String fullName = (String) userRequest.get("fullName");
            String phoneNumber = (String) userRequest.get("phoneNumber");
            
            // Basic validation
            if (email == null || password == null || fullName == null) {
                Map<String, String> error = new HashMap<>();
                error.put("message", "Email, password, and full name are required");
                return ResponseEntity.badRequest().body(error);
            }
            
            // Mock user registration
            Map<String, Object> user = new HashMap<>();
            user.put("userId", UUID.randomUUID().toString());
            user.put("email", email);
            user.put("fullName", fullName);
            user.put("phoneNumber", phoneNumber);
            user.put("createdAt", LocalDateTime.now().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME));
            user.put("isActive", true);
            user.put("role", "USER");
            
            // Mock JWT token
            String mockToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." + UUID.randomUUID().toString();
            
            Map<String, Object> response = new HashMap<>();
            response.put("message", "User registered successfully");
            response.put("user", user);
            response.put("token", mockToken);
            response.put("tokenType", "Bearer");
            response.put("expiresIn", 86400); // 24 hours in seconds
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", "Registration failed: " + e.getMessage());
            return ResponseEntity.internalServerError().body(error);
        }
    }
    
    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@RequestBody Map<String, Object> loginRequest) {
        try {
            String email = (String) loginRequest.get("email");
            String password = (String) loginRequest.get("password");
            
            if (email == null || password == null) {
                Map<String, String> error = new HashMap<>();
                error.put("message", "Email and password are required");
                return ResponseEntity.badRequest().body(error);
            }
            
            // Mock authentication (in real app, validate against database)
            if (email.equals("test@example.com") && password.equals("password123")) {
                Map<String, Object> user = new HashMap<>();
                user.put("userId", "user-123");
                user.put("email", email);
                user.put("fullName", "Test User");
                user.put("phoneNumber", "+1-555-0123");
                user.put("role", "USER");
                user.put("isActive", true);
                user.put("lastLoginAt", LocalDateTime.now().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME));
                
                String mockToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." + UUID.randomUUID().toString();
                
                Map<String, Object> response = new HashMap<>();
                response.put("message", "Login successful");
                response.put("user", user);
                response.put("token", mockToken);
                response.put("tokenType", "Bearer");
                response.put("expiresIn", 86400);
                
                return ResponseEntity.ok(response);
            } else {
                Map<String, String> error = new HashMap<>();
                error.put("message", "Invalid email or password");
                return ResponseEntity.status(401).body(error);
            }
            
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", "Login failed: " + e.getMessage());
            return ResponseEntity.internalServerError().body(error);
        }
    }
    
    @GetMapping("/profile/{userId}")
    public ResponseEntity<?> getUserProfile(@PathVariable String userId) {
        try {
            // Mock user profile
            Map<String, Object> profile = new HashMap<>();
            profile.put("userId", userId);
            profile.put("email", "test@example.com");
            profile.put("fullName", "Test User");
            profile.put("phoneNumber", "+1-555-0123");
            profile.put("address", "123 Main St, City, State 12345");
            profile.put("role", "USER");
            profile.put("isActive", true);
            profile.put("createdAt", "2024-01-15T10:30:00");
            profile.put("lastLoginAt", LocalDateTime.now().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME));
            profile.put("totalScans", 25);
            profile.put("totalPickups", 8);
            profile.put("ecoPoints", 150);
            
            return ResponseEntity.ok(profile);
            
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", "Error fetching profile: " + e.getMessage());
            return ResponseEntity.internalServerError().body(error);
        }
    }
    
    @PutMapping("/profile/{userId}")
    public ResponseEntity<?> updateUserProfile(@PathVariable String userId, @RequestBody Map<String, Object> updateRequest) {
        try {
            // Mock profile update
            Map<String, Object> updatedProfile = new HashMap<>();
            updatedProfile.put("userId", userId);
            updatedProfile.put("email", updateRequest.get("email"));
            updatedProfile.put("fullName", updateRequest.get("fullName"));
            updatedProfile.put("phoneNumber", updateRequest.get("phoneNumber"));
            updatedProfile.put("address", updateRequest.get("address"));
            updatedProfile.put("updatedAt", LocalDateTime.now().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME));
            
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Profile updated successfully");
            response.put("user", updatedProfile);
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", "Error updating profile: " + e.getMessage());
            return ResponseEntity.internalServerError().body(error);
        }
    }
    
    @PostMapping("/change-password")
    public ResponseEntity<?> changePassword(@RequestBody Map<String, Object> passwordRequest) {
        try {
            String userId = (String) passwordRequest.get("userId");
            String currentPassword = (String) passwordRequest.get("currentPassword");
            String newPassword = (String) passwordRequest.get("newPassword");
            
            if (userId == null || currentPassword == null || newPassword == null) {
                Map<String, String> error = new HashMap<>();
                error.put("message", "User ID, current password, and new password are required");
                return ResponseEntity.badRequest().body(error);
            }
            
            // Mock password validation (in real app, hash and validate)
            if (!currentPassword.equals("password123")) {
                Map<String, String> error = new HashMap<>();
                error.put("message", "Current password is incorrect");
                return ResponseEntity.status(401).body(error);
            }
            
            if (newPassword.length() < 6) {
                Map<String, String> error = new HashMap<>();
                error.put("message", "New password must be at least 6 characters long");
                return ResponseEntity.badRequest().body(error);
            }
            
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Password changed successfully");
            response.put("userId", userId);
            response.put("changedAt", LocalDateTime.now().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME));
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", "Error changing password: " + e.getMessage());
            return ResponseEntity.internalServerError().body(error);
        }
    }
    
    @PostMapping("/logout")
    public ResponseEntity<?> logoutUser(@RequestBody Map<String, Object> logoutRequest) {
        try {
            String userId = (String) logoutRequest.get("userId");
            String token = (String) logoutRequest.get("token");
            
            // Mock logout (in real app, invalidate token)
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Logout successful");
            response.put("userId", userId);
            response.put("loggedOutAt", LocalDateTime.now().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME));
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", "Error during logout: " + e.getMessage());
            return ResponseEntity.internalServerError().body(error);
        }
    }
    
    @GetMapping("/stats/{userId}")
    public ResponseEntity<?> getUserStats(@PathVariable String userId) {
        try {
            // Mock user statistics
            Map<String, Object> stats = new HashMap<>();
            stats.put("userId", userId);
            stats.put("totalScans", 25);
            stats.put("totalPickups", 8);
            stats.put("totalWasteDisposed", "45.5 kg");
            stats.put("ecoPoints", 150);
            stats.put("co2Saved", "12.3 kg");
            stats.put("recyclingRate", "78%");
            stats.put("memberSince", "2024-01-15");
            stats.put("currentStreak", 7); // Days of consecutive activity
            stats.put("achievements", Arrays.asList("First Scan", "Eco Warrior", "Weekly Streak"));
            
            // Monthly activity
            List<Map<String, Object>> monthlyActivity = new ArrayList<>();
            String[] months = {"Jan", "Feb", "Mar", "Apr", "May", "Jun"};
            for (int i = 0; i < months.length; i++) {
                Map<String, Object> monthData = new HashMap<>();
                monthData.put("month", months[i]);
                monthData.put("scans", 3 + (int)(Math.random() * 8));
                monthData.put("pickups", 1 + (int)(Math.random() * 3));
                monthlyActivity.add(monthData);
            }
            stats.put("monthlyActivity", monthlyActivity);
            
            return ResponseEntity.ok(stats);
            
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", "Error fetching user stats: " + e.getMessage());
            return ResponseEntity.internalServerError().body(error);
        }
    }
    
    @DeleteMapping("/{userId}")
    public ResponseEntity<?> deleteUser(@PathVariable String userId) {
        try {
            // Mock user deletion (in real app, soft delete or mark as inactive)
            Map<String, Object> response = new HashMap<>();
            response.put("message", "User account deleted successfully");
            response.put("userId", userId);
            response.put("deletedAt", LocalDateTime.now().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME));
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", "Error deleting user: " + e.getMessage());
            return ResponseEntity.internalServerError().body(error);
        }
    }
}
