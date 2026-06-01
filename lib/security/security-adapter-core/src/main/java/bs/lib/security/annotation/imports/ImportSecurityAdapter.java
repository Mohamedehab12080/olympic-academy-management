package bs.lib.security.annotation.imports;

import bs.lib.security.annotation.config.SecurityConfig;
import bs.lib.security.model.config.SecurityConstants;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Import;
import java.lang.annotation.*;

@Target(ElementType.TYPE)
@Retention(RetentionPolicy.RUNTIME)
@Documented
@Import(value = {ImportSecurityAdapter.Root.class})
public @interface ImportSecurityAdapter {

    @Import(value = {SecurityConfig.class, SecurityConstants.class})
    @ComponentScan(basePackages = {"bs.lib.security.core"})
    class Root {

    }
}
