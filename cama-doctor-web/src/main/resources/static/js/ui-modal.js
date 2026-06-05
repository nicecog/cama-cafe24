/**
 * Alert / Confirm (Promise)
 */
(function () {
    function esc(s) {
        if (s == null) return '';
        return String(s)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;');
    }

    window.CamaUi = {
        alert: function (message, title) {
            return new Promise(function (resolve) {
                var backdrop = document.createElement('div');
                backdrop.className = 'dialog-backdrop open';
                backdrop.innerHTML =
                    '<div class="dialog">' +
                    '<h2 style="margin:0 0 12px;font-size:1.1rem;">' + esc(title || '알림') + '</h2>' +
                    '<p style="margin:0;white-space:pre-wrap;">' + esc(message) + '</p>' +
                    '<div style="text-align:right;margin-top:16px;">' +
                    '<button type="button" class="btn btn-primary" id="__camaUiOk">확인</button>' +
                    '</div></div>';
                document.body.appendChild(backdrop);
                function close() {
                    if (backdrop.parentNode) backdrop.parentNode.removeChild(backdrop);
                    resolve();
                }
                backdrop.querySelector('#__camaUiOk').addEventListener('click', close);
            });
        },
        confirm: function (message, title) {
            return new Promise(function (resolve) {
                var backdrop = document.createElement('div');
                backdrop.className = 'dialog-backdrop open';
                backdrop.innerHTML =
                    '<div class="dialog">' +
                    '<h2 style="margin:0 0 12px;font-size:1.1rem;">' + esc(title || '확인') + '</h2>' +
                    '<p style="margin:0;white-space:pre-wrap;">' + esc(message) + '</p>' +
                    '<div style="text-align:right;margin-top:16px;display:flex;gap:8px;justify-content:flex-end;">' +
                    '<button type="button" class="btn" id="__camaUiNo">취소</button>' +
                    '<button type="button" class="btn btn-primary" id="__camaUiYes">확인</button>' +
                    '</div></div>';
                document.body.appendChild(backdrop);
                function done(v) {
                    if (backdrop.parentNode) backdrop.parentNode.removeChild(backdrop);
                    resolve(v);
                }
                backdrop.querySelector('#__camaUiYes').addEventListener('click', function () { done(true); });
                backdrop.querySelector('#__camaUiNo').addEventListener('click', function () { done(false); });
                backdrop.addEventListener('click', function (e) {
                    if (e.target === backdrop) done(false);
                });
            });
        }
    };
})();
