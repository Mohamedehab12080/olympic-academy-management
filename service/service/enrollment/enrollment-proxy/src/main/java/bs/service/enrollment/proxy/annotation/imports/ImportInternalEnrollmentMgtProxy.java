package bs.service.enrollment.proxy.annotation.imports;

import bs.service.enrollment.proxy.internal.service.EnrollmentMgtProxyServiceImpl;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Import;
import java.lang.annotation.*;

@Target(ElementType.TYPE)
@Retention(RetentionPolicy.RUNTIME)
@Documented
@Import(value = {ImportInternalEnrollmentMgtProxy.Root.class})
public @interface ImportInternalEnrollmentMgtProxy {

    @ComponentScan(basePackages = {"bs.service.enrollment.proxy.internal"})
    @Import({EnrollmentMgtProxyServiceImpl.class})
    class Root {
    }

}
