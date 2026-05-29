package bs.lib.id.counter.repository;

import jakarta.persistence.*;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;
import bs.lib.id.counter.api.repository.CounterInstanceRepository;
import bs.lib.id.counter.repository.jpa.CounterInstanceJPARepository;
import bs.lib.id.counter.model.entity.CounterInstance;
import bs.lib.id.counter.model.entity.CounterInstanceAttribute;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static bs.lib.id.counter.model.config.IdCounterVariables.ID_COUNTER_EMF;
import static bs.lib.id.counter.model.config.IdCounterVariables.ID_COUNTER_TM;

@Repository
@RequiredArgsConstructor
public class CounterInstanceRepositoryImpl implements CounterInstanceRepository {

    private final CounterInstanceJPARepository counterInstanceJPARepository;

    @PersistenceContext(unitName = ID_COUNTER_EMF)
    private EntityManager entityManager;

    @Override
    public CounterInstance insert(CounterInstance entity) {
        entity.setLastModifiedOn(LocalDateTime.now());
        return counterInstanceJPARepository.save(entity);
    }

    @Override
    public void update(CounterInstance entity) {
        entity.setLastModifiedOn(LocalDateTime.now());
        counterInstanceJPARepository.save(entity);
    }


    @Override
    @Transactional(transactionManager = ID_COUNTER_TM)
    public Optional<CounterInstance> selectByFilters(
            Integer counterId,
            List<CounterInstanceAttribute> attributes) {

        StringBuilder jpql = new StringBuilder();
        jpql.append("SELECT ci FROM CounterInstance ci ");
        jpql.append("WHERE ci.counter.id = :counterId ");

        // 1. FIRST build the complete JPQL
        if (attributes != null && !attributes.isEmpty()) {
            for (int i = 0; i < attributes.size(); i++) {
                jpql.append("AND EXISTS (SELECT 1 FROM CounterInstanceAttribute cia")
                        .append(i)
                        .append(" WHERE cia")
                        .append(i)
                        .append(".counterInstance.id = ci.id ")
                        .append("AND cia")
                        .append(i)
                        .append(".attributeKey = :key")
                        .append(i)
                        .append(" AND cia")
                        .append(i)
                        .append(".attributeValue = :value")
                        .append(i)
                        .append(") ");
            }
        }

        // 2. THEN create the query with the complete JPQL
        TypedQuery<CounterInstance> query = entityManager.createQuery(jpql.toString(), CounterInstance.class)
                .setParameter("counterId", counterId)
                .setLockMode(LockModeType.PESSIMISTIC_WRITE);

        // 3. Only set attribute parameters if attributes exist
        if (attributes != null && !attributes.isEmpty()) {
            for (int i = 0; i < attributes.size(); i++) {
                CounterInstanceAttribute attribute = attributes.get(i);
                query.setParameter("key" + i, attribute.getAttributeKey());
                query.setParameter("value" + i, attribute.getAttributeValue());
            }
        }

        List<CounterInstance> results = query.getResultList();
        return results.stream().findFirst();
    }
}
