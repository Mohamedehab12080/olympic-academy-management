package bs.service.file.proxy.annotation.imports;

import org.springframework.context.annotation.Import;
import bs.service.file.proxy.internal.service.InternalFileMgtProxyService;

import java.lang.annotation.*;

@Target(ElementType.TYPE)
@Retention(RetentionPolicy.RUNTIME)
@Documented
@Import(value = {ImportInternalFileProxy.Root.class})
public @interface ImportInternalFileProxy {

    @Import({InternalFileMgtProxyService.class})
    class Root {

    }
}