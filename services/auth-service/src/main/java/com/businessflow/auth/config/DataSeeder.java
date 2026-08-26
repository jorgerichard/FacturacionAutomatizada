package com.businessflow.auth.config;

import com.businessflow.auth.entity.UserEntity;
import com.businessflow.auth.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class DataSeeder {

    private static final Logger logger = LoggerFactory.getLogger(DataSeeder.class);

    @Bean
    CommandLineRunner seedData(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        return args -> {
            try {
                long count = userRepository.count();
                logger.info("Current user count in database: {}", count);
                
                if (count == 0) {
                    logger.info("Database is empty. Seeding default users...");
                    
                    UserEntity admin = new UserEntity(
                            "admin@businessflow.cl",
                            passwordEncoder.encode("demo123"),
                            "ADMIN"
                    );
                    userRepository.save(admin);
                    logger.info("Created admin user: admin@businessflow.cl");
                    
                    UserEntity user = new UserEntity(
                            "user@businessflow.cl",
                            passwordEncoder.encode("demo123"),
                            "USER"
                    );
                    userRepository.save(user);
                    logger.info("Created regular user: user@businessflow.cl");
                    
                    logger.info("Data seeding completed successfully!");
                } else {
                    logger.info("Database already has {} users. Skipping seeding.", count);
                }
            } catch (Exception e) {
                logger.error("Error during data seeding: ", e);
                throw e;
            }
        };
    }
}
