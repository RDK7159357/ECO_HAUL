package com.ecohaul.backend.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDateTime;

@Entity
@Table(name = "user_feedback")
public class UserFeedback {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @NotNull(message = "User ID is required")
    @Column(name = "user_id")
    private Long userId;
    
    @NotBlank(message = "Feedback type is required")
    @Column(name = "type")
    private String type; // general, bug_report, feature_request, service_rating, complaint, suggestion
    
    @NotBlank(message = "Title is required")
    @Column(name = "title")
    private String title;
    
    @NotBlank(message = "Message is required")
    @Column(name = "message", columnDefinition = "TEXT")
    private String message;
    
    @Column(name = "rating")
    private Integer rating; // 1-5 stars (optional, for service ratings)
    
    @Column(name = "status")
    private String status = "submitted"; // submitted, in_review, in_progress, resolved, closed
    
    @Column(name = "priority")
    private String priority = "medium"; // low, medium, high, urgent
    
    @Column(name = "category")
    private String category; // app, service, pickup, disposal, etc.
    
    @Column(name = "admin_response", columnDefinition = "TEXT")
    private String adminResponse;
    
    @Column(name = "admin_responder_id")
    private Long adminResponderId;
    
    @Column(name = "ticket_number")
    private String ticketNumber;
    
    @Column(name = "attachment_urls", columnDefinition = "TEXT")
    private String attachmentUrls; // JSON array of file URLs
    
    @Column(name = "is_anonymous")
    private Boolean isAnonymous = false;
    
    @Column(name = "submitted_at")
    private LocalDateTime submittedAt;
    
    @Column(name = "responded_at")
    private LocalDateTime respondedAt;
    
    @Column(name = "resolved_at")
    private LocalDateTime resolvedAt;
    
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    // Constructors
    public UserFeedback() {}
    
    public UserFeedback(Long userId, String type, String title, String message) {
        this.userId = userId;
        this.type = type;
        this.title = title;
        this.message = message;
        this.submittedAt = LocalDateTime.now();
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }
    
    // Lifecycle callbacks
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
        if (submittedAt == null) {
            submittedAt = LocalDateTime.now();
        }
        if (ticketNumber == null) {
            ticketNumber = "ECO-" + System.currentTimeMillis() % 100000;
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
    
    public String getType() { return type; }
    public void setType(String type) { this.type = type; }
    
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    
    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }
    
    public Integer getRating() { return rating; }
    public void setRating(Integer rating) { this.rating = rating; }
    
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    
    public String getPriority() { return priority; }
    public void setPriority(String priority) { this.priority = priority; }
    
    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }
    
    public String getAdminResponse() { return adminResponse; }
    public void setAdminResponse(String adminResponse) { this.adminResponse = adminResponse; }
    
    public Long getAdminResponderId() { return adminResponderId; }
    public void setAdminResponderId(Long adminResponderId) { this.adminResponderId = adminResponderId; }
    
    public String getTicketNumber() { return ticketNumber; }
    public void setTicketNumber(String ticketNumber) { this.ticketNumber = ticketNumber; }
    
    public String getAttachmentUrls() { return attachmentUrls; }
    public void setAttachmentUrls(String attachmentUrls) { this.attachmentUrls = attachmentUrls; }
    
    public Boolean getIsAnonymous() { return isAnonymous; }
    public void setIsAnonymous(Boolean isAnonymous) { this.isAnonymous = isAnonymous; }
    
    public LocalDateTime getSubmittedAt() { return submittedAt; }
    public void setSubmittedAt(LocalDateTime submittedAt) { this.submittedAt = submittedAt; }
    
    public LocalDateTime getRespondedAt() { return respondedAt; }
    public void setRespondedAt(LocalDateTime respondedAt) { this.respondedAt = respondedAt; }
    
    public LocalDateTime getResolvedAt() { return resolvedAt; }
    public void setResolvedAt(LocalDateTime resolvedAt) { this.resolvedAt = resolvedAt; }
    
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
