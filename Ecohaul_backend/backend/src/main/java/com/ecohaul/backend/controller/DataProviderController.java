package com.ecohaul.backend.controller;

import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import java.util.*;

/**
 * Data Provider Controller
 * Provides data endpoints for n8n workflows to use
 * Supports your n8n-primary architecture with Spring Boot as data source
 */
@RestController
@RequestMapping("/api/data")
@CrossOrigin(origins = "*")
public class DataProviderController {

    /**
     * Get disposal centers data for n8n workflows
     * GET /api/data/disposal-centers
     */
    @GetMapping("/disposal-centers")
    public ResponseEntity<Map<String, Object>> getDisposalCentersData(
            @RequestParam(required = false) String wasteType,
            @RequestParam(required = false) Double latitude,
            @RequestParam(required = false) Double longitude,
            @RequestParam(required = false, defaultValue = "10") Integer radius) {
        
        try {
            // Mock disposal centers data (replace with actual database query)
            List<Map<String, Object>> allCenters = Arrays.asList(
                createDisposalCenter("1", "EcoCenter Downtown", "123 Green St, City", 
                    40.7128, -74.0060, Arrays.asList("plastic", "metal", "glass"), "Mon-Fri 8AM-6PM", 4.5),
                createDisposalCenter("2", "Recycling Plus", "456 Earth Ave, City", 
                    40.7589, -73.9851, Arrays.asList("electronic", "battery", "plastic"), "Daily 7AM-7PM", 4.2),
                createDisposalCenter("3", "Green Disposal Hub", "789 Eco Blvd, City", 
                    40.6782, -73.9442, Arrays.asList("organic", "food", "yard"), "Mon-Sat 9AM-5PM", 4.0),
                createDisposalCenter("4", "Hazmat Facility", "321 Safe Way, City", 
                    40.7306, -73.9352, Arrays.asList("hazardous", "paint", "chemical"), "Tue-Thu 9AM-3PM", 4.3),
                createDisposalCenter("5", "Textile Recycling Co", "654 Fashion Ave, City", 
                    40.7505, -73.9934, Arrays.asList("textile", "clothing", "shoes"), "Mon-Fri 10AM-6PM", 4.1),
                createDisposalCenter("6", "E-Waste Solutions", "987 Tech Blvd, City", 
                    40.7831, -73.9712, Arrays.asList("electronic", "phone", "computer"), "Wed-Sun 8AM-5PM", 4.4)
            );

            // Filter by waste type if specified
            List<Map<String, Object>> filteredCenters = allCenters;
            if (wasteType != null && !wasteType.isEmpty()) {
                filteredCenters = new ArrayList<>();
                for (Map<String, Object> center : allCenters) {
                    @SuppressWarnings("unchecked")
                    List<String> acceptedWaste = (List<String>) center.get("acceptedWaste");
                    if (acceptedWaste.contains(wasteType.toLowerCase()) || acceptedWaste.contains("all")) {
                        filteredCenters.add(center);
                    }
                }
            }

            // Calculate distances if location provided
            if (latitude != null && longitude != null) {
                for (Map<String, Object> center : filteredCenters) {
                    double centerLat = (Double) center.get("latitude");
                    double centerLon = (Double) center.get("longitude");
                    double distance = calculateDistance(latitude, longitude, centerLat, centerLon);
                    center.put("distance", Math.round(distance * 100.0) / 100.0);
                }

                // Sort by distance
                filteredCenters.sort((a, b) -> {
                    Double distA = (Double) a.get("distance");
                    Double distB = (Double) b.get("distance");
                    return distA.compareTo(distB);
                });
            }

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("data", filteredCenters);
            response.put("total", filteredCenters.size());
            response.put("filters_applied", Map.of(
                "wasteType", wasteType != null ? wasteType : "all",
                "radius", radius,
                "location_based", latitude != null && longitude != null
            ));

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("error", "Failed to fetch disposal centers data: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }

    /**
     * Get waste type database for n8n workflows
     * GET /api/data/waste-types
     */
    @GetMapping("/waste-types")
    public ResponseEntity<Map<String, Object>> getWasteTypesData() {
        try {
            // Comprehensive waste type database for n8n workflows
            Map<String, Object> wasteDatabase = new HashMap<>();
            
            // Recyclables
            wasteDatabase.put("plastic", createWasteTypeInfo("recyclable", Arrays.asList("prevention", "reuse", "recycling"), "low", "simple", "high", 2.1, 2200, 0.6, 10));
            wasteDatabase.put("metal", createWasteTypeInfo("recyclable", Arrays.asList("recycling", "reuse", "scrap_dealer"), "low", "simple", "very_high", 4.2, 6500, 1.4, 15));
            wasteDatabase.put("glass", createWasteTypeInfo("recyclable", Arrays.asList("recycling", "reuse", "craft_projects"), "medium", "simple", "high", 0.6, 1300, 0.3, 12));
            wasteDatabase.put("paper", createWasteTypeInfo("recyclable", Arrays.asList("recycling", "composting", "reuse"), "low", "very_simple", "medium", 3.3, 4000, 7.2, 8));
            
            // Electronics
            wasteDatabase.put("electronic", createWasteTypeInfo("special_handling", Arrays.asList("certified_recycling", "donation", "manufacturer_takeback"), "medium", "medium", "very_high", 12.5, 18000, 6.8, 25));
            wasteDatabase.put("phone", createWasteTypeInfo("special_handling", Arrays.asList("trade_in", "donation", "certified_recycling"), "medium", "medium", "very_high", 15.2, 22000, 8.0, 30));
            wasteDatabase.put("battery", createWasteTypeInfo("hazardous", Arrays.asList("specialized_recycling", "retailer_takeback"), "high", "simple", "very_high", 8.5, 12000, 4.2, 20));
            
            // Organic waste
            wasteDatabase.put("organic", createWasteTypeInfo("compostable", Arrays.asList("composting", "municipal_organics", "biogas"), "low", "simple", "high", 1.8, 800, 0.4, 6));
            wasteDatabase.put("food", createWasteTypeInfo("compostable", Arrays.asList("prevention", "donation", "composting"), "low", "simple", "very_high", 2.2, 1000, 0.5, 8));
            
            // Textiles
            wasteDatabase.put("textile", createWasteTypeInfo("reusable", Arrays.asList("donation", "textile_recycling", "upcycling"), "low", "simple", "high", 8.5, 12000, 20.0, 18));
            wasteDatabase.put("clothing", createWasteTypeInfo("reusable", Arrays.asList("donation", "consignment", "textile_recycling"), "low", "simple", "very_high", 9.2, 13500, 22.0, 20));
            
            // Hazardous materials
            wasteDatabase.put("hazardous", createWasteTypeInfo("hazardous", Arrays.asList("hazmat_facility", "special_collection"), "very_high", "complex", "critical", 18.0, 25000, 12.5, 30));
            wasteDatabase.put("paint", createWasteTypeInfo("hazardous", Arrays.asList("hazmat_facility", "dried_disposal", "donation"), "high", "medium", "high", 12.0, 15000, 8.0, 25));

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("waste_database", wasteDatabase);
            response.put("total_types", wasteDatabase.size());
            response.put("categories", Arrays.asList("recyclable", "special_handling", "compostable", "reusable", "hazardous"));

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("error", "Failed to fetch waste types data: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }

    /**
     * Get user history data for n8n workflows
     * GET /api/data/user-history/{userId}
     */
    @GetMapping("/user-history/{userId}")
    public ResponseEntity<Map<String, Object>> getUserHistoryData(@PathVariable String userId) {
        try {
            // Mock user history data (replace with actual database query)
            List<Map<String, Object>> historyData = Arrays.asList(
                createHistoryRecord(userId, "plastic", 2, "recycling", "2024-09-08", 2.1, 15),
                createHistoryRecord(userId, "electronic", 1, "certified_recycling", "2024-09-07", 12.5, 25),
                createHistoryRecord(userId, "organic", 3, "composting", "2024-09-06", 1.8, 18),
                createHistoryRecord(userId, "clothing", 2, "donation", "2024-09-05", 9.2, 40)
            );

            // Calculate summary statistics
            int totalItems = historyData.stream().mapToInt(record -> (Integer) record.get("itemCount")).sum();
            double totalCO2 = historyData.stream().mapToDouble(record -> (Double) record.get("co2Saved")).sum();
            int totalPoints = historyData.stream().mapToInt(record -> (Integer) record.get("pointsEarned")).sum();

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("userId", userId);
            response.put("history", historyData);
            response.put("summary", Map.of(
                "total_items", totalItems,
                "total_co2_saved", Math.round(totalCO2 * 100.0) / 100.0,
                "total_points", totalPoints,
                "entries_count", historyData.size()
            ));

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("error", "Failed to fetch user history: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }

    /**
     * Store impact data from n8n workflows
     * POST /api/data/store-impact
     */
    @PostMapping("/store-impact")
    public ResponseEntity<Map<String, Object>> storeImpactData(@RequestBody Map<String, Object> impactData) {
        try {
            // Store impact data in database (mock implementation)
            String userId = (String) impactData.get("userId");
            String wasteType = (String) impactData.get("wasteType");
            Integer itemCount = (Integer) impactData.get("itemCount");
            String disposalMethod = (String) impactData.get("disposalMethod");
            
            // In real implementation, save to database
            // userImpactRepository.save(new UserImpact(...));
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Impact data stored successfully");
            response.put("stored_data", Map.of(
                "userId", userId,
                "wasteType", wasteType,
                "itemCount", itemCount,
                "disposalMethod", disposalMethod,
                "timestamp", new Date().toString()
            ));

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("error", "Failed to store impact data: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }

    // Helper methods
    private Map<String, Object> createDisposalCenter(String id, String name, String address, 
            double latitude, double longitude, List<String> acceptedWaste, String hours, double rating) {
        Map<String, Object> center = new HashMap<>();
        center.put("id", id);
        center.put("name", name);
        center.put("address", address);
        center.put("latitude", latitude);
        center.put("longitude", longitude);
        center.put("acceptedWaste", acceptedWaste);
        center.put("hours", hours);
        center.put("rating", rating);
        center.put("phone", "+1-555-ECO-" + id + "000");
        center.put("googleMapsUrl", "https://maps.google.com/search/" + address.replace(" ", "+"));
        return center;
    }

    private Map<String, Object> createWasteTypeInfo(String category, List<String> methods, 
            String safetyLevel, String complexity, String environmentalImpact, 
            double co2Factor, int energyFactor, double waterFactor, int basePoints) {
        Map<String, Object> wasteInfo = new HashMap<>();
        wasteInfo.put("category", category);
        wasteInfo.put("priority_methods", methods);
        wasteInfo.put("safety_level", safetyLevel);
        wasteInfo.put("prep_complexity", complexity);
        wasteInfo.put("environmental_impact", environmentalImpact);
        wasteInfo.put("impact_factors", Map.of(
            "co2", co2Factor,
            "energy", energyFactor,
            "water", waterFactor,
            "base_points", basePoints
        ));
        return wasteInfo;
    }

    private Map<String, Object> createHistoryRecord(String userId, String wasteType, 
            int itemCount, String disposalMethod, String date, double co2Saved, int pointsEarned) {
        Map<String, Object> record = new HashMap<>();
        record.put("userId", userId);
        record.put("wasteType", wasteType);
        record.put("itemCount", itemCount);
        record.put("disposalMethod", disposalMethod);
        record.put("date", date);
        record.put("co2Saved", co2Saved);
        record.put("pointsEarned", pointsEarned);
        return record;
    }

    // Calculate distance between two coordinates (Haversine formula)
    private double calculateDistance(double lat1, double lon1, double lat2, double lon2) {
        final int R = 6371; // Radius of the Earth in km
        double latDistance = Math.toRadians(lat2 - lat1);
        double lonDistance = Math.toRadians(lon2 - lon1);
        double a = Math.sin(latDistance / 2) * Math.sin(latDistance / 2)
                + Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2))
                * Math.sin(lonDistance / 2) * Math.sin(lonDistance / 2);
        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c; // Distance in km
    }
}
