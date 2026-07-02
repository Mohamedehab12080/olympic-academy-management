package bs.service.enrollment.controller;

import bs.lib.common.model.generated.LookupResultSet;
import bs.service.enrollment.api.service.EnrollmentService;
import bs.service.enrollment.controller.generated.EnrollmentLookupController;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.annotation.Secured;
import org.springframework.stereotype.Repository;

@Repository
@AllArgsConstructor
public class EnrollmentLookupControllerImpl implements EnrollmentLookupController {

    private EnrollmentService enrollmentService;

    @Override
    @Secured(value = {"ROLE_ADMIN","ROLE_SUPER_ADMIN"})
    public ResponseEntity<LookupResultSet> _getAllEnrollmentsLookup() {
        return ResponseEntity.ok(enrollmentService.getAllEnrollmentsLookup());
    }
}
