package bs.lib.security.annotation.imports;

import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Import;
import bs.lib.security.annotation.config.SecurityConfiguration;
import bs.lib.security.core.filter.AuthenticationRESTFilter;

import java.lang.annotation.*;

@Target(ElementType.TYPE)
@Retention(RetentionPolicy.RUNTIME)
@Documented
@Import(value = {ImportSecurityAdapter.Root.class})
public @interface ImportSecurityAdapter {

    @ImportSecurityUtilities
    @Import(value = {SecurityConfiguration.class, AuthenticationRESTFilter.class})
    @ComponentScan(basePackages = {"bs.lib.security.core.service", "bs.lib.security.core.mapper"})
    class Root {

    }
}
