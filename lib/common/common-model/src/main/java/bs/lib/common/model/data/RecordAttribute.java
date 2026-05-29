package bs.lib.common.model.data;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import bs.lib.common.model.interfaces.RecordAttributes;

import java.io.Serializable;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RecordAttribute implements Serializable {
    private RecordAttributes attributeKey;
    private String attributeValue;
}
