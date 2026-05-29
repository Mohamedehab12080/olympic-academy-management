package bs.lib.sql.db.adapter.annotation.imports;

import org.hibernate.cfg.AvailableSettings;
import org.springframework.boot.autoconfigure.orm.jpa.HibernatePropertiesCustomizer;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Import;
import bs.lib.sql.db.adapter.annotation.config.SQLDBAdapterConfig;
import bs.lib.sql.db.adapter.core.service.JpaServiceInterceptor;

import java.lang.annotation.*;
import java.util.Map;

@Target(ElementType.TYPE)
@Retention(RetentionPolicy.RUNTIME)
@Documented
@Import(ImportSQLDBAdapter.Root.class)
public @interface ImportSQLDBAdapter {

    @Configuration
    @Import({SQLDBAdapterConfig.class})
    @ComponentScan(basePackages = {"bs.lib.sql.db.adapter.core"})
    class Root {

        // Remove the JpaServiceInterceptor bean creation method since it's now a @Component

        @Bean
        public HibernatePropertiesCustomizer hibernatePropertiesCustomizer(JpaServiceInterceptor interceptor) {
            return (Map<String, Object> hibernateProperties) -> {
                hibernateProperties.put(AvailableSettings.INTERCEPTOR, interceptor);
            };
        }
    }
}
