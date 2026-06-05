/**
 * 환자 모니터링 — monitoringApi.fetchPatientMonitoringList
 */
(function () {
    var state = { pagination: null, list: [], searchedText: '' };

    function genderLabel(g) {
        if (g === 'MALE' || g === 'M') return '남';
        if (g === 'FEMALE' || g === 'F') return '여';
        return g || '-';
    }

    function esc(s) {
        if (!s) return '';
        return String(s)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;');
    }

    function parseDisease(jsonStr) {
        try {
            return JSON.parse(jsonStr || '{}');
        } catch (e) {
            return {};
        }
    }

    function render() {
        var tbody = document.getElementById('tbody');
        tbody.innerHTML = '';
        if (!state.list.length) {
            tbody.innerHTML = '<tr><td colspan="8">데이터가 없습니다.</td></tr>';
            return;
        }
        state.list.forEach(function (d, idx) {
            var disease = parseDisease(d.disease);
            var dname = disease.name || '';
            var steps = (disease.diseaseTreatment || []).map(function (t) { return t.name; }).join(', ');
            var tr = document.createElement('tr');
            var pg = state.pagination || {};
            var rowSize = pg.displayRow && pg.displayRow > 0 ? pg.displayRow : 10;
            var base = typeof pg.startNum === 'number' ? pg.startNum : ((pg.currentPage - 1) * rowSize + 1);
            var num = base + idx;
            tr.innerHTML =
                '<td>' + num + '</td>' +
                '<td>' + esc(d.name) + '</td>' +
                '<td>' + esc(d.birth) + '</td>' +
                '<td>' + esc(genderLabel(d.gender)) + '</td>' +
                '<td>' + esc(dname) + '</td>' +
                '<td>' + esc(steps) + '</td>' +
                '<td>' + esc(d.progress != null ? d.progress + '%' : '-') + '</td>' +
                '<td>' + esc(d.createdAt ? String(d.createdAt).slice(0, 10) : '') + '</td>';
            tbody.appendChild(tr);
        });
        var p = state.pagination;
        var info = document.getElementById('pageInfo');
        if (info && p) {
            info.textContent = p.currentPage + ' / ' + p.totalPage + ' (총 ' + p.totalCount + '건)';
        }
        document.getElementById('btnPrev').disabled = !p || p.currentPage <= 1;
        document.getElementById('btnNext').disabled = !p || p.currentPage >= p.totalPage;
    }

    function load(page) {
        var st = document.getElementById('searchType').value;
        return window.CamaApi.getMonitoringPatientList(page, st, state.searchedText).then(function (res) {
            state.list = res.data || [];
            state.pagination = res.pagination;
            render();
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
