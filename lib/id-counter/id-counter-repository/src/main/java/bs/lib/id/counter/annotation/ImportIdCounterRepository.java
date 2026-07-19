package bs.lib.id.counter.annotation;

import jakarta.persistence.EntityManagerFactory;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.boot.orm.jpa.EntityManagerFactoryBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Import;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.orm.jpa.JpaTransactionManager;
import org.springframework.orm.jpa.LocalContainerEntityManagerFactoryBean;
import org.springframework.transaction.PlatformTransactionManager;

import javax.sql.DataSource;
import java.lang.annotation.*;

import static bs.lib.id.counter.model.config.IdCounterVariables.*;

@Target(ElementType.TYPE)
@Retention(RetentionPolicy.RUNTIME)
@Documented
@Import(value = {ImportIdCounterRepository.Root.class})
public @interface ImportIdCounterRepository {

    @EnableJpaRepositories(basePackages = {"bs.lib.id.counter.repository.jpa"})
    @EntityScan(basePackages = {"bs.lib.id.counter.model.entity"})
    @ComponentScan(basePackages = {"bs.lib.id.counter.repository"})
    class Root {
    }
}
