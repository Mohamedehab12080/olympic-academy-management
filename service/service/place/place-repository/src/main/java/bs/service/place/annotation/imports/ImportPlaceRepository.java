package bs.service.place.annotation.imports;

import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Import;

import java.lang.annotation.*;

@Target(ElementType.TYPE)
@Retention(RetentionPolicy.RUNTIME)
@Documented
@Import(value = {ImportPlaceRepository.Root.class})
public @interface ImportPlaceRepository {

    @ComponentScan(basePackages = {"bs.service.place.repository"})
    class Root {
    }
}