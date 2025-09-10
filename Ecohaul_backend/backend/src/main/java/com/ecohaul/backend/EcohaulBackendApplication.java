package com.ecohaul.backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;

@SpringBootApplication
@ComponentScan(basePackages = "com.ecohaul.backend")
public class EcohaulBackendApplication {

	public static void main(String[] args) {
		SpringApplication.run(EcohaulBackendApplication.class, args);
	}

}
