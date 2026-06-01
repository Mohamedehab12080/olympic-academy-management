package bs.service.department.proxy.annotation.imports;

import bs.service.department.proxy.internal.service.DepartmentMgtProxyInternalServiceImpl;
import org.springframework.context.annotation.Import;

import java.lang.annotation.*;

@Target(ElementType.TYPE)
@Retention(RetentionPolicy.RUNTIME)
@Documented
@Import(value = {ImportDepartmentMgtInternalProxy.Root.class})
public @interface ImportDepartmentMgtInternalProxy {

    @Import({DepartmentMgtProxyInternalServiceImpl.class})
    class Root {}
}