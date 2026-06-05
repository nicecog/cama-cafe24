/**
 * 의사 로그인 (기존 authApi.loginDoctor)
 */
(function () {
    function showDialog(msg) {
        var backdrop = document.getElementById('loginError');
        var text = document.getElementById('loginErrorText');
        if (text) text.textContent = msg;
        if (backdrop) backdrop.classList.add('open');
    }

    function hideDialog() {
        var backdrop = document.getElementById('loginError');
        if (backdrop) backdrop.classList.remove('open');
    }

    document.addEventListener('DOMContentLoaded', function () {
        var form = document.getElementById('loginForm');
        var closeBtn = document.getElementById('loginErrorClose');
        if (closeBtn) closeBtn.addEventListener('click', hideDialog);

        if (window.CamaApi.getToken()) {
            window.location.href = '/content-management/treatment/done/list';
            return;
        }

        if (!form) return;

        form.addEventListener('submit', function (e) {
            e.preventDefault();
            var principal = (document.getElementById('principal').value || '').trim();
            var credentials = document.getElementById('credentials').value || '';
            var errPrincipal = document.getElementById('errPrincipal');
            var errCredentials = document.getElementById('errCredentials');
            if (errPrincipal) errPrincipal.textContent = '';
            if (errCredentials) errCredentials.textContent = '';
            var ok = true;
            if (!principal) {
                if (errPrincipal) errPrincipal.textContent = '필수 입력 항목입니다.';
                ok = false;
            }
            if (!credentials) {
                if (errCredentials) errCredentials.textContent = '필수 입력 항목입니다.';
                ok = false;
            }
            if (!ok) return;

            window.CamaApi.postAuthDoctor({ principal: principal, credentials: credentials })
                .then(function (authInfo) {
                    if (authInfo && authInfo.apiToken) {
                        window.CamaApi.setToken(authInfo.apiToken);
                    }
                    window.location.href = '/content-management/treatment/done/list';
                })
                .catch(function (err) {
                    showDialog(err.message || String(err));
                });
        });
    });
})();
