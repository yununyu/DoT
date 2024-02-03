package com.dot.tour_info_service_server;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication
@EnableJpaAuditing
@EnableJpaRepositories(basePackages = "com.dot.tour_info_service_server.repository")
public class TourInfoServiceServerApplication {

	public static void main(String[] args) {
		SpringApplication.run(TourInfoServiceServerApplication.class, args);
		System.out.println("http://localhost:8080");
	}

}
