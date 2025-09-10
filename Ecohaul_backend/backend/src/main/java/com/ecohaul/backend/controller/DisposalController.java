package com.ecohaul.backend.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.*;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@RestController
@RequestMapping("/api/v1/disposal")
@CrossOrigin(origins = "*")
public class DisposalController {
    
    @GetMapping("/centers")
    public ResponseEntity<?> getDisposalCenters(
            @RequestParam(required = false) Double latitude,
            @RequestParam(required = false) Double longitude,
            @RequestParam(required = false, defaultValue = "10") Integer radius) {
        try {
            // Mock disposal centers
            List<Map<String, Object>> centers = generateMockDisposalCenters(latitude, longitude, radius);
            
            Map<String, Object> response = new HashMap<>();
            response.put("disposalCenters", centers);
            response.put("totalCenters", centers.size());
            response.put("searchRadius", radius);
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", "Error fetching disposal centers: " + e.getMessage());
            return ResponseEntity.internalServerError().body(error);
        }
    }
    
    @GetMapping("/centers/{centerId}")
    public ResponseEntity<?> getDisposalCenterDetails(@PathVariable String centerId) {
        try {
            // Mock center details
            Map<String, Object> center = generateDetailedCenterInfo(centerId);
            
            return ResponseEntity.ok(center);
            
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", "Error fetching center details: " + e.getMessage());
            return ResponseEntity.internalServerError().body(error);
        }
    }
    
    @GetMapping("/agents")
    public ResponseEntity<?> getDisposalAgents(
            @RequestParam(required = false) Double latitude,
            @RequestParam(required = false) Double longitude,
            @RequestParam(required = false, defaultValue = "available") String status) {
        try {
            // Mock disposal agents
            List<Map<String, Object>> agents = generateMockDisposalAgents(latitude, longitude, status);
            
            Map<String, Object> response = new HashMap<>();
            response.put("disposalAgents", agents);
            response.put("totalAgents", agents.size());
            response.put("filterStatus", status);
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", "Error fetching disposal agents: " + e.getMessage());
            return ResponseEntity.internalServerError().body(error);
        }
    }
    
    @GetMapping("/agents/{agentId}")
    public ResponseEntity<?> getDisposalAgentDetails(@PathVariable String agentId) {
        try {
            // Mock agent details
            Map<String, Object> agent = generateDetailedAgentInfo(agentId);
            
            return ResponseEntity.ok(agent);
            
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", "Error fetching agent details: " + e.getMessage());
            return ResponseEntity.internalServerError().body(error);
        }
    }
    
    @GetMapping("/instructions")
    public ResponseEntity<?> getDisposalInstructions(@RequestParam(required = false) String wasteType) {
        try {
            List<Map<String, Object>> instructions;
            
            if (wasteType != null && !wasteType.trim().isEmpty()) {
                instructions = getInstructionsForWasteType(wasteType);
            } else {
                instructions = getAllDisposalInstructions();
            }
            
            Map<String, Object> response = new HashMap<>();
            response.put("instructions", instructions);
            response.put("wasteType", wasteType);
            response.put("totalInstructions", instructions.size());
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", "Error fetching disposal instructions: " + e.getMessage());
            return ResponseEntity.internalServerError().body(error);
        }
    }
    
