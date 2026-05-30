package bs.lib.id.counter.core.mapper;

import org.mapstruct.InjectionStrategy;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.ReportingPolicy;
import bs.lib.common.model.data.RecordAttribute;
import bs.lib.common.model.interfaces.RecordAttributes;
import bs.lib.id.counter.model.entity.Counter;
import bs.lib.id.counter.model.entity.CounterInstance;
import bs.lib.id.counter.model.entity.CounterInstanceAttribute;

import java.util.List;

@Mapper(componentModel = "spring",
        unmappedTargetPolicy = ReportingPolicy.IGNORE,
        injectionStrategy = InjectionStrategy.CONSTRUCTOR)
public abstract class CounterMapper {

    @Mapping(target = "counterLastValue", source = "counterStartingValue")
    @Mapping(target = "counter", source = "counter")
    @Mapping(target = "id", ignore = true)
    public abstract CounterInstance toCounterInstance(Counter counter);

    //    @Mapping(target = "attributeKey", source = "dto.attributeKey", qualifiedByName = "toAttributeKey")
//    @Mapping(target = "attributeValue", source = "dto.attributeValue")
    public abstract CounterInstanceAttribute toCounterInstanceAttribute(RecordAttribute dto);

    public abstract List<CounterInstanceAttribute> toCounterInstanceAttributes(List<RecordAttribute> dtos);

    //    @Named("toAttributeKey")
    public String toAttributeKey(RecordAttributes attributeKey) {
        if (attributeKey == null)
            return null;
        return attributeKey.name();
    }
}
