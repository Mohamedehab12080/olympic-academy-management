package bs.service.department.core.mapper;

import bs.lib.common.model.generated.LookupVTO;
import bs.service.department.model.entity.Department;
import bs.service.department.model.generated.DepartmentDTO;
import bs.service.department.model.generated.DepartmentListItem;
import bs.service.department.model.generated.DepartmentVTO;
import bs.service.user.model.entity.User;
import bs.service.user.model.generated.LightUserVTO;
import org.mapstruct.*;

import java.util.List;

@Mapper(componentModel = "spring",
        unmappedTargetPolicy = ReportingPolicy.IGNORE,
        injectionStrategy = InjectionStrategy.CONSTRUCTOR)
public abstract class DepartmentMapper {

    public abstract LightUserVTO toLightUserVTO(User user);

    public abstract LookupVTO toLookupVTO(Department department);

    public abstract Department toDepartment(DepartmentDTO departmentDTO);

    public abstract DepartmentVTO toDepartmentVTO(Department department);

    public abstract DepartmentListItem toDepartmentListItem(Department department);

    public abstract List<DepartmentListItem> toDepartmentListItems(List<Department> departments);

    public abstract List<LookupVTO> toLookupVTOs(List<Department> departments);
}
