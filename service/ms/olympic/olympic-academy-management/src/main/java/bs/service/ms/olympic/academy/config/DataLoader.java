package bs.service.ms.olympic.academy.config;

import bs.service.employee.api.service.EmployeeService;
import bs.service.enrollment.api.service.EnrollmentService;
import bs.service.user.api.repository.UserRepository;
import bs.service.user.model.entity.User;
import bs.service.user.model.enums.Role;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.io.File;
import java.io.IOException;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;

@Slf4j
@Component
@RequiredArgsConstructor
public class DataLoader implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final EmployeeService employeeService;
    private final EnrollmentService enrollmentService;

    @Value("${spring.datasource.url}")
    private String datasourceUrl;

    @Value("${spring.datasource.username}")
    private String username;

    @Value("${spring.datasource.password}")
    private String password;

    private static final String BACKUP_PATH = "./backup";
    private static final String BACKUP_FILE = BACKUP_PATH + "/database_backup.sql";
    private static final int BACKUP_INTERVAL_DAYS = 30;
    private static final DateTimeFormatter DATE_FORMATTER = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");

    private String mysqldumpPath;

    @Override
    public void run(String... args) throws Exception {
        createSuperAdminIfNotExists();
        createAdminIfNotExists();
        createDemoUserIfNotExists();
        printDefaultUsers();
        runEmployeeSalaryUpdateIfEnabled();
        runEnrollmentActivationUpdate();
        performBackupIfNeeded();
    }

    /**
     * Create Super Admin user if not exists
     */
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

    /**
     * Create Admin user if not exists
     */
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

    /**
     * Create Demo User if not exists
     */
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
                    .isActive(true)
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

    /**
     * Print default users information
     */
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

    /**
     * Run enrollment activation update on startup
     */
    private void runEnrollmentActivationUpdate() {
        log.info("=".repeat(60));
        log.info("🔄 Running enrollment activation update on startup...");
        try {
            enrollmentService.updateEnrollmentsActivation();
            log.info("✅ Enrollment activation update completed successfully on startup");
        } catch (Exception e) {
            log.error("❌ Failed to update enrollment activation on startup", e);
        }
        log.info("=".repeat(60));
    }

    /**
     * Run employee salary update on startup
     */
    private void runEmployeeSalaryUpdateIfEnabled() {
        log.info("=".repeat(60));
        log.info("🔄 Running employee salary update on startup...");
        try {
            employeeService.updateEmployeeSalary();
            log.info("✅ Employee salary update completed successfully on startup");
        } catch (Exception e) {
            log.error("❌ Failed to update employee salaries on startup", e);
        }
        log.info("=".repeat(60));
    }

    // ==================== BACKUP METHODS ====================

    /**
     * Find mysqldump executable path on the system
     */
    private String findMysqldumpPath() {
        if (mysqldumpPath != null) {
            return mysqldumpPath;
        }

        // Common installation paths on Windows
        String[] possiblePaths = {
                "C:\\Program Files\\MySQL\\MySQL Server 8.0\\bin\\mysqldump.exe",
                "C:\\Program Files\\MySQL\\MySQL Server 5.7\\bin\\mysqldump.exe",
                "C:\\Program Files (x86)\\MySQL\\MySQL Server 8.0\\bin\\mysqldump.exe",
                "C:\\Program Files (x86)\\MySQL\\MySQL Server 5.7\\bin\\mysqldump.exe",
                "C:\\Program Files\\MySQL\\MySQL Workbench 8.0\\mysqldump.exe",
                "C:\\xampp\\mysql\\bin\\mysqldump.exe",
                "C:\\wamp64\\bin\\mysql\\mysql8.0.31\\bin\\mysqldump.exe",
                "C:\\laragon\\bin\\mysql\\mysql-8.0.30-winx64\\bin\\mysqldump.exe",
                "mysqldump" // Fallback if in PATH
        };

        for (String path : possiblePaths) {
            try {
                if (path.equals("mysqldump")) {
                    // Check if in PATH
                    Process p = Runtime.getRuntime().exec(new String[]{"where", "mysqldump"});
                    if (p.waitFor() == 0) {
                        mysqldumpPath = "mysqldump";
                        log.info("✅ Found mysqldump in system PATH");
                        return mysqldumpPath;
                    }
                } else {
                    File file = new File(path);
                    if (file.exists()) {
                        mysqldumpPath = path;
                        log.info("✅ Found mysqldump at: {}", path);
                        return mysqldumpPath;
                    }
                }
            } catch (Exception e) {
                // Continue searching
            }
        }

        log.warn("⚠️ mysqldump not found in common locations!");
        log.warn("   Please install MySQL Client or add it to system PATH.");
        return null;
    }

    /**
     * Check if backup is needed and perform it
     */
    private void performBackupIfNeeded() {
        log.info("=".repeat(60));
        log.info("📁 Checking database backup status...");

        try {
            // Check if mysqldump is available
            if (findMysqldumpPath() == null) {
                log.warn("⚠️ mysqldump not available. Skipping backup.");
                log.warn("   To enable backups, install MySQL Client or add it to PATH.");
                log.info("=".repeat(60));
                return;
            }

            File backupFile = new File(BACKUP_FILE);

            // If no backup exists, create one
            if (!backupFile.exists()) {
                log.info("📋 No existing backup found. Creating initial backup...");
                createDatabaseBackup();
                log.info("=".repeat(60));
                return;
            }

            // Check if backup is old enough
            long daysSinceLastBackup = daysSinceLastBackup(backupFile);
            LocalDateTime lastBackupTime = getLastBackupTime(backupFile);

            log.info("📅 Last backup was on: {}", lastBackupTime.format(DATE_FORMATTER));
            log.info("📊 Days since last backup: {} days", daysSinceLastBackup);

            if (daysSinceLastBackup >= BACKUP_INTERVAL_DAYS) {
                log.info("📋 Last backup is {} days old (threshold: {} days). Creating new backup...",
                        daysSinceLastBackup, BACKUP_INTERVAL_DAYS);
                createDatabaseBackup();
            } else {
                log.info("✅ Backup is recent enough ({} days old). No backup needed.",
                        daysSinceLastBackup);
                log.info("ℹ️ Next backup due in {} days",
                        BACKUP_INTERVAL_DAYS - daysSinceLastBackup);
            }

        } catch (Exception e) {
            log.error("❌ Error during backup check", e);
        }
        log.info("=".repeat(60));
    }

    /**
     * Calculate days since last backup
     */
    private long daysSinceLastBackup(File backupFile) {
        long lastModified = backupFile.lastModified();
        long now = System.currentTimeMillis();
        long diffInMillis = now - lastModified;
        return diffInMillis / (1000 * 60 * 60 * 24);
    }

    /**
     * Get last backup timestamp
     */
    private LocalDateTime getLastBackupTime(File backupFile) {
        long lastModified = backupFile.lastModified();
        return LocalDateTime.ofInstant(
                java.time.Instant.ofEpochMilli(lastModified),
                ZoneId.of("Africa/Cairo")
        );
    }

    /**
     * Create database backup
     */
    private void createDatabaseBackup() {
        log.info("🔄 Creating database backup...");
        long startTime = System.currentTimeMillis();

        try {
            // Create backup directory if it doesn't exist
            createBackupDirectory();

            // Delete old backup if exists
            deleteOldBackup();

            // Create new backup
            String databaseName = extractDatabaseName(datasourceUrl);
            boolean success = executeMysqlDump(databaseName);

            long duration = System.currentTimeMillis() - startTime;

            if (success) {
                File backupFile = new File(BACKUP_FILE);
                log.info("✅ Database backup created successfully!");
                log.info("   📁 Location: {}", BACKUP_FILE);
                log.info("   📊 Size: {} MB",
                        String.format("%.2f", backupFile.length() / (1024.0 * 1024.0)));
                log.info("   ⏱️  Duration: {} ms", duration);
                log.info("   📅 Created at: {}",
                        LocalDateTime.now(ZoneId.of("Africa/Cairo")).format(DATE_FORMATTER));
            } else {
                log.error("❌ Database backup failed after {} ms", duration);
            }

        } catch (Exception e) {
            log.error("❌ Error creating database backup", e);
        }
    }

    /**
     * Create backup directory if not exists
     */
    private void createBackupDirectory() {
        File backupDir = new File(BACKUP_PATH);
        if (!backupDir.exists()) {
            boolean created = backupDir.mkdirs();
            if (created) {
                log.info("📁 Backup directory created: {}", BACKUP_PATH);
            } else {
                log.error("❌ Failed to create backup directory: {}", BACKUP_PATH);
            }
        }
    }

    /**
     * Delete old backup file
     */
    private void deleteOldBackup() {
        File oldBackup = new File(BACKUP_FILE);
        if (oldBackup.exists()) {
            boolean deleted = oldBackup.delete();
            if (deleted) {
                log.info("🗑️ Old backup file deleted");
            }
        }
    }

    /**
     * Execute mysqldump command
     */
    private boolean executeMysqlDump(String databaseName) {
        String mysqldump = findMysqldumpPath();

        if (mysqldump == null) {
            log.error("❌ mysqldump not found. Cannot create database backup.");
            return false;
        }

        String[] command = {
                mysqldump,
                "-u", username,
                "-p" + password,
                "--add-drop-table",
                "--single-transaction",
                "--routines",
                "--triggers",
                "--skip-extended-insert",
                databaseName,
                "--result-file=" + BACKUP_FILE
        };

        try {
            log.info("🔧 Executing mysqldump for database: {}", databaseName);

            ProcessBuilder pb = new ProcessBuilder(command);
            pb.redirectErrorStream(true);
            Process process = pb.start();

            // Read output in separate thread to avoid blocking
            new Thread(() -> {
                try (java.io.BufferedReader reader = new java.io.BufferedReader(
                        new java.io.InputStreamReader(process.getInputStream()))) {
                    String line;
                    while ((line = reader.readLine()) != null) {
                        log.debug("mysqldump: {}", line);
                    }
                } catch (IOException e) {
                    // Ignore
                }
            }).start();

            int exitCode = process.waitFor();

            if (exitCode == 0) {
                File backupFile = new File(BACKUP_FILE);
                if (backupFile.exists() && backupFile.length() > 0) {
                    return true;
                } else {
                    log.error("❌ Backup file is empty or missing");
                    return false;
                }
            } else {
                log.error("❌ mysqldump failed with exit code: {}", exitCode);
                return false;
            }

        } catch (IOException | InterruptedException e) {
            log.error("❌ Error executing mysqldump", e);
            return false;
        }
    }

    /**
     * Extract database name from JDBC URL
     */
    private String extractDatabaseName(String url) {
        try {
            int lastSlash = url.lastIndexOf('/');
            if (lastSlash != -1) {
                String dbPart = url.substring(lastSlash + 1);
                int questionMark = dbPart.indexOf('?');
                if (questionMark != -1) {
                    return dbPart.substring(0, questionMark);
                }
                int semicolon = dbPart.indexOf(';');
                if (semicolon != -1) {
                    return dbPart.substring(0, semicolon);
                }
                return dbPart;
            }
        } catch (Exception e) {
            log.warn("⚠️ Could not extract database name from URL: {}", url);
        }
        return "database";
    }
}