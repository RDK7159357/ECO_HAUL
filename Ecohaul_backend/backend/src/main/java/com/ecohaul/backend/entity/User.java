package com.ecohaul.backend.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Email;
import java.time.LocalDateTime;

@Entity
@Table(name = "users")
public class User {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @NotBlank(message = "Email is required")
    @Email(message = "Email should be valid")
    @Column(name = "email", unique = true)
    private String email;
    
    @NotBlank(message = "Password is required")
    @Column(name = "password")
    private String password;
    
    @NotBlank(message = "Full name is required")
    @Column(name = "full_name")
    private String fullName;
    
    @Column(name = "phone_number")
    private String phoneNumber;
    
    @Column(name = "address", columnDefinition = "TEXT")
    private String address;
    
    @Column(name = "role")
    private String role = "USER";
    
    @Column(name = "is_active")
    private Boolean isActive = true;
    
    @Column(name = "eco_points")
    private Integer ecoPoints = 0;
    
    @Column(name = "total_scans")
    private Integer totalScans = 0;
    
    @Column(name = "total_pickups")
    private Integer totalPickups = 0;
    
    @Column(name = "profile_image_url")
    private String profileImageUrl;
    
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    @Column(name = "last_login_at")
    private LocalDateTime lastLoginAt;
    
    // Constructors
    public User() {}
    
    public User(String email, String password, String fullName) {
        this.email = email;
        this.password = password;
        this.fullName = fullName;
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }
    
    // Lifecycle callbacks
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }
    
    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
    
    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    
    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
    
    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }
    
    public String getPhoneNumber() { return phoneNumber; }
    public void setPhoneNumber(String phoneNumber) { this.phoneNumber = phoneNumber; }
    
    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }
    
    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }
    
    public Boolean getIsActive() { return isActive; }
    public void setIsActive(Boolean isActive) { this.isActive = isActive; }
    
    public Integer getEcoPoints() { return ecoPoints; }
    public void setEcoPoints(Integer ecoPoints) { this.ecoPoints = ecoPoints; }
    
    public Integer getTotalScans() { return totalScans; }
    public void setTotalScans(Integer totalScans) { this.totalScans = totalScans; }
    
    public Integer getTotalPickups() { return totalPickups; }
    public void setTotalPickups(Integer totalPickups) { this.totalPickups = totalPickups; }
    
    public String getProfileImageUrl() { return profileImageUrl; }
    public void setProfileImageUrl(String profileImageUrl) { this.profileImageUrl = profileImageUrl; }
    
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
    
    public LocalDateTime getLastLoginAt() { return lastLoginAt; }
    public void setLastLoginAt(LocalDateTime lastLoginAt) { this.lastLoginAt = lastLoginAt; }
}
