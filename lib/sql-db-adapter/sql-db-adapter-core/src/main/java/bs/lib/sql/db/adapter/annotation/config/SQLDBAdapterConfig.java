package bs.lib.sql.db.adapter.annotation.config;

import jakarta.annotation.PostConstruct;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.PropertySource;
import org.springframework.context.annotation.PropertySources;
import bs.lib.sql.db.adapter.model.config.AbstractSQLDBAdapterConfig;
import bs.lib.sql.db.adapter.model.config.DBColumnConfig;
import bs.lib.sql.db.adapter.model.config.DBEntityConfig;
import bs.lib.sql.db.adapter.model.config.EvaluatedEntityConfig;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Configuration
@ConfigurationProperties(prefix = "bs.lib.sql-db-adapter")
@PropertySources({
        @PropertySource(value = "classpath:application.properties", ignoreResourceNotFound = true),
        @PropertySource(value = "classpath:config/library/sql-db-adapter.properties", encoding = "UTF-8", ignoreResourceNotFound = true)
})
public class SQLDBAdapterConfig extends AbstractSQLDBAdapterConfig {

    @PostConstruct
    public void initializeInterceptor() {

        for (Map.Entry<String, DBEntityConfig> entry : this.getEntities().entrySet()) {
            String entityName = entry.getKey();
            DBEntityConfig entityConfig = entry.getValue();

            if (entityConfig == null || entityConfig.getAttributes() == null) {
                continue;
            }

            List<String> uniqueFields = new ArrayList<>();
            List<String> nonUpdatableFields = new ArrayList<>();

            for (Map.Entry<String, DBColumnConfig> fieldEntry : entityConfig.getAttributes().entrySet()) {
                String fieldName = fieldEntry.getKey();
                DBColumnConfig fieldConfig = fieldEntry.getValue();

                if (Boolean.TRUE.equals(fieldConfig.getIsUnique()))
                    uniqueFields.add(fieldName);

                if (Boolean.FALSE.equals(fieldConfig.getIsUpdatable()))
                    nonUpdatableFields.add(fieldName);
            }

            EvaluatedEntityConfig evaluatedConfig = EvaluatedEntityConfig.builder()
                    .uniqueAttributes(uniqueFields).nonUpdateAttributes(nonUpdatableFields).build();
            this.getEvaluatedEntities().put(entityName, evaluatedConfig);
        }

    }
}
