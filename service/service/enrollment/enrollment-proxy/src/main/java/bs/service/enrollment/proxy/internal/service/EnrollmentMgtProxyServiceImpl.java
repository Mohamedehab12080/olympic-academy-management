package bs.service.enrollment.proxy.internal.service;

import bs.service.enrollment.api.repository.EnrollmentRepository;
import bs.service.enrollment.model.filter.EnrollmentSearchFilter;
import bs.service.enrollment.model.generated.EnrollmentVTO;
import bs.service.enrollment.proxy.internal.mapper.EnrollmentMgtProxyMapper;
import bs.service.enrollment.proxy.service.EnrollmentMgtProxyService;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@AllArgsConstructor
public class EnrollmentMgtProxyServiceImpl implements EnrollmentMgtProxyService {

    private final EnrollmentRepository enrollmentRepository;
    private final EnrollmentMgtProxyMapper enrollmentMgtProxyMapper;

    @Override
    public List<EnrollmentVTO> getEnrollmentVTOs(EnrollmentSearchFilter filter) {
        return enrollmentMgtProxyMapper.toEnrollmentVTOs(enrollmentRepository.selectAllByFilters(filter));
    }
}
