package bs.service.department.model.enums;

import bs.lib.common.model.interfaces.Domains;
import lombok.AllArgsConstructor;

@AllArgsConstructor
public enum DepartmentDomains implements Domains {
    DEPARTMENT(2001);

    private final Integer id;

    @Override
    public Integer id() {
        return id;
    }



}
