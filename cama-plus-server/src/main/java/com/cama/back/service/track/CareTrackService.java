package com.cama.back.service.track;


import com.cama.back.dto.track.DiseaseOption;
import com.cama.back.dto.track.DiseaseTreatment;
import com.cama.back.dto.track.TrackResponse;

import java.util.List;

public interface CareTrackService {

    TrackResponse callTrackService(Long hospitalSeq, Long acSeq, Long diseaseSeq, Long days, List<String> interest,
                                   List<DiseaseOption> diseaseOption, List<DiseaseTreatment> diseaseTreatment);

}
