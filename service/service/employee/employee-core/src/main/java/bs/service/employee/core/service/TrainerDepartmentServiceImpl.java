package bs.service.employee.core.service;

import bs.lib.common.model.exception.BusinessException;
import bs.lib.common.model.generated.NewRecordVTO;
import bs.lib.sql.db.adapter.model.dto.PaginationInfo;
import bs.lib.sql.db.adapter.model.dto.SortingInfo;
import bs.lib.sql.db.adapter.model.generated.OrderDirections;
import bs.service.department.api.repository.DepartmentRepository;
import bs.service.department.model.entity.Department;
import bs.service.employee.api.repository.EmployeeRepository;
import bs.service.employee.api.repository.TrainerDepartmentRepository;
import bs.service.employee.api.service.TrainerDepartmentService;
import bs.service.employee.core.mapper.EmployeeMapper;
import bs.service.employee.model.entity.Employee;
import bs.service.employee.model.entity.EmployeeDepartment;
import bs.service.employee.model.filter.TrainerDepartmentSearchFilter;
import bs.service.employee.model.generated.AssignDepartmentDTO;
import bs.service.employee.model.generated.TrainerDepartmentResultSet;
import bs.service.employee.model.generated.TrainerDepartmentVTO;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

import static bs.service.department.model.enums.DepartmentErrors.DEPARTMENT_NOT_FOUND;
import static bs.service.employee.model.enums.EmployeeErrors.EMPLOYEE_DEPARTMENT_NOT_FOUND;
import static bs.service.employee.model.enums.EmployeeErrors.EMPLOYEE_NOT_FOUND;

@Service
@AllArgsConstructor
public class TrainerDepartmentServiceImpl implements TrainerDepartmentService {

    private final TrainerDepartmentRepository trainerDepartmentRepository;
    private final EmployeeRepository employeeRepository;
    private final DepartmentRepository departmentRepository;
    private final EmployeeMapper employeeMapper;

    @Override
    @Transactional
    public List<NewRecordVTO> assignDepartmentToTrainer(Integer trainerId,AssignDepartmentDTO assignDepartmentDTO) {
        Employee employee = employeeRepository.selectById(trainerId).orElseThrow(()-> new BusinessException(EMPLOYEE_NOT_FOUND,trainerId));
        List<Department> departments=departmentRepository.selectDepartmentByIdIn(assignDepartmentDTO.getDepartmentId());
        List<NewRecordVTO> newRecordVTOS=new ArrayList<>();
        if(departments!=null && departments.isEmpty()){
            throw new BusinessException(DEPARTMENT_NOT_FOUND,assignDepartmentDTO.getDepartmentId());
        }
        assert departments != null;
        for(Department department:departments){
            EmployeeDepartment employeeDepartment=EmployeeDepartment.builder().employee(employee).department(department).build();
            employeeDepartment=trainerDepartmentRepository.insert(employeeDepartment);
            newRecordVTOS.add(NewRecordVTO.builder().id(employeeDepartment.getId()).build());
        }
        return newRecordVTOS;
    }

    @Override
    @Transactional
    public void updateTrainerDepartment(Integer trainerDepartmentId, AssignDepartmentDTO assignDepartmentDTO) {
       EmployeeDepartment trainerDepartment=trainerDepartmentRepository.selectById(trainerDepartmentId).orElseThrow(()-> new BusinessException(EMPLOYEE_DEPARTMENT_NOT_FOUND,trainerDepartmentId));
       if(assignDepartmentDTO.getDepartmentId().stream().findFirst().isPresent()){
           trainerDepartment.setDepartment(Department.builder().id(assignDepartmentDTO.getDepartmentId().stream().findFirst().get()).build());
       }
       trainerDepartmentRepository.update(trainerDepartment);
    }

    @Override
    @Transactional
    public void deleteTrainerDepartmentById(Integer trainerDepartmentId) {
        EmployeeDepartment trainerDepartment=trainerDepartmentRepository.selectById(trainerDepartmentId).orElseThrow(()-> new BusinessException(EMPLOYEE_DEPARTMENT_NOT_FOUND,trainerDepartmentId));
        trainerDepartmentRepository.delete(trainerDepartmentId);
    }

    @Override
    public TrainerDepartmentVTO getTrainerDepartmentById(Integer trainerDepartmentId) {
        EmployeeDepartment trainerDepartment=trainerDepartmentRepository.selectById(trainerDepartmentId).orElseThrow(()-> new BusinessException(EMPLOYEE_DEPARTMENT_NOT_FOUND,trainerDepartmentId));
        return employeeMapper.toTrainerDepartmentVTO(trainerDepartment);
    }

    @Override
    public TrainerDepartmentResultSet getAllTrainerDepartmentsByFilters(Integer trainerId, Integer departmentId, String quickSearch, Integer pageNum, Integer pageSize, OrderDirections orderDir, String orderBy){
        TrainerDepartmentSearchFilter trainerDepartmentSearchFilter=TrainerDepartmentSearchFilter.builder()
                .trainerId(trainerId)
                .departmentId(departmentId)
                .pagination(PaginationInfo.builder().pageNum(pageNum).pageSize(pageSize).build())
                .defaultSorting(new SortingInfo<>(TrainerDepartmentSearchFilter.OrderByAttributes.CREATION_DATE, OrderDirections.DESC))
                .sorting(new SortingInfo<>(orderBy, orderDir))
                .build();
        List<EmployeeDepartment> employeeDepartments=trainerDepartmentRepository.selectAllByFilters(trainerDepartmentSearchFilter);
        List<TrainerDepartmentVTO> trainerDepartmentVTOS=employeeMapper.toTrainerDepartmentVTOs(employeeDepartments);
        return TrainerDepartmentResultSet.builder().items(trainerDepartmentVTOS).total(trainerDepartmentVTOS.size()).build();
    }
}
