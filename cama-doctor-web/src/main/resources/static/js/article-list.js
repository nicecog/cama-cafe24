/**
 * 볼거리 목록 (React ContentArticleListPage — fetch 미구현 구간)
 * Billive 목록 API 확정 시 fetchList() 내부를 구현합니다.
 */
(function () {
    function renderEmpty() {
        var tbody = document.getElementById('tbody');
        tbody.innerHTML =
            '<tr><td colspan="4" style="text-align:center;padding:24px;color:#696969;">' +
            '표시할 데이터가 없습니다. API 연동 후 목록이 채워집니다.' +
            '</td></tr>';
    }

    document.addEventListener('DOMContentLoaded', function () {
        renderEmpty();
    });
})();
