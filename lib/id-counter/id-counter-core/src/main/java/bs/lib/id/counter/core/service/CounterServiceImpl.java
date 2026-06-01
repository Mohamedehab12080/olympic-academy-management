package bs.lib.id.counter.core.service;

import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import bs.lib.common.model.data.RecordAttribute;
import bs.lib.common.model.exception.BusinessException;
import bs.lib.id.counter.api.repository.CounterInstanceAttributeRepository;
import bs.lib.id.counter.api.repository.CounterInstanceRepository;
import bs.lib.id.counter.api.repository.CounterRepository;
import bs.lib.id.counter.api.service.CounterInternalService;
import bs.lib.id.counter.api.service.CounterService;
import bs.lib.id.counter.core.mapper.CounterMapper;
import bs.lib.id.counter.model.entity.Counter;
import bs.lib.id.counter.model.entity.CounterAttribute;
import bs.lib.id.counter.model.entity.CounterInstance;
import bs.lib.id.counter.model.entity.CounterInstanceAttribute;
import bs.lib.id.counter.model.interfaces.CounterTypes;


import java.util.List;

import static bs.lib.id.counter.model.enums.CounterErrors.COUNTER_NOT_FOUND;
import static bs.lib.id.counter.model.enums.CounterErrors.MISSED_ATTRIBUTE;

@Service
@AllArgsConstructor
public class CounterServiceImpl implements CounterService {
    private final CounterRepository counterRepository;
    private final CounterInstanceRepository counterInstanceRepository;
    private final CounterInstanceAttributeRepository counterInstanceAttributeRepository;
    private final CounterMapper counterMapper;
    private final CounterInternalService counterInternalService;

    @Override
    @Transactional
    public Integer getNextValue(CounterTypes counterType, List<RecordAttribute> attributes) {
        Counter counter = counterRepository.selectById(counterType.id()).orElseThrow(() -> new BusinessException(COUNTER_NOT_FOUND, counterType.id()));
        return counterInternalService.getNextValue(counter, attributes);
    }

    @Override
    @Transactional
    public Integer getNextValue(CounterTypes counterType) {
        return this.getNextValue(counterType, null);
    }

    @Override
    @Transactional
    public String getNextValueAsString(CounterTypes counterType, List<RecordAttribute> attributes) {
        Counter counter = counterRepository.selectById(counterType.id()).orElseThrow(() -> new BusinessException(COUNTER_NOT_FOUND, counterType.id()));
        Integer nextValue = counterInternalService.getNextValue(counter, attributes);
        return String.format("%0" + counter.getLength() + "d", nextValue);
    }

    @Override
    public String getNextValueAsString(CounterTypes counterType) {
        return this.getNextValueAsString(counterType, null);
    }

    private Integer getNextValue(Counter counter, List<RecordAttribute> attributes) {
        if (!counter.getAttributes().isEmpty()) {
            if (attributes == null || attributes.size() != counter.getAttributes().stream().filter(c->!c.getIsOptional()).toList().size())
                throw new BusinessException(MISSED_ATTRIBUTE);
            else {
                for (CounterAttribute counterAttribute : counter.getAttributes()) {
                    // For required (not optional) attributes
                    if (!counterAttribute.getIsOptional()) {
                        boolean found = attributes.stream().anyMatch(attr ->
                                attr.getAttributeKey().name().equals(counterAttribute.getAttributeKey()));

                        // If required attribute is NOT found in sent attributes, throw exception
                        if (!found) {
                            throw new BusinessException(MISSED_ATTRIBUTE, counterAttribute.getAttributeKey());
                        }
                    }
                    // Optional attributes are always allowed (no check needed)
                }
            }
        }

        List<CounterInstanceAttribute> counterInstanceAttributes = counterMapper.toCounterInstanceAttributes(attributes);
        CounterInstance counterInstance = counterInstanceRepository.selectByFilters(counter.getId(), counterInstanceAttributes)
                .orElseGet(() -> {
                    CounterInstance newInstance = counterMapper.toCounterInstance(counter);
                    newInstance = counterInstanceRepository.insert(newInstance);
                    if (counterInstanceAttributes != null) {
                        for (CounterInstanceAttribute counterInstanceAttribute : counterInstanceAttributes) {
                            counterInstanceAttribute.setCounterInstance(newInstance);
                            counterInstanceAttributeRepository.insert(counterInstanceAttribute);
                        }
                    }
                    return newInstance;
                });

        Integer newValue = counterInstance.getCounterLastValue() + 1;
        counterInstance.setCounterLastValue(newValue);
        counterInstanceRepository.update(counterInstance);
        return newValue;
    }

}
