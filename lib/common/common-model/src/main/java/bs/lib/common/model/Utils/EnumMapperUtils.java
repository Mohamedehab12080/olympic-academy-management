package bs.lib.common.model.Utils;

import bs.lib.common.model.generated.LookupVTO;
import bs.lib.common.model.interfaces.EnumWithIdAndTitle;

public class EnumMapperUtils {

    // Convert ID to LookupVTO (for API responses)
    public static LookupVTO toLookupVTO(Integer id, Class<? extends EnumWithIdAndTitle> enumClass) {
        if (id == null) {
            return null;
        }
        for (EnumWithIdAndTitle enumValue : enumClass.getEnumConstants()) {
            if (enumValue.getId().equals(id)) {
                return LookupVTO.builder()
                        .id(enumValue.getId())
                        .title(enumValue.getTitle())
                        .build();
            }
        }
        return null;
    }

    // Convert ID to Enum (for internal use)
    public static <T extends EnumWithIdAndTitle> T toEnum(Integer id, Class<T> enumClass) {
        if (id == null) {
            return null;
        }
        for (T enumValue : enumClass.getEnumConstants()) {
            if (enumValue.getId().equals(id)) {
                return enumValue;
            }
        }
        return null;
    }

    // Convert Enum to LookupVTO (alternative)
    public static LookupVTO toLookupVTO(EnumWithIdAndTitle enumValue) {
        if (enumValue == null) {
            return null;
        }
        return LookupVTO.builder()
                .id(enumValue.getId())
                .title(enumValue.getTitle())
                .build();
    }
}