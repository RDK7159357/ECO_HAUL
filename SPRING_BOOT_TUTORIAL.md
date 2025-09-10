# 🎓 EcoHaul Spring Boot Backend Tutorial
## A Complete Guide for Building Your First Spring Boot API

Welcome to your Spring Boot journey! I'll guide you through building a professional backend for EcoHaul, teaching you concepts step by step.

---

## 📚 **Chapter 1: Understanding Spring Boot Fundamentals**

### **What is Spring Boot?**
Spring Boot is a framework that makes it easy to create Java applications with minimal configuration. Think of it as a "ready-to-use kitchen" for building web applications.

**Key Concepts:**
- **Auto-configuration**: Spring Boot automatically sets up common configurations
- **Starter dependencies**: Pre-packaged sets of dependencies for specific features
- **Embedded server**: No need to deploy to external servers
- **Production-ready**: Built-in health checks, metrics, and monitoring

### **Why Spring Boot for EcoHaul?**
- **Scalability**: Handle millions of waste detection requests
- **Security**: Built-in authentication and authorization
- **Database Integration**: Easy connection to PostgreSQL/MySQL
- **API Development**: Perfect for REST APIs your mobile app needs
- **Enterprise Features**: Caching, monitoring, logging

---

## 🏗️ **Chapter 2: Project Architecture for EcoHaul**

### **Backend Requirements Analysis**
Based on your frontend, we need:

1. **User Management**
   - User registration/login
   - Profile management
   - Authentication tokens

2. **Waste Detection API**
   - Image upload endpoints
   - AI detection processing
   - Detection history storage

3. **Learning System**
   - User feedback collection
   - Learning data analysis
   - Accuracy tracking

4. **Disposal Centers**
   - Location-based search
   - Center information management
   - Reviews and ratings

5. **Analytics & Gamification**
   - User statistics
   - Leaderboards
   - Achievement tracking

### **Recommended Architecture**
```
┌─────────────────────────────────────────────────────────────┐
│                     React Native App                        │
└─────────────────────┬───────────────────────────────────────┘
                      │ HTTP/REST API
┌─────────────────────▼───────────────────────────────────────┐
│                 Spring Boot Backend                         │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────────────┐   │
│  │ Controllers │ │  Services   │ │    Repositories     │   │
│  │   (API)     │ │ (Business)  │ │    (Database)       │   │
│  └─────────────┘ └─────────────┘ └─────────────────────┘   │
└─────────────────────┬───────────────────────────────────────┘
                      │
┌─────────────────────▼───────────────────────────────────────┐
│                    PostgreSQL Database                      │
└─────────────────────────────────────────────────────────────┘
```

---

## 🚀 **Chapter 3: Setting Up Your Development Environment**

### **Prerequisites**
1. **Java 17 or higher** (Check: `java -version`)
2. **Maven** (Build tool - Check: `mvn -version`)
3. **IDE**: IntelliJ IDEA Community (recommended) or VS Code
4. **Database**: PostgreSQL or MySQL

### **Step 1: Create Your First Spring Boot Project**

We'll use Spring Initializr to bootstrap your project:

