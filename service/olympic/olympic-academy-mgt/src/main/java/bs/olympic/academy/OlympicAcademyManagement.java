package bs.olympic.academy;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@ComponentScan(basePackages = {"bs"})
@EntityScan(basePackages = {
        "bs.olympic.user.model.entity",
        "bs.destination.model.entity",
        "bs.wishlist.model.entity"
})
@EnableJpaRepositories(basePackages = {
        "bs.olympic.user.repository",
        "bs.destination.repository",
        "bs.wishlist.repository"
})
@EnableScheduling
public class OlympicAcademyManagement {

    public static void main(String[] args) {
        SpringApplication.run(FawryTravelPlannerManagement.class, args);
        System.out.println("========================================");
        System.out.println("Travel Destination Planner Started!");
        System.out.println("========================================");
    }
}