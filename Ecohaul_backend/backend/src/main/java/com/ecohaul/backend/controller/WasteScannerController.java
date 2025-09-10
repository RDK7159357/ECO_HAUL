package com.ecohaul.backend.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.*;

@RestController
@RequestMapping("/api/v1/waste-scanner")
@CrossOrigin(origins = "*")
public class WasteScannerController {
    
    @PostMapping("/scan")
    public ResponseEntity<?> scanWaste(@RequestBody Map<String, Object> scanRequest) {
        try {
            // Mock AI waste detection logic
            String imageBase64 = (String) scanRequest.get("imageBase64");
            
            if (imageBase64 == null || imageBase64.isEmpty()) {
                Map<String, String> error = new HashMap<>();
                error.put("message", "Image data is required");
                return ResponseEntity.badRequest().body(error);
            }
            
            // Simulate AI detection results
            Map<String, Object> scanResult = new HashMap<>();
            scanResult.put("detectedWaste", generateMockDetection());
            scanResult.put("confidence", 0.85);
            scanResult.put("timestamp", new Date());
            scanResult.put("scanId", UUID.randomUUID().toString());
            
            return ResponseEntity.ok(scanResult);
            
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", "Error processing image: " + e.getMessage());
            return ResponseEntity.internalServerError().body(error);
        }
    }
    
    @PostMapping("/identify")
    public ResponseEntity<?> identifyWasteType(@RequestBody Map<String, Object> identifyRequest) {
        try {
            String wasteDescription = (String) identifyRequest.get("description");
            
            if (wasteDescription == null || wasteDescription.trim().isEmpty()) {
                Map<String, String> error = new HashMap<>();
                error.put("message", "Waste description is required");
                return ResponseEntity.badRequest().body(error);
            }
            
            // Mock waste type identification
            Map<String, Object> identification = new HashMap<>();
            identification.put("wasteType", identifyWasteTypeFromDescription(wasteDescription));
            identification.put("category", getCategoryFromDescription(wasteDescription));
            identification.put("recyclable", isRecyclableFromDescription(wasteDescription));
            identification.put("confidence", 0.78);
            identification.put("suggestions", generateDisposalSuggestions(wasteDescription));
            
            return ResponseEntity.ok(identification);
            
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", "Error identifying waste: " + e.getMessage());
            return ResponseEntity.internalServerError().body(error);
        }
    }
    
    @GetMapping("/history/{userId}")
    public ResponseEntity<?> getScanHistory(@PathVariable Long userId) {
        try {
            // Mock scan history
            List<Map<String, Object>> scanHistory = new ArrayList<>();
            
            for (int i = 0; i < 5; i++) {
                Map<String, Object> scan = new HashMap<>();
                scan.put("scanId", UUID.randomUUID().toString());
                scan.put("wasteType", "Plastic Bottle");
                scan.put("category", "Recyclable");
                scan.put("confidence", 0.90 - (i * 0.05));
                scan.put("timestamp", new Date(System.currentTimeMillis() - (i * 86400000))); // Days ago
                scan.put("disposalStatus", i < 2 ? "Disposed" : "Pending");
                scanHistory.add(scan);
            }
            
            Map<String, Object> response = new HashMap<>();
            response.put("scanHistory", scanHistory);
            response.put("totalScans", scanHistory.size());
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", "Error fetching scan history: " + e.getMessage());
            return ResponseEntity.internalServerError().body(error);
        }
    }
    
    @GetMapping("/waste-types")
    public ResponseEntity<?> getSupportedWasteTypes() {
        try {
            List<Map<String, Object>> wasteTypes = new ArrayList<>();
            
            // Common waste types supported by the scanner
            String[] types = {"Plastic Bottle", "Glass Bottle", "Aluminum Can", "Paper", "Cardboard", 
                             "Electronic Device", "Battery", "Organic Waste", "Textile", "Metal Scrap"};
            String[] categories = {"Recyclable", "Recyclable", "Recyclable", "Recyclable", "Recyclable",
                                  "E-Waste", "Hazardous", "Compostable", "Textile", "Recyclable"};
            
            for (int i = 0; i < types.length; i++) {
                Map<String, Object> wasteType = new HashMap<>();
                wasteType.put("type", types[i]);
                wasteType.put("category", categories[i]);
                wasteType.put("description", "AI can detect " + types[i].toLowerCase());
                wasteType.put("accuracy", 0.85 + (Math.random() * 0.1));
                wasteTypes.add(wasteType);
            }
            
            Map<String, Object> response = new HashMap<>();
            response.put("supportedWasteTypes", wasteTypes);
            response.put("totalTypes", wasteTypes.size());
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", "Error fetching waste types: " + e.getMessage());
            return ResponseEntity.internalServerError().body(error);
        }
    }
    
    // Helper methods for mock AI logic
    private Map<String, Object> generateMockDetection() {
        String[] wasteTypes = {"Plastic Bottle", "Glass Bottle", "Aluminum Can", "Paper", "Cardboard"};
        String[] categories = {"Recyclable", "Recyclable", "Recyclable", "Recyclable", "Recyclable"};
        
        int randomIndex = (int) (Math.random() * wasteTypes.length);
        
        Map<String, Object> detection = new HashMap<>();
        detection.put("type", wasteTypes[randomIndex]);
        detection.put("category", categories[randomIndex]);
        detection.put("recyclable", true);
        detection.put("estimatedWeight", Math.round((Math.random() * 500) + 50)); // 50-550 grams
        
        return detection;
    }
    
    private String identifyWasteTypeFromDescription(String description) {
        String desc = description.toLowerCase();
        if (desc.contains("bottle") && desc.contains("plastic")) return "Plastic Bottle";
        if (desc.contains("bottle") && desc.contains("glass")) return "Glass Bottle";
        if (desc.contains("can") && desc.contains("aluminum")) return "Aluminum Can";
        if (desc.contains("paper")) return "Paper";
        if (desc.contains("cardboard")) return "Cardboard";
        if (desc.contains("battery")) return "Battery";
        if (desc.contains("electronic") || desc.contains("device")) return "Electronic Device";
        return "Unknown Waste Type";
    }
    
    private String getCategoryFromDescription(String description) {
        String wasteType = identifyWasteTypeFromDescription(description);
        switch (wasteType) {
            case "Battery": return "Hazardous";
            case "Electronic Device": return "E-Waste";
            case "Unknown Waste Type": return "General";
            default: return "Recyclable";
        }
    }
    
    private boolean isRecyclableFromDescription(String description) {
        String category = getCategoryFromDescription(description);
        return category.equals("Recyclable");
    }
    
    private List<String> generateDisposalSuggestions(String description) {
        List<String> suggestions = new ArrayList<>();
        String wasteType = identifyWasteTypeFromDescription(description);
        
        switch (wasteType) {
            case "Plastic Bottle":
                suggestions.add("Clean the bottle before recycling");
                suggestions.add("Remove the cap if it's a different plastic type");
                suggestions.add("Take to nearest recycling center");
                break;
            case "Battery":
                suggestions.add("Do not throw in regular trash");
                suggestions.add("Take to specialized battery disposal center");
                suggestions.add("Many electronics stores accept batteries");
                break;
            case "Electronic Device":
                suggestions.add("Remove personal data before disposal");
                suggestions.add("Take to certified e-waste facility");
                suggestions.add("Check if manufacturer has take-back program");
                break;
            default:
                suggestions.add("Check local recycling guidelines");
                suggestions.add("Contact nearest disposal center");
                break;
        }
        
        return suggestions;
    }
}
