package bs.lib.rest.annotation.imports;

import org.springframework.context.annotation.Import;
import bs.lib.rest.annotation.config.RESTAdapterConfig;
import bs.lib.rest.annotation.config.RESTWebConfig;
import bs.lib.rest.core.error.RESTGlobalExceptionHandler;
import bs.lib.rest.core.filter.InitRequestContextRESTFilter;

import java.lang.annotation.*;

@Target(ElementType.TYPE)
@Retention(RetentionPolicy.RUNTIME)
@Documented
@Import(value = {ImportRESTAdapter.Root.class})
public @interface ImportRESTAdapter {

    @Import(value = {InitRequestContextRESTFilter.class, RESTGlobalExceptionHandler.class, RESTWebConfig.class,
            RESTAdapterConfig.class})
    class Root {

    }
}
