package bs.service.user.annotation.imports;

import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Import;

import java.lang.annotation.*;

@Target(ElementType.TYPE)
@Retention(RetentionPolicy.RUNTIME)
@Documented
@Import(value = {ImportUserRepository.Root.class})
public @interface ImportUserRepository {

    @ComponentScan(basePackages = {"bs.service.user.repository"})
    class Root {
    }
}
