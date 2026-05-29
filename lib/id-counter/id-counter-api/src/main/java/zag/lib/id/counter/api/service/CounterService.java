package bs.lib.id.counter.api.service;

import bs.lib.common.model.data.RecordAttribute;
import bs.lib.id.counter.model.entity.Counter;
import bs.lib.id.counter.model.interfaces.CounterTypes;

import java.util.List;

public interface CounterService {
    Long getNextValue(CounterTypes counterType, List<RecordAttribute> attributes);
    Long getNextValue(CounterTypes counterType);

    String getNextValueAsString(CounterTypes counterType, List<RecordAttribute> attributes);

    String getNextValueAsString(CounterTypes counterType);

}
