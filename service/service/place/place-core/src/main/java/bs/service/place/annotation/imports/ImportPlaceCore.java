package bs.service.place.annotation.imports;

import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Import;

import java.lang.annotation.*;

@Target(ElementType.TYPE)
@Retention(RetentionPolicy.RUNTIME)
@Documented
@Import(value = {ImportPlaceCore.Root.class })
public @interface ImportPlaceCore {

    @ComponentScan(basePackages = {"bs.service.place.core", "bs.service.place.controller"})
    class Root {
    }
}