package com.cama.back.repo.nutrition;

import com.cama.back.domain.nutrition.CmFoodNutrition;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Collection;
import java.util.List;
import java.util.Optional;

public interface FoodNutritionRepository extends JpaRepository<CmFoodNutrition, Long> {

    @Query("select max(n.nutritionVersion) from CmFoodNutrition n where n.enabled = true")
    Optional<String> findLatestVersion();

    List<CmFoodNutrition> findByFoodCodeInAndNutritionVersionAndEnabled(
            Collection<String> foodCodes, String nutritionVersion, boolean enabled);

    @Query("""
            select n from CmFoodNutrition n
             where n.enabled = true
               and n.foodCode in :foodCodes
            """)
    List<CmFoodNutrition> findEnabledByFoodCodeIn(@Param("foodCodes") Collection<String> foodCodes);

    @Query("""
            select n from CmFoodNutrition n
             where n.enabled = true
               and n.foodCode = :foodCode
             order by n.nutritionVersion desc
            """)
    List<CmFoodNutrition> findLatestByFoodCode(@Param("foodCode") String foodCode);
}
