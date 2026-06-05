/**
 * 관리자 셸: 로그인 상태에 따라 헤더 버튼 전환, 의사 이름 표시, 로그아웃
 */
(function () {
    function initShell() {
        var requireAuth = document.body.getAttribute('data-require-auth') === 'true';
        var token = window.CamaApi.getToken();
        if (requireAuth && !token) {
            window.location.href = '/login';
            return;
        }
        var btnLogout = document.getElementById('btnLogout');
        var btnLogin = document.getElementById('btnLoginLink');
        if (btnLogout && btnLogin) {
            if (token) {
                btnLogout.style.display = '';
                btnLogin.style.display = 'none';
            } else {
                btnLogout.style.display = 'none';
                btnLogin.style.display = '';
            }
        }

        if (btnLogout) {
            btnLogout.addEventListener('click', function () {
                window.CamaApi.clearToken();
                window.location.href = '/login';
            });
        }

        var nameEl = document.getElementById('sidebarDoctorName');
        if (!token || !nameEl) return;

        window.CamaApi.getDoctorMe()
            .then(function (doctor) {
                if (doctor && doctor.name) {
                    nameEl.textContent = doctor.name;
                }
                return window.CamaApi.refreshSidebarCountsFromApi().catch(function () { /* 건수 API 실패 시 무시 */ });
            })
            .catch(function () {
                nameEl.textContent = '세션 만료';
            });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initShell);
    } else {
        initShell();
    }
})();
