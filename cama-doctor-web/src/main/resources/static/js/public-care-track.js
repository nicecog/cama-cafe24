/**
 * 공개 웹뷰 — contentsApi.getContentsDetailForWebview (인증 없음)
 */
(function () {
    var fontPx = { NORMAL: 16, LARGE: 20, MORE_LARGE: 24 };

    function showAlert(msg, onOk) {
        var bd = document.getElementById('wvAlert');
        var tx = document.getElementById('wvAlertText');
        var ok = document.getElementById('wvAlertOk');
        tx.textContent = msg;
        bd.classList.add('open');
        function close() {
            bd.classList.remove('open');
            ok.removeEventListener('click', close);
            if (onOk) onOk();
        }
        ok.addEventListener('click', close);
    }

    function setFont(ft) {
        var el = document.getElementById('editorBody');
        if (el) el.style.fontSize = (fontPx[ft] || 16) + 'px';
        document.querySelectorAll('.font-tag').forEach(function (b) {
            b.classList.toggle('active', b.getAttribute('data-font') === ft);
        });
    }

    document.addEventListener('DOMContentLoaded', function () {
        var seq = window.__WEBVIEW_SEQ__;
        if (!seq || isNaN(Number(seq))) {
            showAlert('잘못된 접근입니다.', function () { history.back(); });
            return;
        }

        document.querySelectorAll('.font-tag').forEach(function (btn) {
            btn.addEventListener('click', function () {
                setFont(btn.getAttribute('data-font'));
            });
        });
        setFont('NORMAL');

        window.CamaApi.getContentsDetailForWebview(seq)
            .then(function (res) {
                document.getElementById('wvTitle').textContent = res.title || '';
                document.getElementById('wvDoctor').textContent = res.doctorName || '';
                document.getElementById('wvDept').textContent = res.departmentName ? ' ' + res.departmentName : '';
                document.getElementById('wvDate').textContent = res.createdAt || '';
                var editor = document.getElementById('editorBody');
                editor.innerHTML = res.contents || '';

                var careUl = document.getElementById('wvCareTimes');
                var intUl = document.getElementById('wvInterest');
                careUl.innerHTML = '';
                intUl.innerHTML = '';
                var careTimes = [];
                try {
                    var dis = JSON.parse(res.disease || '{}');
                    if (dis.diseaseTreatment) {
                        careTimes = dis.diseaseTreatment.map(function (d) { return d.name; });
                    }
                } catch (e) { /* ignore */ }
                var interests = [];
                try {
                    interests = JSON.parse(res.interest || '[]');
                } catch (e2) { /* ignore */ }
                careTimes.forEach(function (n) {
                    var li = document.createElement('li');
                    li.textContent = n;
                    careUl.appendChild(li);
                });
                interests.forEach(function (n) {
                    var li = document.createElement('li');
                    li.textContent = n;
                    intUl.appendChild(li);
                });
            })
            .catch(function (e) {
                showAlert(e.message || String(e), function () { history.back(); });
            });
    });
})();
