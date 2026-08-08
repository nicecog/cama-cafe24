package com.cama.back.repo.nutrition;

import com.cama.back.domain.nutrition.AccountMealFeedback;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MealFeedbackRepository extends JpaRepository<AccountMealFeedback, Long> {
}
