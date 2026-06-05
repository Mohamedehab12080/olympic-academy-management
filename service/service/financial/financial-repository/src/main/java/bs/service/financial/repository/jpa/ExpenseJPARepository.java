package bs.service.financial.repository.jpa;

import bs.service.financial.model.entity.expense.Expense;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ExpenseJPARepository extends JpaRepository<Expense, Integer> {
}