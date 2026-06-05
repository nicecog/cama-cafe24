package com.cama.doctorweb.web;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

/**
 * Thymeleaf 페이지 라우팅 (기존 React Router 경로와 동일하게 유지)
 */
@Controller
public class PageController {

    @GetMapping("/")
    public String root() {
        return "redirect:/content-management/treatment/done/list";
    }

    @GetMapping("/login")
    public String login() {
        return "pages/login";
    }

    @GetMapping("/patient-management/patient/list")
    public String patientList() {
        return "pages/patient-list";
    }

    @GetMapping("/content-management/treatment/done/list")
    public String treatmentDoneList() {
        return "pages/treatment-list";
    }

    @GetMapping("/content-management/treatment/disabled/list")
    public String treatmentDisabledList() {
        return "pages/treatment-disabled-list";
    }

    @GetMapping("/content-management/treatment/add")
    public String treatmentAdd() {
        return "pages/treatment-add";
    }

    @GetMapping("/content-management/treatment/detail/{seq}")
    public String treatmentDetail(@PathVariable String seq, Model model) {
        model.addAttribute("seq", seq);
        return "pages/treatment-detail";
    }

    /** 볼거리 (React Article 페이지 — 경로는 article/add 와 동일 계열) */
    @GetMapping("/content-management/article/list")
    public String articleList() {
        return "pages/article-list";
    }

    @GetMapping("/content-management/article/add")
    public String articleAdd() {
        return "pages/article-add";
    }

    /**
     * 공개 웹뷰 (기존 /webview/treatment/:seq)
     */
    @GetMapping("/webview/treatment/{seq}")
    public String publicCareTrack(@PathVariable String seq, Model model) {
        model.addAttribute("seq", seq);
        return "pages/public-care-track";
    }

    /** 서비스 관리 (React Home 주석 구간 복원) */
    @GetMapping("/service-management/service/list")
    public String serviceList() {
        return "pages/service-list";
    }

    @GetMapping("/service-management/service/approve/{serviceSeq}")
    public String approveService(@PathVariable String serviceSeq, Model model) {
        model.addAttribute("serviceSeq", serviceSeq);
        return "pages/approve-service";
    }
}
