package bs.lib.common.model.enums;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public enum AppLanguages {
    EN("En"), AR("Ar");

    private final String attributePostfix;

    public static AppLanguages defaultLanguage() {
        return EN;
    }
}
