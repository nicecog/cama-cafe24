/**
 * 서비스 승인/거절 (React ApproveService + 주석 처리된 initData 복원)
 */
(function () {
    function bindBy(cnt, list) {
        var res = [];
        var tmp = { key: '', list: [] };
        var keyCounter = 0;
        (list || []).forEach(function (a) {
            if (tmp.list.length === 0) {
                tmp = { key: 'g' + (keyCounter++), list: [] };
            }
            tmp.list.push(a);
            if (tmp.list.length === cnt) {
                res.push(tmp);
                tmp = { key: '', list: [] };
            }
        });
        if (tmp.list.length > 0) {
            res.push(tmp);
        }
        return res;
    }

    function esc(s) {
        if (s == null) return '';
        return String(s)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;');
    }

    document.addEventListener('DOMContentLoaded', function () {
        var serviceSeq = window.__SERVICE_SEQ__;
        if (!serviceSeq || isNaN(Number(serviceSeq))) {
            window.CamaUi.alert('잘못된 접근입니다.').then(function () { history.back(); });
            return;
        }

        var selectedItems = {};

        function toggleItem(diseaseSeq, detailSeqStr) {
            var arr = selectedItems[diseaseSeq] ? selectedItems[diseaseSeq].slice() : [];
            var i = arr.indexOf(detailSeqStr);
            if (i >= 0) arr.splice(i, 1);
            else arr.push(detailSeqStr);
            selectedItems[diseaseSeq] = arr;
            renderSelectionClasses();
        }

        function renderSelectionClasses() {
            document.querySelectorAll('.approve-tile').forEach(function (el) {
                var ds = el.getAttribute('data-disease-seq');
                var vs = el.getAttribute('data-detail-seq');
                var on = (selectedItems[Number(ds)] || []).indexOf(vs) >= 0;
                el.classList.toggle('approve-tile--on', on);
            });
        }

        function renderDiseaseGroups(diseaseGroup) {
            var host = document.getElementById('diseaseGroups');
            host.innerHTML = '';
            diseaseGroup.forEach(function (g) {
                var section = document.createElement('div');
                section.className = 'approve-section';
                section.innerHTML = '<h3 class="approve-section__title">' + esc(g.diseaseName) + '</h3>';
                var rows = document.createElement('div');
                rows.className = 'approve-rows';
                bindBy(2, g.diseaseOptions).forEach(function (pair) {
                    var row = document.createElement('div');
                    row.className = 'approve-pair-row';
                    pair.list.forEach(function (opt) {
                        var tile = document.createElement('button');
                        tile.type = 'button';
                        tile.className = 'approve-tile';
                        tile.setAttribute('data-disease-seq', String(g.diseaseSeq));
                        tile.setAttribute('data-detail-seq', String(opt.value));
                        tile.textContent = opt.label;
                        tile.addEventListener('click', function () {
                            toggleItem(g.diseaseSeq, String(opt.value));
                        });
                        row.appendChild(tile);
                    });
                    if (pair.list.length === 1) {
                        var spacer = document.createElement('div');
                        spacer.className = 'approve-tile-spacer';
                        row.appendChild(spacer);
                    }
                    rows.appendChild(row);
                });
                section.appendChild(rows);
                host.appendChild(section);
            });
        }

        window.CamaApi.getDoctorMe()
            .then(function (doctor) {
                var hSeq = doctor.hospitalSeq;
                return Promise.all([
                    window.CamaApi.getCommonDiseaseList(),
                    window.CamaApi.getCommonDiseaseDetailList(hSeq),
                    window.CamaApi.getDoctorServiceView(serviceSeq)
                ]).then(function (arr) {
                    return { diseaseList: arr[0], hospitalDiseaseList: arr[1], serviceInfo: arr[2] };
                });
            })
            .then(function (pack) {
                var diseaseList = pack.diseaseList || [];
                var hospitalDiseaseList = pack.hospitalDiseaseList || [];
                var serviceInfo = pack.serviceInfo;
                document.getElementById('applicantName').value = serviceInfo.name || '';

                var hospitalByDisease = {};
                hospitalDiseaseList.forEach(function (k) {
                    var ds = k.diseaseSeq;
                    if (!hospitalByDisease[ds]) hospitalByDisease[ds] = [];
                    hospitalByDisease[ds].push({ value: String(k.seq), label: k.name });
                });
                var diseaseGroup = diseaseList.map(function (d) {
                    return {
                        diseaseSeq: d.seq,
                        diseaseName: d.name,
                        diseaseOptions: hospitalByDisease[d.seq] || []
                    };
                });
                renderDiseaseGroups(diseaseGroup);
            })
            .catch(function (e) {
                window.CamaUi.alert(e.message || String(e)).then(function () { history.back(); });
            });

        document.getElementById('btnReject').addEventListener('click', function () {
            window.CamaUi.confirm('거절 하시겠습니까?').then(function (ok) {
                if (!ok) return;
                var dto = { status: 'REJECT', diseaseList: [] };
                window.CamaApi.putDoctorServiceView(serviceSeq, dto)
                    .then(function (res) {
                        if (res) {
                            return window.CamaUi.alert('거절되었습니다.').then(function () { history.back(); });
                        }
                    })
                    .catch(function (e) { window.CamaUi.alert(e.message || String(e)); });
            });
        });

        document.getElementById('btnApprove').addEventListener('click', function () {
            window.CamaUi.confirm('승인 하시겠습니까?').then(function (ok) {
                if (!ok) return;
                var diseaseList = [];
                Object.keys(selectedItems).forEach(function (k) {
                    var ds = Number(k);
                    (selectedItems[ds] || []).forEach(function (detailSeq) {
                        diseaseList.push({ diseaseSeq: ds, diseaseDetailSeq: Number(detailSeq) });
                    });
                });
                var dto = { status: 'APPROVE', diseaseList: diseaseList };
                window.CamaApi.putDoctorServiceView(serviceSeq, dto)
                    .then(function (res) {
                        if (res) {
                            return window.CamaUi.alert('승인되었습니다.').then(function () { history.back(); });
                        }
                    })
                    .catch(function (e) { window.CamaUi.alert(e.message || String(e)); });
            });
        });
    });
})();