    @PostMapping("/schedule-pickup")
    public ResponseEntity<?> schedulePickupWithAgent(@RequestBody Map<String, Object> pickupRequest) {
        try {
            Long userId = Long.valueOf(pickupRequest.get("userId").toString());
            String agentId = (String) pickupRequest.get("agentId");
            String pickupDate = (String) pickupRequest.get("pickupDate");
            String pickupTime = (String) pickupRequest.get("pickupTime");
            String address = (String) pickupRequest.get("address");
            
            if (userId == null || agentId == null || pickupDate == null || pickupTime == null || address == null) {
                Map<String, String> error = new HashMap<>();
                error.put("message", "All fields are required for pickup scheduling");
                return ResponseEntity.badRequest().body(error);
            }
            
            // Mock pickup scheduling with specific agent
            Map<String, Object> pickup = new HashMap<>();
            pickup.put("pickupId", UUID.randomUUID().toString());
            pickup.put("userId", userId);
            pickup.put("agentId", agentId);
            pickup.put("pickupDate", pickupDate);
            pickup.put("pickupTime", pickupTime);
            pickup.put("address", address);
            pickup.put("status", "Scheduled");
            pickup.put("estimatedFee", calculatePickupFee());
            pickup.put("agent", generateDetailedAgentInfo(agentId));
            pickup.put("scheduledAt", LocalDateTime.now().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME));
            
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Pickup scheduled successfully with agent");
            response.put("pickup", pickup);
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", "Error scheduling pickup: " + e.getMessage());
            return ResponseEntity.internalServerError().body(error);
        }
    }
    
    @PostMapping("/centers/{centerId}/rate")
    public ResponseEntity<?> rateDisposalCenter(@PathVariable String centerId, @RequestBody Map<String, Object> ratingRequest) {
        try {
            Long userId = Long.valueOf(ratingRequest.get("userId").toString());
            Integer rating = Integer.valueOf(ratingRequest.get("rating").toString());
            String review = (String) ratingRequest.get("review");
            
            if (userId == null || rating == null || rating < 1 || rating > 5) {
                Map<String, String> error = new HashMap<>();
                error.put("message", "Valid user ID and rating (1-5) are required");
                return ResponseEntity.badRequest().body(error);
            }
            
            // Mock rating submission
            Map<String, Object> submittedRating = new HashMap<>();
            submittedRating.put("ratingId", UUID.randomUUID().toString());
            submittedRating.put("userId", userId);
            submittedRating.put("centerId", centerId);
            submittedRating.put("rating", rating);
            submittedRating.put("review", review);
            submittedRating.put("submittedAt", LocalDateTime.now().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME));
            
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Rating submitted successfully");
            response.put("rating", submittedRating);
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", "Error submitting rating: " + e.getMessage());
            return ResponseEntity.internalServerError().body(error);
        }
    }
    
    @GetMapping("/waste-types")
    public ResponseEntity<?> getSupportedWasteTypes() {
        try {
            List<Map<String, Object>> wasteTypes = generateWasteTypesList();
            
            Map<String, Object> response = new HashMap<>();
            response.put("wasteTypes", wasteTypes);
            response.put("totalTypes", wasteTypes.size());
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", "Error fetching waste types: " + e.getMessage());
            return ResponseEntity.internalServerError().body(error);
        }
    }
    
    // Helper methods
    private List<Map<String, Object>> generateMockDisposalCenters(Double lat, Double lng, Integer radius) {
        List<Map<String, Object>> centers = new ArrayList<>();
        String[] centerNames = {"EcoCenter Downtown", "Green Valley Recycling", "Municipal Waste Facility", 
                               "CleanTech Disposal", "Sustainable Solutions Center"};
        String[] addresses = {"123 Main St, Downtown", "456 Green Ave, Valley", "789 Municipal Dr, City Center",
                             "321 Tech Blvd, Industrial", "654 Eco Way, Suburbs"};
        
        for (int i = 0; i < centerNames.length; i++) {
            Map<String, Object> center = new HashMap<>();
            center.put("centerId", UUID.randomUUID().toString());
            center.put("name", centerNames[i]);
            center.put("address", addresses[i]);
            center.put("latitude", (lat != null) ? lat + (Math.random() - 0.5) * 0.1 : 40.7128 + (Math.random() - 0.5) * 0.1);
            center.put("longitude", (lng != null) ? lng + (Math.random() - 0.5) * 0.1 : -74.0060 + (Math.random() - 0.5) * 0.1);
            center.put("distance", Math.round((Math.random() * radius * 2) * 10.0) / 10.0);
            center.put("rating", Math.round((4.0 + Math.random()) * 10.0) / 10.0);
            center.put("operatingHours", "8:00 AM - 6:00 PM");
            center.put("phoneNumber", "+1-555-0" + (100 + i));
            center.put("pickupAvailable", i % 2 == 0);
            
            centers.add(center);
        }
        
        return centers;
    }
    
    private List<Map<String, Object>> generateMockDisposalAgents(Double lat, Double lng, String status) {
        List<Map<String, Object>> agents = new ArrayList<>();
        String[] agentNames = {"John Smith", "Sarah Johnson", "Mike Wilson", "Lisa Brown", "David Garcia"};
        String[] vehicleTypes = {"Truck", "Van", "Pickup", "Large Truck", "Eco Vehicle"};
        
        for (int i = 0; i < agentNames.length; i++) {
            if (status.equals("available") && i > 2) continue; // Limit available agents
            
            Map<String, Object> agent = new HashMap<>();
            agent.put("agentId", UUID.randomUUID().toString());
            agent.put("name", agentNames[i]);
            agent.put("phoneNumber", "+1-555-0" + (200 + i));
            agent.put("vehicleType", vehicleTypes[i]);
            agent.put("licensePlate", "ABC-" + (1000 + i));
            agent.put("currentLatitude", (lat != null) ? lat + (Math.random() - 0.5) * 0.05 : 40.7128 + (Math.random() - 0.5) * 0.05);
            agent.put("currentLongitude", (lng != null) ? lng + (Math.random() - 0.5) * 0.05 : -74.0060 + (Math.random() - 0.5) * 0.05);
            agent.put("isAvailable", status.equals("available") || Math.random() > 0.3);
            agent.put("rating", Math.round((4.2 + Math.random() * 0.8) * 10.0) / 10.0);
            agent.put("totalPickups", (int) (Math.random() * 500) + 50);
            
            agents.add(agent);
        }
        
        return agents;
    }
    
    private Map<String, Object> generateDetailedCenterInfo(String centerId) {
        Map<String, Object> center = new HashMap<>();
        center.put("centerId", centerId);
        center.put("name", "EcoCenter Downtown");
        center.put("address", "123 Main St, Downtown, City 12345");
        center.put("latitude", 40.7128);
        center.put("longitude", -74.0060);
        center.put("phoneNumber", "+1-555-0123");
        center.put("email", "info@ecocenter.com");
        center.put("operatingHours", "Monday-Friday: 8:00 AM - 6:00 PM, Saturday: 9:00 AM - 4:00 PM");
        center.put("rating", 4.5);
        center.put("totalReviews", 150);
        center.put("pickupServiceAvailable", true);
        center.put("acceptedWasteTypes", Arrays.asList("Plastic", "Glass", "Metal", "Paper", "Electronics", "Batteries"));
        center.put("specialServices", Arrays.asList("Hazardous Waste", "Large Item Pickup", "Document Shredding"));
        center.put("certifications", Arrays.asList("EPA Certified", "Green Business Certified"));
        
        return center;
    }
    
    private Map<String, Object> generateDetailedAgentInfo(String agentId) {
        Map<String, Object> agent = new HashMap<>();
        agent.put("agentId", agentId);
        agent.put("name", "John Smith");
        agent.put("phoneNumber", "+1-555-0123");
        agent.put("email", "john.smith@ecohaul.com");
        agent.put("vehicleType", "Truck");
        agent.put("licensePlate", "ABC-1234");
        agent.put("rating", 4.7);
        agent.put("totalPickups", 250);
        agent.put("totalReviews", 85);
        agent.put("isAvailable", true);
        agent.put("coverageArea", Arrays.asList("Downtown", "Midtown", "West Side"));
        agent.put("specializations", Arrays.asList("Large Items", "Electronics", "Hazardous Waste"));
        agent.put("yearsOfExperience", 5);
        
        return agent;
    }
    
    private List<Map<String, Object>> getAllDisposalInstructions() {
        List<Map<String, Object>> instructions = new ArrayList<>();
        String[] wasteTypes = {"Plastic", "Glass", "Metal", "Paper", "Electronics", "Batteries", "Organic"};
        
        for (String wasteType : wasteTypes) {
            instructions.addAll(getInstructionsForWasteType(wasteType));
        }
        
        return instructions;
    }
    
    private List<Map<String, Object>> getInstructionsForWasteType(String wasteType) {
        List<Map<String, Object>> instructions = new ArrayList<>();
        
        Map<String, Object> instruction = new HashMap<>();
        instruction.put("wasteType", wasteType);
        instruction.put("category", getCategoryForWasteType(wasteType));
        instruction.put("instructions", getDetailedInstructions(wasteType));
        instruction.put("dosDonts", getDosDonts(wasteType));
        instruction.put("specialNotes", getSpecialNotes(wasteType));
        
        instructions.add(instruction);
        return instructions;
    }
    
    private String getCategoryForWasteType(String wasteType) {
        switch (wasteType.toLowerCase()) {
            case "plastic":
            case "glass":
            case "metal":
            case "paper":
                return "Recyclable";
            case "electronics":
                return "E-Waste";
            case "batteries":
                return "Hazardous";
            case "organic":
                return "Compostable";
            default:
                return "General";
        }
    }
    
    private List<String> getDetailedInstructions(String wasteType) {
        Map<String, List<String>> instructionsMap = new HashMap<>();
        instructionsMap.put("Plastic", Arrays.asList(
            "Clean containers thoroughly", "Remove all labels if possible", "Sort by plastic type number", "Take to recycling center"
        ));
        instructionsMap.put("Glass", Arrays.asList(
            "Remove all caps and lids", "Rinse clean", "Sort by color if required", "Handle carefully to avoid breakage"
        ));
        instructionsMap.put("Electronics", Arrays.asList(
            "Remove all personal data", "Remove batteries if possible", "Take to certified e-waste facility", "Check for manufacturer take-back programs"
        ));
        
        return instructionsMap.getOrDefault(wasteType, Arrays.asList("Follow local disposal guidelines"));
    }
    
    private Map<String, List<String>> getDosDonts(String wasteType) {
        Map<String, List<String>> dosDonts = new HashMap<>();
        dosDonts.put("dos", Arrays.asList("Clean before disposal", "Sort properly", "Follow local guidelines"));
        dosDonts.put("donts", Arrays.asList("Don't mix with regular trash", "Don't contaminate with food waste", "Don't break or damage items"));
        
        return dosDonts;
    }
    
    private String getSpecialNotes(String wasteType) {
        switch (wasteType.toLowerCase()) {
            case "batteries":
                return "Never dispose of batteries in regular trash. They contain hazardous materials.";
            case "electronics":
                return "Many electronics contain valuable materials that can be recovered through proper recycling.";
            default:
                return "Check with your local disposal center for specific requirements.";
        }
    }
    
    private List<Map<String, Object>> generateWasteTypesList() {
        List<Map<String, Object>> wasteTypes = new ArrayList<>();
        String[] types = {"Plastic", "Glass", "Metal", "Paper", "Electronics", "Batteries", "Organic", "Textile"};
        String[] categories = {"Recyclable", "Recyclable", "Recyclable", "Recyclable", "E-Waste", "Hazardous", "Compostable", "Textile"};
        
        for (int i = 0; i < types.length; i++) {
            Map<String, Object> wasteType = new HashMap<>();
            wasteType.put("type", types[i]);
            wasteType.put("category", categories[i]);
            wasteType.put("recyclable", !categories[i].equals("Hazardous"));
            wasteType.put("description", "Guidelines for " + types[i].toLowerCase() + " disposal");
            
            wasteTypes.add(wasteType);
        }
        
        return wasteTypes;
    }
    
    private double calculatePickupFee() {
        // Mock fee calculation based on distance, waste amount, etc.
        return Math.round((15.0 + Math.random() * 20.0) * 100.0) / 100.0; // $15-35
    }
}
