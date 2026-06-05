/**
 * 치료정보(완료) 목록 — doctorContentsApi.fetchDoctorContentsList
 */
(function () {
    var state = {
        page: 1,
        searchType: 'title',
        searchedText: '',
        pagination: null,
        list: []
    };

    function esc(s) {
        if (!s) return '';
        return String(s)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;');
    }

    function render() {
        var tbody = document.getElementById('tbody');
        if (!tbody) return;
        tbody.innerHTML = '';
        if (!state.list || !state.list.length) {
            tbody.innerHTML = '<tr><td colspan="6">데이터가 없습니다.</td></tr>';
        } else {
            state.list.forEach(function (row) {
                var tr = document.createElement('tr');
                tr.innerHTML =
                    '<td>' + esc(row.seq) + '</td>' +
                    '<td>' + esc(row.title) + '</td>' +
                    '<td>' + esc(row.doctorName) + '</td>' +
                    '<td>' + esc(row.departmentName) + '</td>' +
                    '<td>' + esc(row.createdAt) + '</td>' +
                    '<td><a href="/content-management/treatment/detail/' + esc(row.seq) + '">상세</a></td>';
                tbody.appendChild(tr);
            });
        }
        var info = document.getElementById('pageInfo');
        var p = state.pagination;
        if (info && p) {
            info.textContent = p.currentPage + ' / ' + p.totalPage + ' (총 ' + p.totalCount + '건)';
        }
        var prev = document.getElementById('btnPrev');
        var next = document.getElementById('btnNext');
        if (prev) prev.disabled = !p || p.currentPage <= 1;
        if (next) next.disabled = !p || p.currentPage >= p.totalPage;
    }

    function load(page) {
        var st = document.getElementById('searchType').value;
        return window.CamaApi.getDoctorContentsList(page, st, state.searchedText).then(function (res) {
            state.list = res.data || [];
            state.pagination = res.pagination;
            state.page = page;
            render();
            return window.CamaApi.refreshSidebarCountsFromApi().catch(function () {});
        });
    }

    document.addEventListener('DOMContentLoaded', function () {
        document.getElementById('btnSearch').addEventListener('click', function () {
            state.searchedText = document.getElementById('searchText').value || '';
            load(1).catch(function (e) { alert(e.message || e); });
        });
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
        load(1).catch(function (e) { alert(e.message || e); });
    });
})();
