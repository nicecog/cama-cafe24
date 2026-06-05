/**
 * 치료정보 등록/수정 공통 (React TreatmentAdd / TreatmentDetail 이식)
 * window.__TF_CONFIG__ = { mode: 'add' | 'edit', seq: '123' }
 */
(function () {
    var INTEREST_OPTIONS = [
        { label: '건강한 식생활과 운동', value: '건강한 식생활과 운동' },
        { label: '그외 도움되는 정보', value: '그외 도움되는 정보' },
        { label: '마음 돌보기', value: '마음 돌보기' },
        { label: '보호자를 위한 팁', value: '보호자를 위한 팁' },
        { label: '부작용과 대처', value: '부작용과 대처' },
        { label: '위험요소와 관리법', value: '위험요소와 관리법' },
        { label: '증상 알아보기', value: '증상 알아보기' },
        { label: '치료과정', value: '치료과정' }
    ];
    var VIEWED_OPTIONS = [
        { label: '네. 공개합니다.', value: 'YES' },
        { label: '아니오. 공개하지 않습니다. 작성중 입니다.', value: 'NO' }
    ];

    function groupBy(arr, key) {
        var m = {};
        (arr || []).forEach(function (item) {
            var k = item[key];
            if (m[k] === undefined) m[k] = [];
            m[k].push(item);
        });
        return m;
    }

    function buildOptionGroupList(flatOptions) {
        var g = groupBy(flatOptions || [], 'groupName');
        return Object.keys(g).map(function (k) {
            return {
                groupName: k,
                diseaseOptions: g[k].map(function (dd) {
                    return { optionName: dd.optionName, seq: dd.seq };
                })
            };
        });
    }

    function mergeHospitalArrays(res) {
        var diseaseTreatmentGroup = {};
        var diseaseOptionGroupSet = {};
        var hospitalDiseaseGroup = {};
        (res || []).forEach(function (d) {
            diseaseTreatmentGroup[d.diseaseSeq] = d.diseaseTreatment || [];
            diseaseOptionGroupSet[d.diseaseSeq] = d.diseaseOption || [];
            hospitalDiseaseGroup[d.diseaseSeq] = d;
        });
        var diseaseOptions = (res || []).map(function (d) {
            return { label: d.diseaseName, value: String(d.diseaseSeq) };
        });
        var diseaseList = (res || []).map(function (d) {
            return { seq: d.diseaseSeq, name: d.diseaseName };
        });
        var first = res && res[0];
        var diseaseType = first
            ? { seq: first.diseaseSeq, name: first.diseaseName }
            : null;
        var diseaseTreatmentOptions = first ? (first.diseaseTreatment || []) : [];
        var diseaseOptionGroupList = buildOptionGroupList(first ? first.diseaseOption : []);
        return {
            diseaseTreatmentGroup: diseaseTreatmentGroup,
            diseaseOptionGroupSet: diseaseOptionGroupSet,
            hospitalDiseaseGroup: hospitalDiseaseGroup,
            diseaseOptions: diseaseOptions,
            diseaseList: diseaseList,
            diseaseType: diseaseType,
            diseaseTreatmentOptions: diseaseTreatmentOptions,
            diseaseOptionGroupList: diseaseOptionGroupList
        };
    }

    function fileToBase64(file) {
        return new Promise(function (resolve, reject) {
            var r = new FileReader();
            r.onload = function () { resolve(r.result); };
            r.onerror = reject;
            r.readAsDataURL(file);
        });
    }

    function initQuill(onContentChange) {
        if (typeof Quill === 'undefined') {
            console.error('Quill 미로드');
            return null;
        }
        var toolbar = [
            [{ font: [] }],
            [{ size: ['small', false, 'large', 'huge'] }],
            [{ header: [1, 2, 3, 4, 5, false] }],
            [{ color: [] }, { background: [] }],
            ['bold', 'italic', 'underline', 'strike', 'blockquote', 'code-block'],
            [{ align: [] }],
            [{ list: 'ordered' }, { list: 'bullet' }, { indent: '-1' }, { indent: '+1' }],
            ['link', 'image', 'video'],
            ['clean']
        ];
        var quill = new Quill('#tfEditor', {
            theme: 'snow',
            placeholder: '내용 입력',
            modules: {
                toolbar: {
                    container: toolbar,
                    handlers: {
                        image: function () {
                            var input = document.createElement('input');
                            input.type = 'file';
                            input.accept = 'image/*';
                            input.click();
                            input.onchange = function () {
                                var file = input.files && input.files[0];
                                if (!file) return;
                                fileToBase64(file).then(function (b64) {
                                    return window.CamaApi.postCommonImagesBase64Upload({ base64: b64 });
                                }).then(function (url) {
                                    var imgUrl = typeof url === 'string' ? url : (url && url[0]);
                                    if (!imgUrl) throw new Error('이미지 URL 없음');
                                    var range = quill.getSelection(true) || { index: quill.getLength() };
                                    quill.insertEmbed(range.index, 'image', imgUrl);
                                }).catch(function (e) {
                                    window.CamaUi.alert(e.message || String(e), '이미지 업로드');
                                });
                            };
                        }
                    }
                }
            }
        });
        quill.on('text-change', function () {
            onContentChange(quill.root.innerHTML);
        });
        return quill;
    }

    function renderCheckboxRow(container, items, isChecked, onToggle) {
        container.innerHTML = '';
        items.forEach(function (item) {
            var label = item.label != null ? item.label : item.name || item.optionName;
            var id = 'cb_' + Math.random().toString(36).slice(2);
            var wrap = document.createElement('div');
            wrap.className = 'checkbox-row';
            wrap.innerHTML =
                '<label class="checkbox-label" for="' + id + '">' +
                '<input type="checkbox" id="' + id + '"/> ' +
                '<span>' + label + '</span></label>';
            var inp = wrap.querySelector('input');
            inp.checked = isChecked(item);
            inp.addEventListener('change', function () {
                onToggle(item, inp.checked);
            });
            container.appendChild(wrap);
        });
    }

    window.TreatmentForm = {
        init: function () {
            var cfg = window.__TF_CONFIG__ || {};
            var mode = cfg.mode === 'edit' ? 'edit' : 'add';
            var seq = cfg.seq || null;
            var state = {
                title: '',
                content: '',
                targetInterestedAreas: [],
                liveThumb: [],
                diseaseType: null,
                diseaseTreatmentOptions: [],
                diseaseTreatmentGroup: {},
                targetDiseaseTreatments: [],
                diseaseOptionGroupList: [],
                diseaseOptionGroupSet: {},
                hospitalDiseaseGroup: {},
                diseaseOptions: [],
                targetDiseaseOptionGroup: {},
                viewed: 'NO'
            };
            var quill = null;

            function setState(patch) {
                Object.keys(patch).forEach(function (k) {
                    state[k] = patch[k];
                });
                refreshDynamicUi();
            }

            function refreshDynamicUi() {
                var sel = document.getElementById('tfDisease');
                if (sel) {
                    sel.innerHTML = '';
                    state.diseaseOptions.forEach(function (o) {
                        var opt = document.createElement('option');
                        opt.value = o.value;
                        opt.textContent = o.label;
                        sel.appendChild(opt);
                    });
                    if (state.diseaseType) {
                        sel.value = String(state.diseaseType.seq);
                    }
                }
                var titleEl = document.getElementById('tfTitle');
                if (titleEl) titleEl.value = state.title;
                var stepsHost = document.getElementById('tfSteps');
                if (stepsHost) {
                    renderCheckboxRow(stepsHost, state.diseaseTreatmentOptions, function (d) {
                    return state.targetDiseaseTreatments.some(function (t) { return t.seq === d.seq; });
                }, function (d, checked) {
                    var next = state.targetDiseaseTreatments.filter(function (t) { return t.seq !== d.seq; });
                    if (checked) next.push(d);
                    setState({ targetDiseaseTreatments: next });
                });
                }
                var attrHost = document.getElementById('tfAttributes');
                if (attrHost) {
                    attrHost.innerHTML = '';
                    state.diseaseOptionGroupList.forEach(function (g) {
                    var sec = document.createElement('div');
                    sec.className = 'attr-group';
                    sec.innerHTML = '<div class="form-grid__label">' + g.groupName + '</div><div class="attr-options"></div>';
                    var opts = sec.querySelector('.attr-options');
                    g.diseaseOptions.forEach(function (d) {
                        var id = 'ao_' + g.groupName + '_' + d.seq;
                        var row = document.createElement('label');
                        row.className = 'checkbox-label';
                        row.setAttribute('for', id);
                        var tg = state.targetDiseaseOptionGroup[g.groupName] || [];
                        var checked = tg.some(function (t) { return t.seq === d.seq; });
                        row.innerHTML = '<input type="checkbox" id="' + id + '"' + (checked ? ' checked' : '') + '/> <span>' + d.optionName + '</span>';
                        row.querySelector('input').addEventListener('change', function (e) {
                            var arr = (state.targetDiseaseOptionGroup[g.groupName] || []).slice();
                            var idx = arr.findIndex(function (t) { return t.seq === d.seq; });
                            if (e.target.checked && idx < 0) arr.push(d);
                            if (!e.target.checked && idx >= 0) arr.splice(idx, 1);
                            var copy = Object.assign({}, state.targetDiseaseOptionGroup);
                            copy[g.groupName] = arr;
                            setState({ targetDiseaseOptionGroup: copy });
                        });
                        opts.appendChild(row);
                    });
                    attrHost.appendChild(sec);
                });
                }
                var intHost = document.getElementById('tfInterest');
                if (intHost) {
                    renderCheckboxRow(intHost, INTEREST_OPTIONS, function (d) {
                    return state.targetInterestedAreas.indexOf(d.value) >= 0;
                }, function (d, checked) {
                    var arr = state.targetInterestedAreas.slice();
                    var i = arr.indexOf(d.value);
                    if (checked && i < 0) arr.push(d.value);
                    if (!checked && i >= 0) arr.splice(i, 1);
                    setState({ targetInterestedAreas: arr });
                });
                }
                var vwHost = document.getElementById('tfViewed');
                if (vwHost) {
                    vwHost.querySelectorAll('input[name="tfViewed"]').forEach(function (r) {
                        r.checked = r.value === state.viewed;
                    });
                }
                var img = document.getElementById('tfThumb');
                if (img) {
                    if (state.liveThumb && state.liveThumb[0]) {
                        img.src = state.liveThumb[0];
                        img.style.display = 'block';
                    } else {
                        img.removeAttribute('src');
                        img.style.display = 'none';
                    }
                }
            }

            function onDiseaseSelectChange(seqStr) {
                var seqNum = Number(seqStr);
                var d = state.hospitalDiseaseGroup[seqNum];
                if (!d) return;
                setState({
                    diseaseType: { seq: d.diseaseSeq, name: d.diseaseName },
                    diseaseTreatmentOptions: state.diseaseTreatmentGroup[seqNum] || [],
                    targetDiseaseTreatments: [],
                    targetDiseaseOptionGroup: {},
                    diseaseOptionGroupList: buildOptionGroupList(state.diseaseOptionGroupSet[seqNum] || [])
                });
            }

            function buildDto() {
                var diseaseOptionsFlat = [];
                Object.keys(state.targetDiseaseOptionGroup).forEach(function (k) {
                    (state.targetDiseaseOptionGroup[k] || []).forEach(function (v) {
                        diseaseOptionsFlat.push({
                            groupName: String(k),
                            optionName: String(v.optionName),
                            seq: Number(v.seq)
                        });
                    });
                });
                var hd = state.hospitalDiseaseGroup[state.diseaseType.seq];
                return {
                    careTimeType: '',
                    contents: state.content,
                    disease: {
                        diseaseOption: diseaseOptionsFlat,
                        diseaseSeq: state.diseaseType.seq,
                        diseaseTreatment: state.targetDiseaseTreatments,
                        name: state.diseaseType.name,
                        seq: hd.seq
                    },
                    diseaseSeq: state.diseaseType.seq,
                    image: state.liveThumb[0] || '',
                    interest: state.targetInterestedAreas,
                    title: state.title,
                    viewed: state.viewed === 'YES'
                };
            }

            function validateForSave() {
                if (!state.diseaseType) {
                    return '어떤 질환이신지 선택해주세요.';
                }
                if (mode === 'add' && state.viewed === 'YES') {
                    if (!state.title.trim()) return '제목을 입력하세요.';
                    if (!state.content || !String(state.content).trim()) return '내용을 입력하세요.';
                    if (!state.targetDiseaseTreatments.length) return '시기를 선택하세요.';
                    if (!state.targetInterestedAreas.length) return '관심영역을 선택하세요.';
                }
                if (mode === 'edit') {
                    if (!state.title.trim()) return '제목을 입력하세요.';
                    if (!state.content || !String(state.content).trim()) return '내용을 입력하세요.';
                    if (!state.targetDiseaseTreatments.length) return '시기를 선택하세요.';
                    if (!state.targetInterestedAreas.length) return '관심영역을 선택하세요.';
                }
                return null;
            }

            function wireDropzone() {
                var dz = document.getElementById('tfDropzone');
                var fin = document.getElementById('tfFile');
                if (!dz || !fin) return;
                dz.addEventListener('click', function () { fin.click(); });
                fin.addEventListener('change', function () {
                    var file = fin.files && fin.files[0];
                    if (!file) return;
                    var fd = new FormData();
                    fd.append('img', file, file.name);
                    window.CamaApi.postCommonImagesUpload(fd)
                        .then(function (urls) {
                            var arr = Array.isArray(urls) ? urls : [urls];
                            setState({ liveThumb: arr });
                        })
                        .catch(function (e) {
                            window.CamaUi.alert(e.message || String(e), '이미지 업로드');
                        });
                    fin.value = '';
                });
            }

            function start() {
                if (!window.CamaApi.getToken()) {
                    window.location.href = '/login';
                    return;
                }
                window.CamaApi.getDoctorMe()
                    .then(function (doctor) {
                        var hSeq = doctor.hospitalSeq;
                        var p1 = window.CamaApi.getCommonHospitalDiseaseList(hSeq);
                        if (mode === 'edit') {
                            return Promise.all([p1, window.CamaApi.getDoctorContentsView(seq)]);
                        }
                        return p1.then(function (res) { return [res, null]; });
                    })
                    .then(function (tuple) {
                        var res = tuple[0];
                        var treatmentInfo = tuple[1];
                        var merged = mergeHospitalArrays(res);
                        Object.assign(state, merged);
                        if (mode === 'edit' && treatmentInfo) {
                            var interestArr = [];
                            try {
                                interestArr = JSON.parse(treatmentInfo.interest || '[]');
                            } catch (e1) { /* ignore */ }
                            var diseaseParsed = {};
                            try {
                                diseaseParsed = JSON.parse(treatmentInfo.disease || '{}');
                            } catch (e2) { /* ignore */ }
                            var diseaseTreatment = diseaseParsed.diseaseTreatment || [];
                            var diseaseOption = diseaseParsed.diseaseOption || [];
                            var ds = treatmentInfo.diseaseSeq;
                            var hdg = state.hospitalDiseaseGroup[ds];
                            var dtOpts = (hdg && hdg.diseaseTreatment) || merged.diseaseTreatmentOptions;
                            var optList = buildOptionGroupList((hdg && hdg.diseaseOption) || state.diseaseOptionGroupSet[ds] || []);
                            var optGroup = groupBy(diseaseOption, 'groupName');
                            Object.keys(optGroup).forEach(function (k) {
                                optGroup[k] = optGroup[k].map(function (x) {
                                    return { optionName: x.optionName, seq: x.seq };
                                });
                            });
                            Object.assign(state, {
                                title: treatmentInfo.title,
                                content: treatmentInfo.contents,
                                targetInterestedAreas: interestArr,
                                liveThumb: treatmentInfo.image ? [treatmentInfo.image] : [],
                                diseaseType: { seq: ds, name: treatmentInfo.diseaseName },
                                targetDiseaseTreatments: diseaseTreatment,
                                targetDiseaseOptionGroup: optGroup,
                                viewed: treatmentInfo.viewed ? 'YES' : 'NO',
                                diseaseTreatmentOptions: dtOpts,
                                diseaseOptionGroupList: optList
                            });
                        }
                        document.getElementById('tfTitle').addEventListener('input', function () {
                            state.title = this.value;
                        });
                        document.getElementById('tfDisease').addEventListener('change', function () {
                            onDiseaseSelectChange(this.value);
                        });
                        quill = initQuill(function (html) {
                            state.content = html;
                        });
                        if (state.content) {
                            quill.root.innerHTML = state.content;
                        }
                        wireDropzone();
                        var vwh = document.getElementById('tfViewed');
                        if (vwh && !vwh.dataset.bound) {
                            vwh.dataset.bound = '1';
                            vwh.addEventListener('change', function (e) {
                                var t = e.target;
                                if (t && t.name === 'tfViewed') {
                                    state.viewed = t.value;
                                }
                            });
                        }
                        refreshDynamicUi();
                        bindActions();
                    })
                    .catch(function (e) {
                        window.CamaUi.alert(e.message || String(e)).then(function () {
                            history.back();
                        });
                    });
            }

            function bindActions() {
                if (mode === 'add') {
                    var bc = document.getElementById('tfBtnCancel');
                    var bs = document.getElementById('tfBtnSave');
                    if (!bc || !bs) return;
                    bc.addEventListener('click', function () {
                        window.CamaUi.confirm('작성한 내용을 취소하고 이전 페이지로 이동하시겠습니까?').then(function (ok) {
                            if (ok) history.back();
                        });
                    });
                    bs.addEventListener('click', function () {
                        window.CamaUi.confirm('저장하시겠습니까?').then(function (ok) {
                            if (!ok) return;
                            var err = validateForSave();
                            if (err) {
                                window.CamaUi.alert(err);
                                return;
                            }
                            var dto = buildDto();
                            window.CamaApi.postDoctorContents(dto)
                                .then(function (res) {
                                    if (res) {
                                        return window.CamaApi.refreshSidebarCountsFromApi().catch(function () {}).then(function () {
                                            return window.CamaUi.alert('저장되었습니다.').then(function () {
                                                if (state.viewed === 'YES') {
                                                    history.back();
                                                } else {
                                                    window.location.href = '/content-management/treatment/disabled/list';
                                                }
                                            });
                                        });
                                    }
                                })
                                .catch(function (e) {
                                    window.CamaUi.alert(e.message || String(e));
                                });
                        });
                    });
                } else {
                    var bcr = document.getElementById('tfBtnCancelReload');
                    var bdel = document.getElementById('tfBtnDelete');
                    var bup = document.getElementById('tfBtnUpdate');
                    if (!bcr || !bdel || !bup) return;
                    bcr.addEventListener('click', function () {
                        window.CamaUi.confirm('수정한 내용을 취소하시겠습니까?').then(function (ok) {
                            if (ok) window.location.reload();
                        });
                    });
                    bdel.addEventListener('click', function () {
                        window.CamaUi.confirm('삭제하시겠습니까?').then(function (ok) {
                            if (!ok) return;
                            window.CamaApi.deleteDoctorContentsView(seq)
                                .then(function (res) {
                                    if (res) {
                                        return window.CamaApi.refreshSidebarCountsFromApi().catch(function () {}).then(function () {
                                            return window.CamaUi.alert('삭제되었습니다.').then(function () {
                                                history.back();
                                            });
                                        });
                                    }
                                })
                                .catch(function (e) {
                                    window.CamaUi.alert(e.message || String(e));
                                });
                        });
                    });
                    bup.addEventListener('click', function () {
                        window.CamaUi.confirm('수정하시겠습니까?').then(function (ok) {
                            if (!ok) return;
                            var err = validateForSave();
                            if (err) {
                                window.CamaUi.alert(err);
                                return;
                            }
                            var dto = buildDto();
                            window.CamaApi.putDoctorContentsView(seq, dto)
                                .then(function (res) {
                                    if (res) {
                                        return window.CamaApi.refreshSidebarCountsFromApi().catch(function () {}).then(function () {
                                            return window.CamaUi.alert('수정되었습니다.');
                                        });
                                    }
                                })
                                .catch(function (e) {
                                    window.CamaUi.alert(e.message || String(e));
                                });
                        });
                    });
                }
            }

            start();
        }
    };
})();
