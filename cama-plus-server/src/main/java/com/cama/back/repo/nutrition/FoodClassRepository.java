package com.cama.back.repo.nutrition;

import com.cama.back.domain.nutrition.CmFoodClass;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.OffsetDateTime;
import java.util.Collection;
import java.util.List;
import java.util.Optional;

public interface FoodClassRepository extends JpaRepository<CmFoodClass, Long> {

    Optional<CmFoodClass> findByClassKeyAndEnabled(String classKey, boolean enabled);

    List<CmFoodClass> findByClassKeyInAndEnabled(Collection<String> classKeys, boolean enabled);

    List<CmFoodClass> findByEnabledOrderByClassIdAsc(boolean enabled);

    @Query("select max(f.updatedAt) from CmFoodClass f")
    Optional<OffsetDateTime> findLatestUpdatedAt();

    @Query("""
            select f from CmFoodClass f
             where f.enabled = true
               and (lower(f.classKey) like lower(concat('%', :keyword, '%'))
                    or f.nameKo like concat('%', :keyword, '%'))
             order by f.classId asc
            """)
    List<CmFoodClass> searchByKeyword(@Param("keyword") String keyword);

    @Query("select f from CmFoodClass f where f.updatedAt > :since order by f.classId asc")
    List<CmFoodClass> findChangedSince(@Param("since") OffsetDateTime since);
}
