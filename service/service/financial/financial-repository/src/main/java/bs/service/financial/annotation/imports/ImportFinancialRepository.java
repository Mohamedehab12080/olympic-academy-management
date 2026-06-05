package bs.service.financial.annotation.imports;

import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Import;

import java.lang.annotation.*;

@Target(ElementType.TYPE)
@Retention(RetentionPolicy.RUNTIME)
@Documented
@Import(value = {ImportFinancialRepository.Root.class})
public @interface ImportFinancialRepository {

    @ComponentScan(basePackages = {"bs.service.financial.repository"})
    class Root {
    }
}
