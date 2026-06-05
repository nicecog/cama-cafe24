package com.cama.back.controller.common;

import com.cama.back.domain.api.ApiResult;
import com.cama.back.dto.notification.PushTestRequest;
import com.cama.back.dto.track.TrackResponse;
import com.cama.back.service.notification.NotificationService;
import com.cama.back.service.track.CareTrackService;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.Operation;
import org.springframework.context.annotation.Profile;
import org.springframework.web.bind.annotation.*;

import java.util.Arrays;

@RestController
@RequestMapping("api")
@Tag(name = "공통 푸시 테스트 APIs")
@Profile("!gabia")
public class CommonPushTestRestController {

    private final NotificationService notificationService;
    private final CareTrackService careTrackService;

    public CommonPushTestRestController(NotificationService notificationService, CareTrackService careTrackService) {
        this.notificationService = notificationService;
        this.careTrackService = careTrackService;
    }


    @PostMapping("common/push/test")
    @Operation(summary = "푸시 테스트")
    public ApiResult<Boolean> postPushTest(@RequestBody PushTestRequest dto) {

        notificationService.pushTest(dto.getToken());
        return new ApiResult<>(true);

    }

    @PostMapping("common/call/test")
    @Operation(summary = "클릭 테스트")
    public ApiResult<Boolean> postCallTest() {

        return new ApiResult<>(true);

    }

    @GetMapping("common/call/test22")
    @Operation(summary = "클릭 테스트22")
    public ApiResult<Boolean> postCallTest22() {

        TrackResponse trackResponse = careTrackService.callTrackService(1L, 2L, 2L, 7L, Arrays.asList("mind-care"),null,null);
        System.out.println(trackResponse.getCode());
        System.out.println(trackResponse.getMessage());

//        trackResponse.getTrack().getT().entrySet().forEach(s -> {
//            System.out.println(s.getKey() + "=" + s.getValue());
//        });

        return new ApiResult<>(true);

    }


}
