package com.cama.back.repo.coaching;


import com.cama.back.domain.coaching.CoachingExerciseSurveyResultHst;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ExerciseSurveyResultRepository extends JpaRepository<CoachingExerciseSurveyResultHst, Long> {

    Optional<CoachingExerciseSurveyResultHst> findBySeq(Long seq);

}
