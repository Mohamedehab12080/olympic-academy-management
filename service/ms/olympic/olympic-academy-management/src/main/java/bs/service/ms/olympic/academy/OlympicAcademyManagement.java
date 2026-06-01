package bs.service.ms.olympic.academy;

import bs.lib.common.annotation.imports.ImportCommon;
import bs.lib.id.counter.annotation.ImportIdCounterCore;
import bs.lib.id.counter.annotation.ImportIdCounterRepository;
import bs.lib.rest.annotation.imports.ImportRESTAdapter;
import bs.lib.security.annotation.imports.ImportSecurityAdapter;
import bs.lib.sql.db.adapter.annotation.imports.ImportSQLDBAdapter;
import bs.service.course.annotation.imports.ImportCourseCore;
import bs.service.course.annotation.imports.ImportCourseRepository;
import bs.service.department.annotation.imports.ImportDepartmentCore;
import bs.service.department.annotation.imports.ImportDepartmentRepository;
import bs.service.department.proxy.annotation.imports.ImportDepartmentMgtInternalProxy;
import bs.service.user.annotation.imports.ImportUserCore;
import bs.service.user.annotation.imports.ImportUserRepository;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.scheduling.annotation.EnableScheduling;

@ImportCommon
@ImportRESTAdapter
@ImportSecurityAdapter

@ImportUserCore
@ImportUserRepository

@ImportCourseCore
@ImportCourseRepository

@ImportDepartmentCore
@ImportDepartmentRepository
@ImportDepartmentMgtInternalProxy

@ImportSQLDBAdapter

@ImportIdCounterCore
@ImportIdCounterRepository

@EnableScheduling
@SpringBootApplication
@EnableJpaRepositories(basePackages = {
        "bs.service.user.repository",
        "bs.service.course.repository",
        "bs.service.department.repository",
        "bs.lib.id.counter.repository"
})
@EntityScan(basePackages = {
        "bs.service.user.model.entity",
        "bs.service.course.model.entity",
        "bs.service.department.model.entity",
        "bs.lib.id.counter.model.entity"
})public class OlympicAcademyManagement {

    public static void main(String[] args) {
        SpringApplication.run(OlympicAcademyManagement.class, args);
        System.out.println("========================================");
        System.out.println("Olympic Academy Management Started!");
        System.out.println("========================================");
    }
}
