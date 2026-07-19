package bs.lib.json.adapter.annotation.imports;

import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Import;
import bs.lib.json.adapter.annotation.config.JsonAdapterConfig;

import java.lang.annotation.*;

@Target(ElementType.TYPE)
@Retention(RetentionPolicy.RUNTIME)
@Documented
@Import(ImportJSONAdapter.Root.class)
public @interface ImportJSONAdapter {

    @Import({JsonAdapterConfig.class})
    @ComponentScan(basePackages = {"bs.lib.json.adapter.core.service"})
    class Root {}
}
