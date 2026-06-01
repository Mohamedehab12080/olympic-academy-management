package bs.service.department.controller;

import bs.lib.common.model.generated.LookupResultSet;
import bs.service.department.api.service.DepartmentService;
import bs.service.department.controller.generated.DepartmentLookupController;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;

@RestController
@AllArgsConstructor
public class DepartmentLookupControllerImpl implements DepartmentLookupController {

    private final DepartmentService departmentService;


    @Override
    public ResponseEntity<LookupResultSet> _getAllDepartmentsLookup() {
        return ResponseEntity.ok(departmentService.getAllDepartments());
    }
}
