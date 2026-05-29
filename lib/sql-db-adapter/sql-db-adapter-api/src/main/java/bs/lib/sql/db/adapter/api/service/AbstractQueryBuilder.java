package bs.lib.sql.db.adapter.api.service;

import jakarta.persistence.EntityManager;
import jakarta.persistence.TypedQuery;
import lombok.AllArgsConstructor;
import bs.lib.sql.db.adapter.model.generated.OrderDirections;
import bs.lib.sql.db.adapter.model.old.PaginationInfo;
import bs.lib.sql.db.adapter.model.old.SearchFilter;
import bs.lib.sql.db.adapter.model.old.SortingInfo;

import java.util.List;
import java.util.Map;

//@Repository
@AllArgsConstructor
public abstract class AbstractQueryBuilder<ENTITY, FILTER extends SearchFilter> {
    private final EntityManager em;

    public List<ENTITY> selectAllByFilters(FILTER filters) {
        String hql = "SELECT item FROM " + this.getEntityNameClass().getCanonicalName() + " item "
                + this.joinQuery(filters);

        List<String> conditions = this.evaluateWhereConditions(filters);

        if (!conditions.isEmpty())
            hql += this.constructWhereCondition(conditions);

        hql += this.constructOrderStatement(filters);

        TypedQuery<ENTITY> query = em.createQuery(hql, getEntityNameClass());
        this.setParameters(query, filters);

        PaginationInfo pagination = filters.getPagination();
        if (pagination != null && pagination.isValidPagination() && !pagination.getNoPagination()) {
            query.setFirstResult(pagination.getPageNum() * pagination.getPageSize());
            query.setMaxResults(pagination.getPageSize());
        }
        return query.getResultList();
    }

    public Long countAllByFilters(FILTER filters) {
        String hql = "SELECT COUNT(item) FROM " + this.getEntityNameClass().getCanonicalName() + " item "
                + this.joinQuery(filters);

        List<String> conditions = this.evaluateWhereConditions(filters);

        if (!conditions.isEmpty())
            hql += this.constructWhereCondition(conditions);

        TypedQuery<Long> query = em.createQuery(hql, Long.class);
        this.setParameters(query, filters);

        return query.getSingleResult();
    }

    protected String constructWhereCondition(List<String> conditions) {
        StringBuilder whereClause = new StringBuilder(" WHERE ");
        for (int i = 0; i < conditions.size(); i++) {
            whereClause.append(conditions.get(i));
            if (i < conditions.size() - 1) {
                whereClause.append(" AND ");
            }
        }
        return whereClause.toString();
    }

    protected Map<String, String> getSortingMap() {
        return Map.of();
    }

    protected SortingInfo getDefaultSorting() {
        return null;
    }

    protected String constructOrderStatement(FILTER filters) {
        if ((filters.getSorting() == null || filters.getSorting().getBy() == null
                /*|| filters.getSorting().getBy().equalsIgnoreCase("null")*/)) {
            if (getDefaultSorting() != null) {
                filters.setSorting(this.getDefaultSorting());
                return this.constructOrderStatement(filters);
            } else
                return "";
        }

        OrderDirections dir = (filters.getSorting().getDir() == null) ? OrderDirections.ASC : filters.getSorting().getDir();

        String orderBy = this.getSortingMap().get(filters.getSorting().getBy());
        return " ORDER BY " + orderBy + " " + dir;
    }

    public String joinQuery(FILTER filters) {
        return "";
    }

    public abstract Class<ENTITY> getEntityNameClass();

    public abstract List<String> evaluateWhereConditions(FILTER filters);

    public abstract void setParameters(TypedQuery<?> query, FILTER filters);

}
