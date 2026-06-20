package bs.service.employee.api.service;

import bs.lib.common.model.generated.NewRecordVTO;
import bs.lib.sql.db.adapter.model.generated.OrderDirections;
import bs.service.employee.model.generated.AssignDepartmentDTO;
import bs.service.employee.model.generated.TrainerDepartmentResultSet;
import bs.service.employee.model.generated.TrainerDepartmentVTO;
import java.util.List;

public interface TrainerDepartmentService {
    List<NewRecordVTO> assignDepartmentToTrainer(Integer trainerId, AssignDepartmentDTO assignDepartmentDTO);
    void updateTrainerDepartment(Integer trainerDepartmentId, AssignDepartmentDTO assignDepartmentDTO);
    void deleteTrainerDepartmentById(Integer trainerDepartmentId);
    TrainerDepartmentVTO getTrainerDepartmentById(Integer trainerDepartmentId);
    TrainerDepartmentResultSet getAllTrainerDepartmentsByFilters(Integer trainerId, Integer departmentId, String quickSearch, Integer pageNum, Integer pageSize, OrderDirections orderDir, String orderBy);
}