1. Go to [start.spring.io](https://start.spring.io)
2. Configure:
   - **Project**: Maven Project
   - **Language**: Java
   - **Spring Boot**: 3.1.x (latest stable)
   - **Group**: com.ecohaul
   - **Artifact**: ecohaul-backend
   - **Name**: EcoHaul Backend
   - **Package name**: com.ecohaul.backend
   - **Packaging**: Jar
   - **Java**: 17

3. **Dependencies to add:**
   - Spring Web (for REST APIs)
   - Spring Data JPA (for database operations)
   - PostgreSQL Driver (or MySQL)
   - Spring Security (for authentication)
   - Spring Boot DevTools (for development)
   - Validation (for input validation)

### **Step 2: Project Structure Explanation**
```
ecohaul-backend/
├── src/
│   ├── main/
│   │   ├── java/com/ecohaul/backend/
│   │   │   ├── EcohaulBackendApplication.java  // Main class
│   │   │   ├── controller/                     // REST endpoints
│   │   │   ├── service/                        // Business logic
│   │   │   ├── repository/                     // Database access
│   │   │   ├── model/                         // Data entities
│   │   │   ├── dto/                           // Data transfer objects
│   │   │   └── config/                        // Configuration classes
│   │   └── resources/
│   │       ├── application.yml                // Configuration
│   │       └── static/                        // Static files
│   └── test/                                  // Unit tests
├── pom.xml                                    // Dependencies
└── README.md
```

---

## 📝 **Chapter 4: Your First REST API**

### **Lesson 1: Understanding Controllers**

A **Controller** is like a receptionist - it receives requests and directs them to the right place.

**Create your first controller:**

```java
package com.ecohaul.backend.controller;

import org.springframework.web.bind.annotation.*;

@RestController  // Tells Spring this class handles HTTP requests
@RequestMapping("/api/v1")  // Base URL for all endpoints in this controller
public class HealthController {
    
    @GetMapping("/health")  // Handles GET requests to /api/v1/health
    public String healthCheck() {
        return "EcoHaul Backend is running! 🌱";
    }
    
    @GetMapping("/info")
    public Map<String, Object> getInfo() {
        Map<String, Object> info = new HashMap<>();
        info.put("app", "EcoHaul Backend");
        info.put("version", "1.0.0");
        info.put("timestamp", new Date());
        return info;  // Spring automatically converts to JSON
    }
}
```

**Key Annotations Explained:**
- `@RestController`: Combines `@Controller` + `@ResponseBody`
- `@RequestMapping`: Maps URLs to controller methods
- `@GetMapping`: Handles HTTP GET requests
- `@PostMapping`: Handles HTTP POST requests (we'll use this for data creation)

### **Lesson 2: Running Your Application**

```bash
# Navigate to your project directory
cd ecohaul-backend

# Run the application
mvn spring-boot:run
```

Your app will start on `http://localhost:8080`

Test your endpoints:
- `GET http://localhost:8080/api/v1/health`
- `GET http://localhost:8080/api/v1/info`

---

## 📊 **Chapter 5: Database Integration**

### **Lesson 1: Understanding JPA and Entities**

**JPA (Java Persistence API)** is like a translator between Java objects and database tables.

**Create your first entity (User):**

```java
package com.ecohaul.backend.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity  // Tells JPA this is a database table
@Table(name = "users")  // Table name in database
public class User {
    
    @Id  // Primary key
    @GeneratedValue(strategy = GenerationType.IDENTITY)  // Auto-increment
    private Long id;
    
    @Column(unique = true, nullable = false)  // Email must be unique
    private String email;
    
    @Column(nullable = false)
    private String password;
    
    @Column(name = "full_name")
    private String fullName;
    
    private String phone;
    
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    // Constructors
    public User() {
        this.createdAt = LocalDateTime.now();
    }
    
    public User(String email, String password, String fullName) {
        this();
        this.email = email;
        this.password = password;
        this.fullName = fullName;
    }
    
    // Getters and Setters (essential for JPA)
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    
    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
    
    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }
    
    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }
    
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
```

### **Lesson 2: Repository Pattern**

**Repository** is like a librarian - it knows how to find and store data.

```java
package com.ecohaul.backend.repository;

import com.ecohaul.backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    
    // Spring automatically implements these methods!
    Optional<User> findByEmail(String email);
    
    boolean existsByEmail(String email);
    
    // Custom query example
    @Query("SELECT u FROM User u WHERE u.fullName LIKE %:name%")
    List<User> findByFullNameContaining(@Param("name") String name);
}
```

**Magic of Spring Data JPA:**
- `JpaRepository<User, Long>` gives you: save(), findById(), findAll(), delete(), etc.
- Method names like `findByEmail` automatically generate SQL queries!

---

## 🎯 **Chapter 6: Building EcoHaul Specific APIs**

### **User Registration API**

**Step 1: Create DTOs (Data Transfer Objects)**

DTOs define the structure of data sent between your app and backend:

```java
package com.ecohaul.backend.dto;

import jakarta.validation.constraints.*;

public class UserRegistrationDto {
    
    @NotBlank(message = "Email is required")
    @Email(message = "Email should be valid")
    private String email;
    
    @NotBlank(message = "Password is required")
    @Size(min = 6, message = "Password must be at least 6 characters")
    private String password;
    
    @NotBlank(message = "Full name is required")
    private String fullName;
    
    private String phone;
    
    // Constructors, getters, and setters...
}

public class UserResponseDto {
    private Long id;
    private String email;
    private String fullName;
    private String phone;
    private LocalDateTime createdAt;
    
    // Constructors, getters, and setters...
}
```

**Step 2: Create Service Layer**

```java
package com.ecohaul.backend.service;

import com.ecohaul.backend.dto.*;
import com.ecohaul.backend.model.User;
import com.ecohaul.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service  // Marks this as a business logic component
public class UserService {
    
    @Autowired  // Spring automatically injects dependencies
    private UserRepository userRepository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;
    
    public UserResponseDto registerUser(UserRegistrationDto registrationDto) {
        // Check if user already exists
        if (userRepository.existsByEmail(registrationDto.getEmail())) {
            throw new RuntimeException("Email already registered");
        }
        
        // Create new user
        User user = new User();
        user.setEmail(registrationDto.getEmail());
        user.setPassword(passwordEncoder.encode(registrationDto.getPassword()));
        user.setFullName(registrationDto.getFullName());
        user.setPhone(registrationDto.getPhone());
        
        // Save to database
        User savedUser = userRepository.save(user);
        
        // Convert to response DTO
        return convertToResponseDto(savedUser);
    }
    
    private UserResponseDto convertToResponseDto(User user) {
        UserResponseDto dto = new UserResponseDto();
        dto.setId(user.getId());
        dto.setEmail(user.getEmail());
        dto.setFullName(user.getFullName());
        dto.setPhone(user.getPhone());
        dto.setCreatedAt(user.getCreatedAt());
        return dto;
    }
}
```

**Step 3: Create Controller**

```java
package com.ecohaul.backend.controller;

import com.ecohaul.backend.dto.*;
import com.ecohaul.backend.service.UserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/users")
@CrossOrigin(origins = "*")  // Allow requests from your React Native app
public class UserController {
    
    @Autowired
    private UserService userService;
    
    @PostMapping("/register")
    public ResponseEntity<UserResponseDto> registerUser(
            @Valid @RequestBody UserRegistrationDto registrationDto) {
        
        try {
            UserResponseDto user = userService.registerUser(registrationDto);
            return new ResponseEntity<>(user, HttpStatus.CREATED);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(null, HttpStatus.BAD_REQUEST);
        }
    }
}
```

---

## 🧪 **Chapter 7: Testing Your API**

### **Using Postman or curl**

**Test User Registration:**
```bash
curl -X POST http://localhost:8080/api/v1/users/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123",
    "fullName": "John Doe",
    "phone": "+1234567890"
  }'
```

Expected Response:
```json
{
  "id": 1,
  "email": "john@example.com",
  "fullName": "John Doe",
  "phone": "+1234567890",
  "createdAt": "2025-09-10T10:30:00"
}
```

---

## 📋 **Next Steps: Your Learning Path**

### **Immediate Goals (Week 1-2):**
1. ✅ Set up Spring Boot project
2. ✅ Create basic REST endpoints
3. ✅ Set up database connection
4. ✅ Implement user registration
5. 🎯 Add user authentication (JWT tokens)
6. 🎯 Create detection history API

### **Intermediate Goals (Week 3-4):**
1. 🎯 File upload for waste images
2. 🎯 Disposal center management
3. 🎯 Learning feedback system
4. 🎯 Basic security implementation

### **Advanced Goals (Week 5-6):**
1. 🎯 Analytics and statistics
2. 🎯 Leaderboard system
3. 🎯 Push notifications
4. 🎯 Performance optimization

---

## 🤔 **Common Beginner Questions**

### **Q: What's the difference between @Service and @Repository?**
- **@Repository**: Data access layer (talks to database)
- **@Service**: Business logic layer (processes data)
- **@Controller**: Presentation layer (handles HTTP requests)

### **Q: Why use DTOs instead of entities directly?**
- **Security**: Don't expose sensitive fields (like passwords)
- **Flexibility**: Different views of the same data
- **Validation**: Custom validation rules for input

### **Q: How does Spring Boot "magic" work?**
- **Auto-configuration**: Spring Boot scans your classpath and automatically configures beans
- **Annotations**: Tell Spring what each class does
- **Dependency Injection**: Spring manages object creation and dependencies

---

## 📚 **Resources for Continued Learning**

1. **Official Spring Boot Documentation**: https://spring.io/projects/spring-boot
2. **Spring Boot Guides**: https://spring.io/guides
3. **Baeldung Spring Tutorials**: https://www.baeldung.com/spring-boot
4. **YouTube**: "Spring Boot Tutorial for Beginners"

---

## 🎯 **Ready to Start?**

Let's begin with creating your Spring Boot project! I'll guide you through each step and explain every concept as we build your EcoHaul backend together.

**Which aspect would you like to start with first?**
1. 🚀 Setting up the initial project
2. 🔧 Database configuration
3. 👥 User management system
4. 📸 Image upload for waste detection
5. 🏢 Disposal center management

Let me know, and we'll dive deep into that topic!
