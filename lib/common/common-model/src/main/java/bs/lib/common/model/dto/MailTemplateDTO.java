package bs.lib.common.model.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.thymeleaf.context.Context;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MailTemplateDTO {
    private Context context;
    private String from;
    private String subject;
    private String to;
    private String templateName;
}
