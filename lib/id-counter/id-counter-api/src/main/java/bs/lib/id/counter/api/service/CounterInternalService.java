package bs.lib.id.counter.api.service;

import bs.lib.common.model.data.RecordAttribute;
import bs.lib.id.counter.model.entity.Counter;

import java.util.List;

public interface CounterInternalService {
    Long getNextValue(Counter counter, List<RecordAttribute> attributes);
}
