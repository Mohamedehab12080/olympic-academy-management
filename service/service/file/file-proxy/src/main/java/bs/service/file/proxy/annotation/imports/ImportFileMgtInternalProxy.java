package bs.service.file.proxy.annotation.imports;

import org.springframework.context.annotation.Import;
import bs.service.file.proxy.internal.FileMgtProxyInternalServiceImpl;

import java.lang.annotation.*;

@Target(ElementType.TYPE)
@Retention(RetentionPolicy.RUNTIME)
@Documented
@Import(value = {ImportFileMgtInternalProxy.Root.class})
public @interface  ImportFileMgtInternalProxy {

    @Import({FileMgtProxyInternalServiceImpl.class})
    class Root {}
}
