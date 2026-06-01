package bs.service.department.proxy.service;

import bs.service.department.model.generated.DepartmentVTO;

public interface DepartmentMgtProxyService {

    DepartmentVTO getDepartmentDetails(Integer departmentId);

}
