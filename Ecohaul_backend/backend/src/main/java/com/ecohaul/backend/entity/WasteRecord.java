package com.ecohaul.backend.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDateTime;

@Entity
@Table(name = "waste_records")
public class WasteRecord {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @NotNull(message = "User ID is required")
    @Column(name = "user_id")
    private Long userId;
    
    @NotBlank(message = "Waste type is required")
    @Column(name = "waste_type")
    private String wasteType;
    
    @Column(name = "category")
    private String category;
    
    @Column(name = "weight")
    private Double weight; // in grams
    
    @Column(name = "estimated_value")
    private Double estimatedValue;
    
    @Column(name = "confidence_score")
    private Double confidenceScore;
    
    @Column(name = "scan_image_url")
    private String scanImageUrl;
    
    @Column(name = "is_recyclable")
    private Boolean isRecyclable = false;
    
    @Column(name = "disposal_instructions", columnDefinition = "TEXT")
    private String disposalInstructions;
    
    @Column(name = "disposal_status")
    private String disposalStatus = "PENDING"; // PENDING, IN_CART, DISPOSED
    
    @Column(name = "disposal_center_id")
    private Long disposalCenterId;
    
    @Column(name = "pickup_agent_id")
    private Long pickupAgentId;
    
    @Column(name = "scanned_at")
    private LocalDateTime scannedAt;
    
    @Column(name = "disposed_at")
    private LocalDateTime disposedAt;
    
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    // Constructors
    public WasteRecord() {}
    
    public WasteRecord(Long userId, String wasteType, String category, Double weight) {
        this.userId = userId;
        this.wasteType = wasteType;
        this.category = category;
        this.weight = weight;
        this.scannedAt = LocalDateTime.now();
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }
    
    // Lifecycle callbacks
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
        if (scannedAt == null) {
            scannedAt = LocalDateTime.now();
        }
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
    
    public String getWasteType() { return wasteType; }
    public void setWasteType(String wasteType) { this.wasteType = wasteType; }
    
    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }
    
    public Double getWeight() { return weight; }
    public void setWeight(Double weight) { this.weight = weight; }
    
    public Double getEstimatedValue() { return estimatedValue; }
    public void setEstimatedValue(Double estimatedValue) { this.estimatedValue = estimatedValue; }
    
    public Double getConfidenceScore() { return confidenceScore; }
    public void setConfidenceScore(Double confidenceScore) { this.confidenceScore = confidenceScore; }
    
    public String getScanImageUrl() { return scanImageUrl; }
    public void setScanImageUrl(String scanImageUrl) { this.scanImageUrl = scanImageUrl; }
    
    public Boolean getIsRecyclable() { return isRecyclable; }
    public void setIsRecyclable(Boolean isRecyclable) { this.isRecyclable = isRecyclable; }
    
    public String getDisposalInstructions() { return disposalInstructions; }
    public void setDisposalInstructions(String disposalInstructions) { this.disposalInstructions = disposalInstructions; }
    
    public String getDisposalStatus() { return disposalStatus; }
    public void setDisposalStatus(String disposalStatus) { this.disposalStatus = disposalStatus; }
    
    public Long getDisposalCenterId() { return disposalCenterId; }
    public void setDisposalCenterId(Long disposalCenterId) { this.disposalCenterId = disposalCenterId; }
    
    public Long getPickupAgentId() { return pickupAgentId; }
    public void setPickupAgentId(Long pickupAgentId) { this.pickupAgentId = pickupAgentId; }
    
    public LocalDateTime getScannedAt() { return scannedAt; }
    public void setScannedAt(LocalDateTime scannedAt) { this.scannedAt = scannedAt; }
    
    public LocalDateTime getDisposedAt() { return disposedAt; }
    public void setDisposedAt(LocalDateTime disposedAt) { this.disposedAt = disposedAt; }
    
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
