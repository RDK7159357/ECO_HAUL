package com.ecohaul.backend.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.*;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@RestController
@RequestMapping("/api/v1/feedback")
@CrossOrigin(origins = "*")
public class FeedbackController {
    
    @PostMapping("/submit")
    public ResponseEntity<?> submitFeedback(@RequestBody Map<String, Object> feedbackRequest) {
        try {
            Long userId = Long.valueOf(feedbackRequest.get("userId").toString());
            String type = (String) feedbackRequest.get("type");
            String title = (String) feedbackRequest.get("title");
            String message = (String) feedbackRequest.get("message");
            Integer rating = feedbackRequest.get("rating") != null ? 
                Integer.valueOf(feedbackRequest.get("rating").toString()) : null;
            
            if (userId == null || type == null || title == null || message == null) {
                Map<String, String> error = new HashMap<>();
                error.put("message", "User ID, type, title, and message are required");
                return ResponseEntity.badRequest().body(error);
            }
            
            // Validate feedback type
            List<String> validTypes = Arrays.asList("general", "bug_report", "feature_request", "service_rating", "complaint", "suggestion");
            if (!validTypes.contains(type.toLowerCase())) {
                Map<String, String> error = new HashMap<>();
                error.put("message", "Invalid feedback type. Valid types: " + String.join(", ", validTypes));
                return ResponseEntity.badRequest().body(error);
            }
            
            // Mock feedback submission
            Map<String, Object> feedback = new HashMap<>();
            feedback.put("feedbackId", UUID.randomUUID().toString());
            feedback.put("userId", userId);
            feedback.put("type", type);
            feedback.put("title", title);
            feedback.put("message", message);
            feedback.put("rating", rating);
            feedback.put("status", "submitted");
            feedback.put("priority", determinePriority(type, message));
            feedback.put("submittedAt", LocalDateTime.now().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME));
            feedback.put("expectedResponseTime", calculateExpectedResponse(type));
            
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Feedback submitted successfully");
            response.put("feedback", feedback);
            response.put("ticketNumber", generateTicketNumber());
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", "Error submitting feedback: " + e.getMessage());
            return ResponseEntity.internalServerError().body(error);
        }
    }
    
    @GetMapping("/user/{userId}")
    public ResponseEntity<?> getUserFeedback(@PathVariable Long userId, 
                                           @RequestParam(required = false) String status) {
        try {
            // Mock user feedback history
            List<Map<String, Object>> feedbackList = generateMockUserFeedback(userId, status);
            
            Map<String, Object> response = new HashMap<>();
            response.put("feedback", feedbackList);
            response.put("totalFeedback", feedbackList.size());
            response.put("filterStatus", status);
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", "Error fetching user feedback: " + e.getMessage());
            return ResponseEntity.internalServerError().body(error);
        }
    }
    
    @GetMapping("/{feedbackId}")
    public ResponseEntity<?> getFeedbackDetails(@PathVariable String feedbackId) {
        try {
            // Mock feedback details
            Map<String, Object> feedback = generateDetailedFeedback(feedbackId);
            
            return ResponseEntity.ok(feedback);
            
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", "Error fetching feedback details: " + e.getMessage());
            return ResponseEntity.internalServerError().body(error);
        }
    }
    
    @PostMapping("/{feedbackId}/update-status")
    public ResponseEntity<?> updateFeedbackStatus(@PathVariable String feedbackId, 
                                                 @RequestBody Map<String, Object> statusUpdate) {
        try {
            String newStatus = (String) statusUpdate.get("status");
            String adminNote = (String) statusUpdate.get("adminNote");
            
            if (newStatus == null) {
                Map<String, String> error = new HashMap<>();
                error.put("message", "Status is required");
                return ResponseEntity.badRequest().body(error);
            }
            
            // Validate status
            List<String> validStatuses = Arrays.asList("submitted", "in_review", "in_progress", "resolved", "closed");
            if (!validStatuses.contains(newStatus.toLowerCase())) {
                Map<String, String> error = new HashMap<>();
                error.put("message", "Invalid status. Valid statuses: " + String.join(", ", validStatuses));
                return ResponseEntity.badRequest().body(error);
            }
            
            // Mock status update
            Map<String, Object> updatedFeedback = new HashMap<>();
            updatedFeedback.put("feedbackId", feedbackId);
            updatedFeedback.put("previousStatus", "in_review");
            updatedFeedback.put("newStatus", newStatus);
            updatedFeedback.put("adminNote", adminNote);
            updatedFeedback.put("updatedAt", LocalDateTime.now().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME));
            updatedFeedback.put("updatedBy", "admin"); // In real app, get from authentication
            
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Feedback status updated successfully");
            response.put("updatedFeedback", updatedFeedback);
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", "Error updating feedback status: " + e.getMessage());
            return ResponseEntity.internalServerError().body(error);
        }
    }
    
    @PostMapping("/{feedbackId}/respond")
    public ResponseEntity<?> respondToFeedback(@PathVariable String feedbackId, 
                                             @RequestBody Map<String, Object> responseRequest) {
        try {
            String responseMessage = (String) responseRequest.get("message");
            String responderId = (String) responseRequest.get("responderId");
            
            if (responseMessage == null || responseMessage.trim().isEmpty()) {
                Map<String, String> error = new HashMap<>();
                error.put("message", "Response message is required");
                return ResponseEntity.badRequest().body(error);
            }
            
            // Mock admin response
            Map<String, Object> adminResponse = new HashMap<>();
            adminResponse.put("responseId", UUID.randomUUID().toString());
            adminResponse.put("feedbackId", feedbackId);
            adminResponse.put("message", responseMessage);
            adminResponse.put("responderId", responderId);
            adminResponse.put("responderName", "Admin Support");
            adminResponse.put("respondedAt", LocalDateTime.now().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME));
            adminResponse.put("type", "admin_response");
            
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Response sent successfully");
            response.put("adminResponse", adminResponse);
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", "Error sending response: " + e.getMessage());
            return ResponseEntity.internalServerError().body(error);
        }
    }
    
    @GetMapping("/analytics/summary")
    public ResponseEntity<?> getFeedbackAnalytics() {
        try {
            // Mock analytics data
            Map<String, Object> analytics = generateFeedbackAnalytics();
            
            return ResponseEntity.ok(analytics);
            
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", "Error fetching feedback analytics: " + e.getMessage());
            return ResponseEntity.internalServerError().body(error);
        }
    }
    
    @GetMapping("/types")
    public ResponseEntity<?> getFeedbackTypes() {
        try {
            List<Map<String, Object>> feedbackTypes = generateFeedbackTypes();
            
            Map<String, Object> response = new HashMap<>();
            response.put("feedbackTypes", feedbackTypes);
            response.put("totalTypes", feedbackTypes.size());
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", "Error fetching feedback types: " + e.getMessage());
            return ResponseEntity.internalServerError().body(error);
        }
    }
    
    @PostMapping("/rate-service")
    public ResponseEntity<?> rateService(@RequestBody Map<String, Object> ratingRequest) {
        try {
            Long userId = Long.valueOf(ratingRequest.get("userId").toString());
            String serviceType = (String) ratingRequest.get("serviceType");
            Integer rating = Integer.valueOf(ratingRequest.get("rating").toString());
            String comment = (String) ratingRequest.get("comment");
            
            if (userId == null || serviceType == null || rating == null || rating < 1 || rating > 5) {
                Map<String, String> error = new HashMap<>();
                error.put("message", "Valid user ID, service type, and rating (1-5) are required");
                return ResponseEntity.badRequest().body(error);
            }
            
            // Mock service rating
            Map<String, Object> serviceRating = new HashMap<>();
            serviceRating.put("ratingId", UUID.randomUUID().toString());
            serviceRating.put("userId", userId);
            serviceRating.put("serviceType", serviceType);
            serviceRating.put("rating", rating);
            serviceRating.put("comment", comment);
            serviceRating.put("submittedAt", LocalDateTime.now().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME));
            
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Service rating submitted successfully");
            response.put("serviceRating", serviceRating);
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", "Error submitting service rating: " + e.getMessage());
            return ResponseEntity.internalServerError().body(error);
        }
    }
    
    // Helper methods
    private List<Map<String, Object>> generateMockUserFeedback(Long userId, String statusFilter) {
        List<Map<String, Object>> feedbackList = new ArrayList<>();
        String[] types = {"general", "bug_report", "feature_request", "service_rating", "complaint"};
        String[] statuses = {"submitted", "in_review", "in_progress", "resolved", "closed"};
        String[] titles = {"App Performance Issue", "Great Service!", "Suggestion for Improvement", 
                          "Pickup was Late", "Feature Request: Dark Mode"};
        
        for (int i = 0; i < 5; i++) {
            String status = statuses[i % statuses.length];
            if (statusFilter != null && !status.equals(statusFilter)) continue;
            
            Map<String, Object> feedback = new HashMap<>();
            feedback.put("feedbackId", UUID.randomUUID().toString());
            feedback.put("userId", userId);
            feedback.put("type", types[i % types.length]);
            feedback.put("title", titles[i]);
            feedback.put("status", status);
            feedback.put("priority", determinePriority(types[i % types.length], titles[i]));
            feedback.put("submittedAt", LocalDateTime.now().minusDays(i).format(DateTimeFormatter.ISO_LOCAL_DATE_TIME));
            feedback.put("hasResponse", i % 2 == 0);
            
            feedbackList.add(feedback);
        }
        
        return feedbackList;
    }
    
    private Map<String, Object> generateDetailedFeedback(String feedbackId) {
        Map<String, Object> feedback = new HashMap<>();
        feedback.put("feedbackId", feedbackId);
        feedback.put("userId", 1L);
        feedback.put("type", "bug_report");
        feedback.put("title", "App Performance Issue");
        feedback.put("message", "The app becomes slow when scanning large items. Sometimes it crashes.");
        feedback.put("rating", 3);
        feedback.put("status", "in_progress");
        feedback.put("priority", "high");
        feedback.put("submittedAt", LocalDateTime.now().minusDays(2).format(DateTimeFormatter.ISO_LOCAL_DATE_TIME));
        feedback.put("lastUpdatedAt", LocalDateTime.now().minusHours(6).format(DateTimeFormatter.ISO_LOCAL_DATE_TIME));
        feedback.put("expectedResponseTime", "24-48 hours");
        feedback.put("ticketNumber", generateTicketNumber());
        
        // Mock responses
        List<Map<String, Object>> responses = new ArrayList<>();
        Map<String, Object> response1 = new HashMap<>();
        response1.put("responseId", UUID.randomUUID().toString());
        response1.put("message", "Thank you for reporting this issue. We are investigating the performance problems.");
        response1.put("responderName", "Technical Support");
        response1.put("respondedAt", LocalDateTime.now().minusHours(6).format(DateTimeFormatter.ISO_LOCAL_DATE_TIME));
        responses.add(response1);
        
        feedback.put("responses", responses);
        feedback.put("attachments", Arrays.asList("screenshot1.png", "crash_log.txt"));
        
        return feedback;
    }
    
    private Map<String, Object> generateFeedbackAnalytics() {
        Map<String, Object> analytics = new HashMap<>();
        
        // Overall stats
        analytics.put("totalFeedback", 1247);
        analytics.put("pendingFeedback", 23);
        analytics.put("resolvedFeedback", 1180);
        analytics.put("averageRating", 4.2);
        analytics.put("averageResponseTime", "18 hours");
        
        // Feedback by type
        Map<String, Integer> byType = new HashMap<>();
        byType.put("general", 425);
        byType.put("bug_report", 180);
        byType.put("feature_request", 245);
        byType.put("service_rating", 320);
        byType.put("complaint", 77);
        analytics.put("feedbackByType", byType);
        
        // Feedback by status
        Map<String, Integer> byStatus = new HashMap<>();
        byStatus.put("submitted", 15);
        byStatus.put("in_review", 8);
        byStatus.put("in_progress", 12);
        byStatus.put("resolved", 1180);
        byStatus.put("closed", 32);
        analytics.put("feedbackByStatus", byStatus);
        
        // Monthly trends
        List<Map<String, Object>> monthlyTrends = new ArrayList<>();
        String[] months = {"Jan", "Feb", "Mar", "Apr", "May", "Jun"};
        for (int i = 0; i < months.length; i++) {
            Map<String, Object> monthData = new HashMap<>();
            monthData.put("month", months[i]);
            monthData.put("totalFeedback", 150 + (int)(Math.random() * 100));
            monthData.put("averageRating", 4.0 + Math.random());
            monthlyTrends.add(monthData);
        }
        analytics.put("monthlyTrends", monthlyTrends);
        
        return analytics;
    }
    
    private List<Map<String, Object>> generateFeedbackTypes() {
        List<Map<String, Object>> types = new ArrayList<>();
        
        Map<String, Object> general = new HashMap<>();
        general.put("type", "general");
        general.put("label", "General Feedback");
        general.put("description", "General comments and suggestions about the app");
        general.put("requiresRating", false);
        types.add(general);
        
        Map<String, Object> bugReport = new HashMap<>();
        bugReport.put("type", "bug_report");
        bugReport.put("label", "Bug Report");
        bugReport.put("description", "Report technical issues or bugs in the app");
        bugReport.put("requiresRating", false);
        types.add(bugReport);
        
        Map<String, Object> featureRequest = new HashMap<>();
        featureRequest.put("type", "feature_request");
        featureRequest.put("label", "Feature Request");
        featureRequest.put("description", "Suggest new features or improvements");
        featureRequest.put("requiresRating", false);
        types.add(featureRequest);
        
        Map<String, Object> serviceRating = new HashMap<>();
        serviceRating.put("type", "service_rating");
        serviceRating.put("label", "Service Rating");
        serviceRating.put("description", "Rate our pickup and disposal services");
        serviceRating.put("requiresRating", true);
        types.add(serviceRating);
        
        Map<String, Object> complaint = new HashMap<>();
        complaint.put("type", "complaint");
        complaint.put("label", "Complaint");
        complaint.put("description", "Report problems with service or app experience");
        complaint.put("requiresRating", false);
        types.add(complaint);
        
        Map<String, Object> suggestion = new HashMap<>();
        suggestion.put("type", "suggestion");
        suggestion.put("label", "Suggestion");
        suggestion.put("description", "Share ideas for improving our services");
        suggestion.put("requiresRating", false);
        types.add(suggestion);
        
        return types;
    }
    
    private String determinePriority(String type, String message) {
        if (type.equals("complaint") || message.toLowerCase().contains("urgent") || message.toLowerCase().contains("critical")) {
            return "high";
        } else if (type.equals("bug_report") || type.equals("service_rating")) {
            return "medium";
        } else {
            return "low";
        }
    }
    
    private String calculateExpectedResponse(String type) {
        switch (type.toLowerCase()) {
            case "complaint":
                return "12-24 hours";
            case "bug_report":
                return "24-48 hours";
            case "service_rating":
                return "48-72 hours";
            default:
                return "3-5 business days";
        }
    }
    
    private String generateTicketNumber() {
        return "ECO-" + System.currentTimeMillis() % 100000;
    }
}
