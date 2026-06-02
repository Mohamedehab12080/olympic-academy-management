package bs.service.enrollment.model.enums;

import bs.lib.common.model.interfaces.Domains;
import lombok.AllArgsConstructor;

@AllArgsConstructor
public enum EnrollmentDomains implements Domains {
    ENROLLMENT(6002),
    ENROLLMENT_TYPE(6003);

    private final Integer id;

    @Override
    public Integer id() {
        return id;
    }
}