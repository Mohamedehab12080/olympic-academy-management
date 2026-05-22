package bs.olympic.common.db.model.dto;

import bs.olympic.common.db.model.interfaces.OrderAttributes;
import bs.olympic.common.model.enums.DBErrors;
import bs.olympic.common.model.exception.BusinessException;
import lombok.Getter;
import lombok.extern.log4j.Log4j2;
import java.lang.reflect.ParameterizedType;
import java.lang.reflect.Type;

@Log4j2
@Getter
public class SortingInfo<SORTING_ATTR extends Enum<SORTING_ATTR> & OrderAttributes> {
    private final Boolean isApplied;
    private String by;
    private OrderDirections dir;

    public SortingInfo(String by, OrderDirections dir) {
        this.isApplied = (by != null && !by.isEmpty() && dir != null);

        if (!isApplied) {
            if ((by != null || dir != null))
                throw new BusinessException(DBErrors.INVALID_SORTING_PROVIDED);
            log.warn("Sorting is not applied, due to missing 'orderBy' or 'orderDir' values.");
        } else {
            this.by = by;
            this.dir = dir;
        }
    }

    public SortingInfo(SORTING_ATTR by, OrderDirections dir) {
        this(by.name(), dir);
    }

    @SuppressWarnings("unchecked")
    public OrderAttributes getOrderAttribute(Class<? extends SearchFilter<? extends OrderAttributes>> filterClass) {
        Type superClass = filterClass.getGenericSuperclass();
        if (superClass instanceof ParameterizedType parameterizedType) {
            Type type = parameterizedType.getActualTypeArguments()[0];
            return (OrderAttributes) Enum.valueOf((Class) type, this.by);
        }
        throw new IllegalStateException("Invalid SearchFilter Class: " + filterClass.getCanonicalName());
    }
}
