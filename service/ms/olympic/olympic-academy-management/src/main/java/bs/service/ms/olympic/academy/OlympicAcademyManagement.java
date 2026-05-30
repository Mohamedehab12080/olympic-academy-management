package bs.service.ms.olympic.academy;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@ComponentScan(basePackages = {"bs"})
@EntityScan(basePackages = {
        "bs.service.user.model.entity"
})
@EnableScheduling
public class OlympicAcademyManagement {

    public static void main(String[] args) {
        SpringApplication.run(OlympicAcademyManagement.class, args);
        System.out.println("========================================");
        System.out.println("Olympic Academy Management Started!");
        System.out.println("========================================");
    }
}
