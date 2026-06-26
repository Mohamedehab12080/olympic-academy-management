package bs.service.employee.core.service;

import bs.lib.common.model.exception.BusinessException;
import bs.lib.common.model.generated.NewRecordVTO;
import bs.lib.sql.db.adapter.model.dto.PaginationInfo;
import bs.lib.sql.db.adapter.model.dto.SortingInfo;
import bs.lib.sql.db.adapter.model.generated.OrderDirections;
import bs.service.employee.api.repository.EmployeeContactRepository;
import bs.service.employee.api.repository.EmployeeRepository;
import bs.service.employee.api.service.EmployeeContactService;
import bs.service.employee.core.mapper.EmployeeMapper;
import bs.service.employee.model.entity.Employee;
import bs.service.employee.model.entity.EmployeeContact;
import bs.service.employee.model.filter.EmployeeContactSearchFilter;
import bs.service.employee.model.generated.EmployeeContactDTO;
import bs.service.employee.model.generated.EmployeeContactListItem;
import bs.service.employee.model.generated.EmployeeContactResultSet;
import bs.service.employee.model.generated.EmployeeContactVTO;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

import static bs.service.employee.model.enums.EmployeeErrors.EMPLOYEE_CONTACT_NOT_FOUND;
import static bs.service.employee.model.enums.EmployeeErrors.EMPLOYEE_NOT_FOUND;

@Service
@AllArgsConstructor
public class EmployeeContactServiceImpl implements EmployeeContactService {

    private final EmployeeContactRepository employeeContactRepository;
    private final EmployeeRepository employeeRepository;
    private final EmployeeMapper employeeMapper;

    @Override
    @Transactional
    public NewRecordVTO create(Integer employeeId,EmployeeContactDTO employeeContactDTO) {
        Employee employee =employeeRepository.selectById(employeeId).orElseThrow(()->new BusinessException(EMPLOYEE_NOT_FOUND, employeeId));
        EmployeeContact employeeContact=employeeMapper.toEmployeeContact(employeeContactDTO);
        employeeContact.setEmployee(employee);
        employeeContact=employeeContactRepository.insert(employeeContact);
        return NewRecordVTO.builder().id(employeeContact.getId()).build();
    }

    @Override
    @Transactional
    public NewRecordVTO updateEmployeeContact(Integer employeeId, Integer contactId, EmployeeContactDTO employeeContactDTO) {
        Employee employee = employeeRepository.selectById(employeeId)
                .orElseThrow(() -> new BusinessException(EMPLOYEE_NOT_FOUND, employeeId));

        EmployeeContact contact = employee.getContacts().stream()
                .filter(c -> c.getId().equals(contactId))
                .findFirst()
                .orElseThrow(() -> new BusinessException(EMPLOYEE_CONTACT_NOT_FOUND, contactId));

        contact.setContactType(employeeContactDTO.getContactType().getId());
        contact.setContactValue(employeeContactDTO.getContactValue());
        employeeRepository.update(employee);
        return NewRecordVTO.builder().id(contactId).build();    }

    @Override
    public void deleteEmployeeContact(Integer contactId) {
        EmployeeContact employeeContact=employeeContactRepository.selectById(contactId).orElseThrow(()->new BusinessException(EMPLOYEE_CONTACT_NOT_FOUND,contactId));
        employeeContactRepository.delete(contactId);
    }

    @Override
    public EmployeeContactResultSet getAllEmployeeContactByFilters(Integer employeeId, String contactName, String contactValue, Integer pageNum, Integer pageSize, OrderDirections orderDir, String orderBy) {
        EmployeeContactSearchFilter employeeContactSearchFilter=EmployeeContactSearchFilter.builder()
                .employeeId(employeeId)
                .contactName(contactName)
                .contactValue(contactValue)
                .pagination(PaginationInfo.builder().pageNum(pageNum).pageSize(pageSize).build())
                .defaultSorting(new SortingInfo<>(EmployeeContactSearchFilter.OrderByAttributes.CONTACT_NAME,OrderDirections.DESC))
                .sorting(new SortingInfo<>(orderBy,orderDir))
                .build();
        List<EmployeeContact> employeeContacts=employeeContactRepository.selectAllByFilters(employeeContactSearchFilter);
        List<EmployeeContactListItem> employeeContactListItems=employeeMapper.toEmployeeContactListItems(employeeContacts);
        return EmployeeContactResultSet.builder().items(employeeContactListItems).total(employeeContactListItems.size()).build();
    }

    @Override
    public EmployeeContactVTO getEmployeeContactById(Integer contactId) {
        EmployeeContact employeeContact=employeeContactRepository.selectById(contactId).orElseThrow(()->new BusinessException(EMPLOYEE_CONTACT_NOT_FOUND,contactId));
        EmployeeContactVTO employeeContactVTO = employeeMapper.toEmployeeContactVTO(employeeContact);
        return employeeContactVTO;
    }
}
