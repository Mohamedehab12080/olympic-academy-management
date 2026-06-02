package bs.service.trainee.annotation.imports;

import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Import;

import java.lang.annotation.*;

@Target(ElementType.TYPE)
@Retention(RetentionPolicy.RUNTIME)
@Documented
@Import(value = {ImportTraineeCore.Root.class })
public @interface ImportTraineeCore {

    @ComponentScan(basePackages = {"bs.service.trainee.core", "bs.service.trainee.controller"})
    class Root {
    }
}