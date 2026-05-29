package bs.lib.sql.db.adapter.model.config;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DBColumnConfig {

   private String titleEn;
   private String titleAr;
   private Boolean isUnique=false;
   private Boolean isUpdatable=true;
   private DBOnEmptyColumnConfig onEmpty;
}
