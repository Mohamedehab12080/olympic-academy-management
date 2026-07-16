package bs.service.employee.scheduler;

import bs.service.employee.api.service.EmployeeService;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Component
@RequiredArgsConstructor
public class EmployeeSalaryUpdateScheduler {

    private final EmployeeService employeeService;

    @Scheduled(cron = "0 0 0 * * *", zone = "Africa/Cairo")
    @Transactional
    public void updateEmployeeSalary() {
        employeeService.updateEmployeeSalary();
    }
}
