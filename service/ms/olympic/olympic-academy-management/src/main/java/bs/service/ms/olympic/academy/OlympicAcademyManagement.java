package bs.service.ms.olympic.academy;

import bs.lib.common.annotation.imports.ImportCommon;
import bs.lib.id.counter.annotation.ImportIdCounterCore;
import bs.lib.id.counter.annotation.ImportIdCounterRepository;
import bs.lib.rest.annotation.imports.ImportRESTAdapter;
import bs.lib.security.annotation.imports.ImportSecurityAdapter;
import bs.lib.service.context.annotation.imports.ImportServiceContextRepository;
import bs.lib.sql.db.adapter.annotation.imports.ImportSQLDBAdapter;
import bs.service.course.annotation.imports.ImportCourseCore;
import bs.service.course.annotation.imports.ImportCourseRepository;
import bs.service.department.annotation.imports.ImportDepartmentCore;
import bs.service.department.annotation.imports.ImportDepartmentRepository;
import bs.service.department.proxy.annotation.imports.ImportDepartmentMgtInternalProxy;
import bs.service.employee.annotation.imports.ImportEmployeeCore;
import bs.service.employee.annotation.imports.ImportEmployeeRepository;
import bs.service.enrollment.annotation.imports.ImportEnrollmentCore;
import bs.service.enrollment.annotation.imports.ImportEnrollmentRepository;
import bs.service.enrollment.proxy.annotation.imports.ImportInternalEnrollmentMgtProxy;
import bs.service.file.annotation.imports.ImportFileCore;
import bs.service.file.annotation.imports.ImportFileRepository;
import bs.service.file.proxy.annotation.imports.ImportInternalFileProxy;
import bs.service.financial.annotation.imports.ImportFinancialCore;
import bs.service.financial.annotation.imports.ImportFinancialRepository;
import bs.service.place.annotation.imports.ImportPlaceCore;
import bs.service.place.annotation.imports.ImportPlaceRepository;
import bs.service.trainee.annotation.imports.ImportTraineeCore;
import bs.service.trainee.annotation.imports.ImportTraineeRepository;
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

@ImportServiceContextRepository

@ImportUserCore
@ImportUserRepository

@ImportEmployeeCore
@ImportEmployeeRepository

@ImportTraineeCore
@ImportTraineeRepository

@ImportCourseCore
@ImportCourseRepository

@ImportEnrollmentCore
@ImportEnrollmentRepository
@ImportInternalEnrollmentMgtProxy

@ImportFileCore
@ImportFileRepository
@ImportInternalFileProxy

@ImportFinancialCore
@ImportFinancialRepository

@ImportPlaceCore
@ImportPlaceRepository

@ImportDepartmentCore
@ImportDepartmentRepository
@ImportDepartmentMgtInternalProxy

@ImportSQLDBAdapter

@ImportIdCounterCore
@ImportIdCounterRepository

@EnableScheduling
@SpringBootApplication

public class OlympicAcademyManagement {

    public static void main(String[] args) {
        SpringApplication.run(OlympicAcademyManagement.class, args);
        System.out.println("========================================");
        System.out.println("Olympic Academy Management Started!");
        System.out.println("========================================");
    }
}
