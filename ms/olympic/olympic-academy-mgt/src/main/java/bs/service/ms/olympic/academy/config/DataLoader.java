package bs.service.ms.olympic.academy.config;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@RequiredArgsConstructor
public class DataLoader implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        createSuperAdminIfNotExists();
        createAdminIfNotExists();
        createDemoUserIfNotExists();
        printDefaultUsers();
    }

    private void createSuperAdminIfNotExists() {
        String superAdminEmail = "mohamedehab12080@gmail.com";

        if (!userRepository.existsByEmail(superAdminEmail)) {
            log.info("=".repeat(60));
            log.info("Creating Super Admin user...");

            User superAdmin = User.builder()
                    .email(superAdminEmail)
                    .password(passwordEncoder.encode("25251436Mh%"))
                    .fullName("Mohamed Ehab")
                    .mobileNumber("+201234567890")
                    .role(Role.ROLE_SUPER_ADMIN)
                    .isActive(true)
                    .build();

            userRepository.insert(superAdmin);
            log.info("✅ Super Admin created successfully!");
            log.info("   Email: {}", superAdminEmail);
            log.info("   Password: 25251436Mh%");
            log.info("   Role: SUPER_ADMIN");
            log.info("=".repeat(60));
        } else {
            log.info("✅ Super Admin already exists: {}", superAdminEmail);
        }
    }

    private void createAdminIfNotExists() {
        String adminEmail = "m.ehab.rabea@gmail.com";

        if (!userRepository.existsByEmail(adminEmail)) {
            log.info("=".repeat(60));
            log.info("Creating Admin user...");

            User admin = User.builder()
                    .email(adminEmail)
                    .password(passwordEncoder.encode("25251436Mh%"))
                    .fullName("Mohamed Ehab Rabea")
                    .mobileNumber("+201234567891")
                    .role(Role.ROLE_ADMIN)
                    .isActive(true)
                    .build();

            userRepository.insert(admin);
            log.info("✅ Admin created successfully!");
            log.info("   Email: {}", adminEmail);
            log.info("   Password: 25251436Mh%");
            log.info("   Role: ADMIN");
            log.info("=".repeat(60));
        } else {
            log.info("✅ Admin already exists: {}", adminEmail);
        }
    }

    private void createDemoUserIfNotExists() {
        String demoUserEmail = "demo@travelplanner.com";

        if (!userRepository.existsByEmail(demoUserEmail)) {
            log.info("=".repeat(60));
            log.info("Creating Demo User...");

            User demoUser = User.builder()
                    .email(demoUserEmail)
                    .password(passwordEncoder.encode("Demo@123"))
                    .fullName("Demo User")
                    .mobileNumber("+201234567892")
                    .role(Role.ROLE_USER)
                    .isActive(true)  // Auto-activated for demo
                    .build();

            userRepository.insert(demoUser);
            log.info("✅ Demo User created successfully!");
            log.info("   Email: {}", demoUserEmail);
            log.info("   Password: Demo@123");
            log.info("   Role: USER");
            log.info("=".repeat(60));
        } else {
            log.info("✅ Demo User already exists: {}", demoUserEmail);
        }
    }

    private void printDefaultUsers() {
        log.info("");
        log.info("📋 ========== DEFAULT USERS ==========");
        log.info("");
        log.info("🔴 SUPER ADMIN:");
        log.info("   Email: mohamedehab12080@gmail.com");
        log.info("   Password: 25251436Mh%");
        log.info("");
        log.info("🔵 ADMIN:");
        log.info("   Email: m.ehab.rabea@gmail.com");
        log.info("   Password: 25251436Mh%");
        log.info("");
        log.info("🟢 DEMO USER (for testing):");
        log.info("   Email: demo@travelplanner.com");
        log.info("   Password: Demo@123");
        log.info("");
        log.info("=====================================");
        log.info("");
        log.info("💡 Tip: Regular users can register via the registration page.");
        log.info("   Activation email will be sent to their email address.");
        log.info("");
    }
}
