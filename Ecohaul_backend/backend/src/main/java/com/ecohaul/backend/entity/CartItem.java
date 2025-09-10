package com.ecohaul.backend.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDateTime;

@Entity
@Table(name = "cart_items")
public class CartItem {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @NotNull(message = "User ID is required")
    @Column(name = "user_id")
    private Long userId;
    
    @Column(name = "waste_record_id")
    private Long wasteRecordId;
    
    @Column(name = "waste_type")
    private String wasteType;
    
    @Column(name = "category")
    private String category;
    
    @Column(name = "weight")
    private Double weight; // in grams
    
    @Column(name = "estimated_value")
    private Double estimatedValue;
    
    @Column(name = "quantity")
    private Integer quantity = 1;
    
    @Column(name = "pickup_preference")
    private String pickupPreference = "STANDARD"; // STANDARD, EXPRESS, SCHEDULED
    
    @Column(name = "special_instructions", columnDefinition = "TEXT")
    private String specialInstructions;
    
    @Column(name = "is_ready_for_pickup")
    private Boolean isReadyForPickup = true;
    
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    // Constructors
    public CartItem() {}
    
    public CartItem(Long userId, String wasteType, String category, Double weight, Double estimatedValue) {
        this.userId = userId;
        this.wasteType = wasteType;
        this.category = category;
        this.weight = weight;
        this.estimatedValue = estimatedValue;
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
    
    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }
    
    public Long getWasteRecordId() { return wasteRecordId; }
    public void setWasteRecordId(Long wasteRecordId) { this.wasteRecordId = wasteRecordId; }
    
    public String getWasteType() { return wasteType; }
    public void setWasteType(String wasteType) { this.wasteType = wasteType; }
    
    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }
    
    public Double getWeight() { return weight; }
    public void setWeight(Double weight) { this.weight = weight; }
    
    public Double getEstimatedValue() { return estimatedValue; }
    public void setEstimatedValue(Double estimatedValue) { this.estimatedValue = estimatedValue; }
    
    public Integer getQuantity() { return quantity; }
    public void setQuantity(Integer quantity) { this.quantity = quantity; }
    
    public String getPickupPreference() { return pickupPreference; }
    public void setPickupPreference(String pickupPreference) { this.pickupPreference = pickupPreference; }
    
    public String getSpecialInstructions() { return specialInstructions; }
    public void setSpecialInstructions(String specialInstructions) { this.specialInstructions = specialInstructions; }
    
    public Boolean getIsReadyForPickup() { return isReadyForPickup; }
    public void setIsReadyForPickup(Boolean isReadyForPickup) { this.isReadyForPickup = isReadyForPickup; }
    
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}

