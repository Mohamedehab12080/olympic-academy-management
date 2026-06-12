package bs.service.file.annotation.imports;

import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Import;
import bs.service.file.annotation.config.FileConfig;
import bs.service.file.annotation.config.MultipartWebConfig;

import java.lang.annotation.*;

@Target(ElementType.TYPE)
@Retention(RetentionPolicy.RUNTIME)
@Documented
@Import(value = {ImportFileCore.Root.class}) // create the anotation of file core which is used at the file-mgt
public @interface ImportFileCore {

    @Import({FileConfig.class , MultipartWebConfig.class})
    @ComponentScan(basePackages = {"bs.service.file.core",
                                   "bs.service.file.controller",
                                   "bs.service.file.scheduler"})
    class Root {

    }
}
