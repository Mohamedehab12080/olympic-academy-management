package bs.service.financial.repository.jpa;

import bs.service.financial.model.entity.expense.ExpenseType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

public interface ExpenseTypeJPARepository extends JpaRepository<ExpenseType, Integer> {
}