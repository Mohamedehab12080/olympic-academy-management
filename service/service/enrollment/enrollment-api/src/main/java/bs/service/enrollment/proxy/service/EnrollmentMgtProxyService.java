package bs.service.enrollment.proxy.service;

import bs.service.enrollment.model.filter.EnrollmentSearchFilter;
import bs.service.enrollment.model.generated.EnrollmentVTO;

import java.util.List;

public interface EnrollmentMgtProxyService {
    List<EnrollmentVTO> getEnrollmentVTOs(EnrollmentSearchFilter filter);

}
