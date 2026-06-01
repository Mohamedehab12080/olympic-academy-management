package bs.service.department.proxy.internal.service;

import bs.service.department.api.service.DepartmentService;
import bs.service.department.model.generated.DepartmentVTO;
import bs.service.department.proxy.service.DepartmentMgtProxyService;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
public class DepartmentMgtProxyInternalServiceImpl implements DepartmentMgtProxyService {
    private final DepartmentService departmentService;

    @Override
    public DepartmentVTO getDepartmentDetails(Integer departmentId) {
        return departmentService.getDepartmentById(departmentId);
    }
}
