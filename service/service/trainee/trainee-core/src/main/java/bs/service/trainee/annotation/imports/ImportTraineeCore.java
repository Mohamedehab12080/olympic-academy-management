package bs.service.trainee.annotation.imports;

import bs.service.trainee.annotation.config.TraineeConfig;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Import;

import java.lang.annotation.*;

@Target(ElementType.TYPE)
@Retention(RetentionPolicy.RUNTIME)
@Documented
@Import(value = {ImportTraineeCore.Root.class })
public @interface ImportTraineeCore {

    @Import({TraineeConfig.class})
    @ComponentScan(basePackages = {"bs.service.trainee.core", "bs.service.trainee.controller","bs.service.trainee.scheduler"})
    class Root {
    }
}