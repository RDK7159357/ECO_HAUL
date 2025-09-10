package com.ecohaul.backend.controller;

import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import java.util.*;

/**
 * N8n Bridge Controller
 * Provides compatibility endpoints that match your n8n workflow expectations
 * This allows your frontend to work with either n8n or Spring Boot seamlessly
 */
@RestController
@RequestMapping("/webhook")
@CrossOrigin(origins = "*")
public class N8nBridgeController {

    /**
     * Bridge endpoint for disposal centers (matches n8n webhook format)
     * POST /webhook/disposal-centers
     */
    @PostMapping("/disposal-centers")
    public ResponseEntity<Map<String, Object>> findDisposalCenters(@RequestBody Map<String, Object> request) {
        try {
            // Extract request parameters
            Double latitude = getDoubleValue(request, "latitude");
            Double longitude = getDoubleValue(request, "longitude");
            String wasteType = (String) request.get("wasteType");
            Integer radius = getIntegerValue(request, "radius", 10);
            Integer maxResults = getIntegerValue(request, "maxResults", 5);

            // Mock disposal centers (replace with actual database query)
            List<Map<String, Object>> centers = Arrays.asList(
                createDisposalCenter("1", "EcoCenter Downtown", "123 Green St, City", 2.5, 
                    Arrays.asList("plastic", "metal", "glass"), "Mon-Fri 8AM-6PM", 4.5),
                createDisposalCenter("2", "Recycling Plus", "456 Earth Ave, City", 4.2,
                    Arrays.asList("electronic", "battery", "plastic"), "Daily 7AM-7PM", 4.2),
                createDisposalCenter("3", "Green Disposal Hub", "789 Eco Blvd, City", 6.8,
                    Arrays.asList("organic", "food", "yard"), "Mon-Sat 9AM-5PM", 4.0)
            );

            // Filter centers based on waste type
            List<Map<String, Object>> filteredCenters = new ArrayList<>();
            for (Map<String, Object> center : centers) {
                @SuppressWarnings("unchecked")
                List<String> acceptedWaste = (List<String>) center.get("acceptedWaste");
                if (acceptedWaste.contains(wasteType) || acceptedWaste.contains("all")) {
                    filteredCenters.add(center);
                }
            }

            // Create response matching n8n format
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("centers", filteredCenters);
            response.put("totalFound", filteredCenters.size());
            response.put("searchRadius", radius);
            response.put("timestamp", new Date().toString());

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("error", "Failed to find disposal centers: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }

    /**
     * Bridge endpoint for disposal guide (matches n8n webhook format)
     * POST /webhook/disposal-guide-enhanced
     */
    @PostMapping("/disposal-guide-enhanced")
    public ResponseEntity<Map<String, Object>> getDisposalGuide(@RequestBody Map<String, Object> request) {
        try {
            String wasteType = (String) request.get("wasteType");
            String itemDescription = (String) request.getOrDefault("itemDescription", "");
            String userLevel = (String) request.getOrDefault("experienceLevel", "beginner");

            // Create disposal guide (replace with actual logic)
            Map<String, Object> guide = createDisposalGuide(wasteType, userLevel);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("timestamp", new Date().toString());
            response.put("guidance_provided", guide);
            response.put("waste_type", wasteType);
            response.put("user_level", userLevel);

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("error", "Failed to generate disposal guide: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }

    /**
     * Bridge endpoint for impact tracking (matches n8n webhook format)
     * POST /webhook/track-impact
     */
    @PostMapping("/track-impact")
    public ResponseEntity<Map<String, Object>> trackImpact(@RequestBody Map<String, Object> request) {
        try {
            String userId = (String) request.get("userId");
            String wasteType = (String) request.get("wasteType");
            Integer itemCount = getIntegerValue(request, "itemCount", 1);
            String disposalMethod = (String) request.get("disposalMethod");

            // Calculate impact (replace with actual calculation logic)
            Map<String, Object> impact = calculateImpact(wasteType, itemCount, disposalMethod);
            List<Map<String, Object>> achievements = generateAchievements(wasteType, disposalMethod);
            List<Map<String, Object>> insights = generateInsights(wasteType, impact);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("timestamp", new Date().toString());
            response.put("impact_calculated", impact);
            response.put("achievements", achievements);
            response.put("insights", insights);
            response.put("motivational_message", "Great job! You're making a positive environmental impact! 🌱");

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("error", "Failed to track impact: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }

    // Helper methods
    private Map<String, Object> createDisposalCenter(String id, String name, String address, 
            double distance, List<String> acceptedWaste, String hours, double rating) {
        Map<String, Object> center = new HashMap<>();
        center.put("id", id);
        center.put("name", name);
        center.put("address", address);
        center.put("distance", distance);
        center.put("acceptedWaste", acceptedWaste);
        center.put("hours", hours);
        center.put("rating", rating);
        center.put("googleMapsUrl", "https://maps.google.com/search/" + address.replace(" ", "+"));
        return center;
    }

    private Map<String, Object> createDisposalGuide(String wasteType, String userLevel) {
        Map<String, Object> guide = new HashMap<>();
        
        // Preparation steps
        List<Map<String, Object>> steps = Arrays.asList(
            createStep(1, "Assess the item", "Check condition and disposal requirements", "2-3 minutes"),
            createStep(2, "Clean if necessary", "Remove contaminants and residue", "5-10 minutes"),
            createStep(3, "Sort properly", "Separate materials if needed", "2-5 minutes"),
            createStep(4, "Transport safely", "Take to appropriate facility", "15-30 minutes")
        );

        // Disposal methods
        List<Map<String, Object>> methods = Arrays.asList(
            createMethod("Recycling", "Best for most materials", "Take to recycling center"),
            createMethod("Donation", "Good condition items", "Give to charity or thrift store"),
            createMethod("Proper disposal", "Last resort", "Municipal waste facility")
        );

        guide.put("preparation_steps", steps);
        guide.put("disposal_methods", methods);
        guide.put("safety_warnings", Arrays.asList("Handle with care", "Follow local guidelines"));
        guide.put("environmental_impact", Map.of(
            "co2_saved", "2.5 kg",
            "energy_saved", "1500 BTU",
            "water_saved", "1.2 L",
            "points_earned", 15
        ));

        return guide;
    }

    private Map<String, Object> createStep(int stepNumber, String action, String details, String time) {
        Map<String, Object> step = new HashMap<>();
        step.put("step", stepNumber);
        step.put("action", action);
        step.put("details", details);
        step.put("time_needed", time);
        return step;
    }

    private Map<String, Object> createMethod(String method, String suitability, String instructions) {
        Map<String, Object> methodMap = new HashMap<>();
        methodMap.put("method", method);
        methodMap.put("suitability", suitability);
        methodMap.put("instructions", instructions);
        return methodMap;
    }

    private Map<String, Object> calculateImpact(String wasteType, int itemCount, String disposalMethod) {
        // Basic impact calculation (replace with sophisticated algorithm)
        double baseCO2 = 2.0;
        int baseEnergy = 1000;
        double baseWater = 0.8;
        double basePoints = 10.0;

        Map<String, Object> impact = new HashMap<>();
        impact.put("co2_reduced", String.format("%.1f", baseCO2 * itemCount));
        impact.put("energy_saved", String.valueOf(baseEnergy * itemCount));
        impact.put("water_saved", String.format("%.1f", baseWater * itemCount));
        impact.put("landfill_diverted", String.format("%.1f", 0.5 * itemCount));
        impact.put("points_earned", String.valueOf(Math.round(basePoints * itemCount)));

        return impact;
    }

    private List<Map<String, Object>> generateAchievements(String wasteType, String disposalMethod) {
        List<Map<String, Object>> achievements = new ArrayList<>();
        
        Map<String, Object> achievement = new HashMap<>();
        achievement.put("id", "eco_action");
        achievement.put("title", "Eco Action");
        achievement.put("description", "Made an environmental impact!");
        achievement.put("badge_emoji", "🌱");
        achievement.put("first_time", false);
        
        achievements.add(achievement);
        return achievements;
    }

    private List<Map<String, Object>> generateInsights(String wasteType, Map<String, Object> impact) {
        List<Map<String, Object>> insights = new ArrayList<>();
        
        Map<String, Object> insight = new HashMap<>();
        insight.put("type", "impact");
        insight.put("message", "Great job! You've made a positive environmental impact with " + wasteType + " disposal.");
        insight.put("icon", "🌍");
        
        insights.add(insight);
        return insights;
    }

    // Utility methods
    private Double getDoubleValue(Map<String, Object> map, String key) {
        Object value = map.get(key);
        if (value instanceof Number) {
            return ((Number) value).doubleValue();
        }
        return null;
    }

    private Integer getIntegerValue(Map<String, Object> map, String key, Integer defaultValue) {
        Object value = map.get(key);
        if (value instanceof Number) {
            return ((Number) value).intValue();
        }
        return defaultValue;
    }
}
