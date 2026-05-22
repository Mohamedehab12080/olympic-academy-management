package bs.olympic.common.db.model.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class QBCondition {
    private String condition;
    private Object value;
    private String placeHolder;
}