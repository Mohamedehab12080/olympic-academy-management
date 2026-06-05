package bs.service.financial.annotation.imports;

import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Import;

import java.lang.annotation.*;

@Target(ElementType.TYPE)
@Retention(RetentionPolicy.RUNTIME)
@Documented
@Import(value = {ImportFinancialCore.Root.class })
public @interface ImportFinancialCore {

    @ComponentScan(basePackages = {"bs.service.financial.core", "bs.service.financial.controller"})
    class Root {
    }
}
