package bs.lib.common.core.service;

import org.springframework.stereotype.Service;
import bs.lib.common.api.service.ValidateService;
import bs.lib.common.model.exception.BusinessException;

import java.time.LocalDate;

import static bs.lib.common.model.enums.CommonErrors.INVALID_DATE_RANGE_FROM_AFTER_TO;
import static bs.lib.common.model.enums.CommonErrors.INVALID_VALUE_RANGE_MIN_AFTER_MAX;

@Service
public class ValidateServiceImpl implements ValidateService {
    @Override
    public void validateFromToFilters(LocalDate from, LocalDate to) {
        if(from!= null && to!= null){
            if(to.isBefore(from))
                throw new BusinessException(INVALID_DATE_RANGE_FROM_AFTER_TO);
        }
    }

    @Override
    public void validateMinMaxFilters(Double min, Double max) {
        if(min != null && max != null){
            if(max < min)
                throw new BusinessException(INVALID_VALUE_RANGE_MIN_AFTER_MAX);
        }
    }
}
