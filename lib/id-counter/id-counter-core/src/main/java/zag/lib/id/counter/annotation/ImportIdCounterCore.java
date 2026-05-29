package bs.lib.id.counter.annotation;

import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Import;

import java.lang.annotation.*;

@Target(ElementType.TYPE)
@Retention(RetentionPolicy.RUNTIME)
@Documented
@Import(ImportIdCounterCore.Root.class)
public @interface ImportIdCounterCore {

    @ComponentScan(basePackages = {"bs.lib.id.counter.core"})
    class Root {
    }
}
