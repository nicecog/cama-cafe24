/**
 * 서비스 신청 목록 — doctorContentsApi.fetchDoctorServiceList
 */
(function () {
    var state = { list: [], pagination: null };

    function esc(s) {
        if (s == null) return '';
        return String(s)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;');
    }

    function render() {
        var tbody = document.getElementById('tbody');
        tbody.innerHTML = '';
        if (!state.list.length) {
            tbody.innerHTML = '<tr><td colspan="5">데이터가 없습니다.</td></tr>';
            return;
        }
        var p = state.pagination || { currentPage: 1 };
        var start = typeof p.startNum === 'number' ? p.startNum : ((p.currentPage - 1) * (p.displayRow || 10) + 1);
        state.list.forEach(function (d, idx) {
            var tr = document.createElement('tr');
            var approveCell = d.approveDate == null
                ? '<a class="btn btn-sm" href="/service-management/service/approve/' + esc(d.serviceSeq) + '">승인</a>'
                : '<span>-</span>';
            tr.innerHTML =
                '<td>' + (start + idx) + '</td>' +
                '<td>' + esc(d.name) + '</td>' +
                '<td>' + esc(d.createdAt) + '</td>' +
                '<td>' + (d.approveDate == null ? '-' : esc(d.approveDate)) + '</td>' +
                '<td>' + approveCell + '</td>';
            tbody.appendChild(tr);
        });
        var info = document.getElementById('pageInfo');
        if (info && state.pagination) {
            var pg = state.pagination;
            info.textContent = pg.currentPage + ' / ' + pg.totalPage + ' (총 ' + pg.totalCount + '건)';
        }
        var prev = document.getElementById('btnPrev');
        var next = document.getElementById('btnNext');
        if (prev) prev.disabled = !state.pagination || state.pagination.currentPage <= 1;
        if (next) next.disabled = !state.pagination || state.pagination.currentPage >= state.pagination.totalPage;
    }

    function load(page) {
        var q = page ? ('?page=' + encodeURIComponent(page)) : '';
        return window.CamaApi.getDoctorServiceList(page)
            .then(function (res) {
                state.list = res.data || [];
                state.pagination = res.pagination;
                render();
            });
    }

    document.addEventListener('DOMContentLoaded', function () {
        load(1).catch(function (e) { alert(e.message || e); });
        document.getElementById('btnPrev').addEventListener('click', function () {
            if (state.pagination && state.pagination.currentPage > 1) {
                load(state.pagination.currentPage - 1).catch(function (e) { alert(e.message || e); });
            }
        });
        document.getElementById('btnNext').addEventListener('click', function () {
            if (state.pagination && state.pagination.currentPage < state.pagination.totalPage) {
                load(state.pagination.currentPage + 1).catch(function (e) { alert(e.message || e); });
            }
        });
    });
})();
