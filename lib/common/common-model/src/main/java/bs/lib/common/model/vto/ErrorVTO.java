package bs.lib.common.model.vto;

import bs.olympic.common.model.interfaces.Errors;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.text.MessageFormat;
import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ErrorVTO {
    private String code;
    private String messageEn;
    private List<String> reqBodyErrors;

    public static ErrorVTO of(Errors error) {
        return ErrorVTO.builder().code(error.domain().name() + "-" + error.code())
                .messageEn(error.messageEn()).build();
    }

    public static ErrorVTO of(Errors error, Object[] args) {
        return ErrorVTO.builder().code(error.domain().name() + "-" + error.code())
                .messageEn(MessageFormat.format(error.messageEn(), args)).build();
    }
}
