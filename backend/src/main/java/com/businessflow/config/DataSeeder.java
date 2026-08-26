package com.businessflow.config;

import com.businessflow.entity.CustomerEntity;
import com.businessflow.entity.InventoryItemEntity;
import com.businessflow.entity.InvoiceEntity;
import com.businessflow.entity.ProductEntity;
import com.businessflow.entity.QuotationEntity;
import com.businessflow.repository.CustomerRepository;
import com.businessflow.repository.CompanyRepository;
import com.businessflow.repository.InventoryRepository;
import com.businessflow.repository.InvoiceRepository;
import com.businessflow.repository.ProductRepository;
import com.businessflow.repository.QuotationRepository;
import com.businessflow.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;

@Configuration
public class DataSeeder {

    @Bean
    CommandLineRunner seedData(CustomerRepository customerRepository,
                               ProductRepository productRepository,
                               QuotationRepository quotationRepository,
                               InvoiceRepository invoiceRepository,
                               InventoryRepository inventoryRepository,
                               CompanyRepository companyRepository,
                               UserRepository userRepository,
                               PasswordEncoder passwordEncoder) {
        return args -> {
            if (customerRepository.count() == 0) {
                customerRepository.save(new CustomerEntity("Acme SpA", "76.123.456-7", "contacto@acme.cl"));
                customerRepository.save(new CustomerEntity("Beta Ltda", "77.654.321-0", "ventas@beta.cl"));
            }

            if (productRepository.count() == 0) {
                productRepository.save(new ProductEntity("Monitor 24", "MON-24", 189990.0));
                productRepository.save(new ProductEntity("Teclado Mecánico", "TEC-MEC", 89990.0));
                productRepository.save(new ProductEntity("Laptop Pro", "LAP-PRO", 899990.0));
            }

            if (quotationRepository.count() == 0) {
                quotationRepository.save(new QuotationEntity("Acme SpA", "Monitor 24", 2, 379980.0));
                quotationRepository.save(new QuotationEntity("Beta Ltda", "Laptop Pro", 1, 899990.0));
            }

            if (invoiceRepository.count() == 0) {
                invoiceRepository.save(new InvoiceEntity("Acme SpA", "FAC-001", "Emitida", 379980.0, "Pendiente", LocalDate.now().minusDays(5).format(DateTimeFormatter.ofPattern("dd/MM/yyyy"))));
                invoiceRepository.save(new InvoiceEntity("Beta Ltda", "FAC-002", "Pendiente", 899990.0, "Pendiente", LocalDate.now().plusDays(10).format(DateTimeFormatter.ofPattern("dd/MM/yyyy"))));
            }

            if (inventoryRepository.count() == 0) {
                inventoryRepository.save(new InventoryItemEntity("Monitor 24", "MON-24", 12, 179990.0));
                inventoryRepository.save(new InventoryItemEntity("Laptop Pro", "LAP-PRO", 5, 899990.0));
            }

            if (userRepository.count() == 0) {
                userRepository.save(new com.businessflow.entity.UserEntity(
                        "admin@businessflow.cl",
                        passwordEncoder.encode("demo123"),
                        "ADMIN"
                ));
                userRepository.save(new com.businessflow.entity.UserEntity(
                        "user@businessflow.cl",
                        passwordEncoder.encode("demo123"),
                        "USER"
                ));
            }
            if (companyRepository.count() == 0) {
                companyRepository.save(new com.businessflow.entity.CompanyEntity("BusinessFlow Demo Ltda", "76.543.210-9", "Av. Demo 123"));
            }
        };
    }
}
