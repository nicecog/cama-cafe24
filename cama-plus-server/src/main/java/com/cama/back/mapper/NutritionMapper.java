package com.cama.back.mapper;

import com.cama.back.dto.nutrition.MealDailySummaryDto;
import com.cama.back.dto.nutrition.MealLogQuery;
import com.cama.back.dto.nutrition.MealLogSummaryDto;
import org.apache.ibatis.annotations.Mapper;
import org.springframework.stereotype.Repository;

import java.util.List;

@Mapper
@Repository
public interface NutritionMapper {

    List<MealLogSummaryDto> getMealLogList(MealLogQuery query);

    List<MealDailySummaryDto> getMealDailySummary(MealLogQuery query);
}
