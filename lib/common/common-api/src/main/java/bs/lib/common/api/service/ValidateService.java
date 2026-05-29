package bs.lib.common.api.service;

import java.time.LocalDate;

public interface ValidateService {
    void validateFromToFilters(LocalDate from, LocalDate to);
    void validateMinMaxFilters(Double min, Double max);
}
