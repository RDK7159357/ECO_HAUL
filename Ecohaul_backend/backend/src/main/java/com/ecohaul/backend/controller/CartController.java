package com.ecohaul.backend.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.*;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@RestController
@RequestMapping("/api/v1/cart")
@CrossOrigin(origins = "*")
public class CartController {
    
    @PostMapping("/add")
    public ResponseEntity<?> addToCart(@RequestBody Map<String, Object> cartRequest) {
        try {
            Long userId = Long.valueOf(cartRequest.get("userId").toString());
            String wasteType = (String) cartRequest.get("wasteType");
            Double weight = Double.valueOf(cartRequest.get("weight").toString());
            
            if (userId == null || wasteType == null || weight == null) {
                Map<String, String> error = new HashMap<>();
                error.put("message", "User ID, waste type, and weight are required");
                return ResponseEntity.badRequest().body(error);
            }
            
            // Mock adding item to cart
            Map<String, Object> cartItem = new HashMap<>();
            cartItem.put("cartItemId", UUID.randomUUID().toString());
            cartItem.put("userId", userId);
            cartItem.put("wasteType", wasteType);
            cartItem.put("weight", weight);
            cartItem.put("estimatedValue", calculateEstimatedValue(wasteType, weight));
            cartItem.put("category", getCategoryForWasteType(wasteType));
            cartItem.put("addedAt", LocalDateTime.now().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME));
            
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Item added to cart successfully");
            response.put("cartItem", cartItem);
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", "Error adding item to cart: " + e.getMessage());
            return ResponseEntity.internalServerError().body(error);
        }
    }
    
    @GetMapping("/{userId}")
    public ResponseEntity<?> getCart(@PathVariable Long userId) {
        try {
            // Mock cart items
            List<Map<String, Object>> cartItems = generateMockCartItems(userId);
            
            double totalWeight = cartItems.stream()
                .mapToDouble(item -> (Double) item.get("weight"))
                .sum();
            
            double totalValue = cartItems.stream()
                .mapToDouble(item -> (Double) item.get("estimatedValue"))
                .sum();
            
            Map<String, Object> response = new HashMap<>();
            response.put("cartItems", cartItems);
            response.put("totalItems", cartItems.size());
            response.put("totalWeight", totalWeight);
            response.put("estimatedTotalValue", totalValue);
            response.put("lastUpdated", LocalDateTime.now().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME));
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", "Error fetching cart: " + e.getMessage());
            return ResponseEntity.internalServerError().body(error);
        }
    }
    
    @DeleteMapping("/item/{cartItemId}")
    public ResponseEntity<?> removeFromCart(@PathVariable String cartItemId) {
        try {
            // Mock removal
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Item removed from cart successfully");
            response.put("removedItemId", cartItemId);
            response.put("removedAt", LocalDateTime.now().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME));
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", "Error removing item from cart: " + e.getMessage());
            return ResponseEntity.internalServerError().body(error);
        }
    }
    
    @PutMapping("/item/{cartItemId}")
    public ResponseEntity<?> updateCartItem(@PathVariable String cartItemId, @RequestBody Map<String, Object> updateRequest) {
        try {
            Double newWeight = Double.valueOf(updateRequest.get("weight").toString());
            String wasteType = (String) updateRequest.get("wasteType");
            
            if (newWeight == null) {
                Map<String, String> error = new HashMap<>();
                error.put("message", "Weight is required for update");
                return ResponseEntity.badRequest().body(error);
            }
            
            // Mock update
            Map<String, Object> updatedItem = new HashMap<>();
            updatedItem.put("cartItemId", cartItemId);
            updatedItem.put("wasteType", wasteType);
            updatedItem.put("weight", newWeight);
            updatedItem.put("estimatedValue", calculateEstimatedValue(wasteType, newWeight));
            updatedItem.put("updatedAt", LocalDateTime.now().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME));
            
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Cart item updated successfully");
            response.put("updatedItem", updatedItem);
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", "Error updating cart item: " + e.getMessage());
            return ResponseEntity.internalServerError().body(error);
        }
    }
    
    @PostMapping("/schedule-pickup")
    public ResponseEntity<?> schedulePickup(@RequestBody Map<String, Object> pickupRequest) {
        try {
            Long userId = Long.valueOf(pickupRequest.get("userId").toString());
            String pickupDate = (String) pickupRequest.get("pickupDate");
            String pickupTime = (String) pickupRequest.get("pickupTime");
            String address = (String) pickupRequest.get("address");
            
            if (userId == null || pickupDate == null || pickupTime == null || address == null) {
                Map<String, String> error = new HashMap<>();
                error.put("message", "User ID, pickup date, time, and address are required");
                return ResponseEntity.badRequest().body(error);
            }
            
            // Mock pickup scheduling
            Map<String, Object> pickup = new HashMap<>();
            pickup.put("pickupId", UUID.randomUUID().toString());
            pickup.put("userId", userId);
            pickup.put("pickupDate", pickupDate);
            pickup.put("pickupTime", pickupTime);
            pickup.put("address", address);
            pickup.put("status", "Scheduled");
            pickup.put("assignedAgent", assignMockAgent());
            pickup.put("estimatedArrival", pickupTime);
            pickup.put("scheduledAt", LocalDateTime.now().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME));
            
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Pickup scheduled successfully");
            response.put("pickup", pickup);
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", "Error scheduling pickup: " + e.getMessage());
            return ResponseEntity.internalServerError().body(error);
        }
    }
    
    @GetMapping("/pickups/{userId}")
    public ResponseEntity<?> getUserPickups(@PathVariable Long userId) {
        try {
            // Mock user pickups
            List<Map<String, Object>> pickups = generateMockPickups(userId);
            
            Map<String, Object> response = new HashMap<>();
            response.put("pickups", pickups);
            response.put("totalPickups", pickups.size());
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", "Error fetching pickups: " + e.getMessage());
            return ResponseEntity.internalServerError().body(error);
        }
    }
    
    @DeleteMapping("/{userId}/clear")
    public ResponseEntity<?> clearCart(@PathVariable Long userId) {
        try {
            // Mock cart clearing
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Cart cleared successfully");
            response.put("userId", userId);
            response.put("clearedAt", LocalDateTime.now().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME));
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", "Error clearing cart: " + e.getMessage());
            return ResponseEntity.internalServerError().body(error);
        }
    }
    
    // Helper methods
    private List<Map<String, Object>> generateMockCartItems(Long userId) {
        List<Map<String, Object>> cartItems = new ArrayList<>();
        String[] wasteTypes = {"Plastic Bottle", "Aluminum Can", "Glass Bottle", "Paper", "Cardboard"};
        
        for (int i = 0; i < 3; i++) {
            Map<String, Object> item = new HashMap<>();
            String wasteType = wasteTypes[i % wasteTypes.length];
            double weight = Math.round((Math.random() * 500 + 100) * 100.0) / 100.0; // 100-600g
            
            item.put("cartItemId", UUID.randomUUID().toString());
            item.put("userId", userId);
            item.put("wasteType", wasteType);
            item.put("weight", weight);
            item.put("estimatedValue", calculateEstimatedValue(wasteType, weight));
            item.put("category", getCategoryForWasteType(wasteType));
            item.put("addedAt", LocalDateTime.now().minusHours(i).format(DateTimeFormatter.ISO_LOCAL_DATE_TIME));
            
            cartItems.add(item);
        }
        
        return cartItems;
    }
    
    private List<Map<String, Object>> generateMockPickups(Long userId) {
        List<Map<String, Object>> pickups = new ArrayList<>();
        String[] statuses = {"Scheduled", "In Progress", "Completed", "Cancelled"};
        
        for (int i = 0; i < 4; i++) {
            Map<String, Object> pickup = new HashMap<>();
            pickup.put("pickupId", UUID.randomUUID().toString());
            pickup.put("userId", userId);
            pickup.put("pickupDate", LocalDateTime.now().plusDays(i).toLocalDate().toString());
            pickup.put("pickupTime", "10:00 AM");
            pickup.put("status", statuses[i % statuses.length]);
            pickup.put("assignedAgent", assignMockAgent());
            pickup.put("address", "123 Main St, City");
            pickup.put("scheduledAt", LocalDateTime.now().minusDays(i).format(DateTimeFormatter.ISO_LOCAL_DATE_TIME));
            
            pickups.add(pickup);
        }
        
        return pickups;
    }
    
    private double calculateEstimatedValue(String wasteType, double weight) {
        // Mock pricing per kg
        Map<String, Double> pricing = new HashMap<>();
        pricing.put("Plastic Bottle", 1.50);
        pricing.put("Aluminum Can", 3.00);
        pricing.put("Glass Bottle", 0.80);
        pricing.put("Paper", 0.40);
        pricing.put("Cardboard", 0.60);
        
        double pricePerKg = pricing.getOrDefault(wasteType, 1.00);
        double weightInKg = weight / 1000.0; // Convert grams to kg
        return Math.round(weightInKg * pricePerKg * 100.0) / 100.0; // Round to 2 decimal places
    }
    
    private String getCategoryForWasteType(String wasteType) {
        switch (wasteType.toLowerCase()) {
            case "plastic bottle":
            case "aluminum can":
            case "glass bottle":
            case "paper":
            case "cardboard":
                return "Recyclable";
            default:
                return "General";
        }
    }
    
    private Map<String, Object> assignMockAgent() {
        String[] agentNames = {"John Smith", "Sarah Johnson", "Mike Wilson", "Lisa Brown"};
        String[] vehicleTypes = {"Truck", "Van", "Pickup"};
        
        int randomIndex = (int) (Math.random() * agentNames.length);
        
        Map<String, Object> agent = new HashMap<>();
        agent.put("agentId", UUID.randomUUID().toString());
        agent.put("name", agentNames[randomIndex]);
        agent.put("phoneNumber", "+1-555-0" + (100 + randomIndex));
        agent.put("vehicleType", vehicleTypes[randomIndex % vehicleTypes.length]);
        agent.put("rating", Math.round((4.0 + Math.random()) * 10.0) / 10.0); // 4.0-5.0 rating
        
        return agent;
    }
}
