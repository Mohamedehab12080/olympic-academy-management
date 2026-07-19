package bs.service.financial.annotation.imports;

import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Import;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

import java.lang.annotation.*;

@Target(ElementType.TYPE)
@Retention(RetentionPolicy.RUNTIME)
@Documented
@Import(value = {ImportFinancialRepository.Root.class})
public @interface ImportFinancialRepository {

    @EnableJpaRepositories(basePackages = {"bs.service.financial.repository.jpa"})
    @EntityScan(basePackages = {"bs.service.financial.model.entity"})
    @ComponentScan(basePackages = {"bs.service.financial.repository"})
    class Root {
    }
}
