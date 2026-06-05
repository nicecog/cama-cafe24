/**
 * 기존 React mainApiClient + axios 인터셉터와 동일한 Billive 응답 언랩.
 * 요청은 동일 출처 /proxy 로 전달합니다.
 */
(function () {
    var TOKEN_KEY = 'CAMA-ADMIN/apiToken';

    function getStoredToken() {
        try {
            var raw = localStorage.getItem(TOKEN_KEY);
            if (!raw) return null;
            return JSON.parse(raw);
        } catch (e) {
            return null;
        }
    }

    function setStoredToken(token) {
        localStorage.setItem(TOKEN_KEY, JSON.stringify(token));
    }

    function clearStoredToken() {
        localStorage.removeItem(TOKEN_KEY);
    }

    function unwrapEnvelope(data) {
        if (!data || typeof data !== 'object') {
            throw new Error('잘못된 응답 형식입니다.');
        }
        var error = data.error;
        var pagination = data.pagination;
        var response = data.response;
        var success = data.success;
        if (error) {
            var msg = error.message || JSON.stringify(error);
            throw new Error(msg);
        }
        if (success === false) {
            throw new Error('요청이 실패했습니다.');
        }
        if (pagination === null || pagination === undefined) {
            return response;
        }
        return { data: response, pagination: pagination };
    }

    window.CamaApi = {
        TOKEN_KEY: TOKEN_KEY,
        getToken: getStoredToken,
        setToken: setStoredToken,
        clearToken: clearStoredToken,

        /**
         * Billive API 호출 (경로는 /api/... 부터, 프록시 접두사 제외)
         */
        request: function (method, path, body) {
            var headers = { Accept: 'application/json' };
            var token = getStoredToken();
            if (token) {
                var bearer = 'Bearer ' + token;
                headers['api_key'] = bearer;
                // Cafe24 무료도메인 프록시는 api_key(underscore) 헤더를 제거할 수 있음
                headers['Authorization'] = bearer;
            }
            if (body !== undefined && body !== null) {
                headers['Content-Type'] = 'application/json';
            }
            return fetch('/proxy' + path, {
                method: method,
                headers: headers,
                body: body !== undefined && body !== null ? JSON.stringify(body) : undefined
            }).then(function (res) {
                return res.text().then(function (text) {
                    var json;
                    try {
                        json = text ? JSON.parse(text) : {};
                    } catch (e) {
                        throw new Error(text || 'JSON 파싱 실패');
                    }
                    if (!res.ok) {
                        var msg = (json && json.error && json.error.message) || text || res.statusText;
                        throw new Error(msg);
                    }
                    return unwrapEnvelope(json);
                });
            });
        },

        get: function (path) {
            return this.request('GET', path);
        },

        post: function (path, body) {
            return this.request('POST', path, body);
        },

        put: function (path, body) {
            return this.request('PUT', path, body);
        },

        delete: function (path) {
            return this.request('DELETE', path);
        },

        /**
         * multipart/form-data (이미지 업로드 등). Content-Type은 브라우저가 boundary와 함께 설정합니다.
         */
        postForm: function (path, formData) {
            var headers = { Accept: 'application/json' };
            var token = getStoredToken();
            if (token) {
                var bearer = 'Bearer ' + token;
                headers['api_key'] = bearer;
                // Cafe24 무료도메인 프록시는 api_key(underscore) 헤더를 제거할 수 있음
                headers['Authorization'] = bearer;
            }
            return fetch('/proxy' + path, {
                method: 'POST',
                headers: headers,
                body: formData
            }).then(function (res) {
                return res.text().then(function (text) {
                    var json;
                    try {
                        json = text ? JSON.parse(text) : {};
                    } catch (e) {
                        throw new Error(text || 'JSON 파싱 실패');
                    }
                    if (!res.ok) {
                        var msg = (json && json.error && json.error.message) || text || res.statusText;
                        throw new Error(msg);
                    }
                    return unwrapEnvelope(json);
                });
            });
        },

        /**
         * React src/services/apis 와 동일한 Billive 경로 래퍼 (프록시 /proxy 경유)
         * — auth
         */
        postAuth: function (dto) {
            return this.post('/api/auth', dto);
        },
        postAuthDoctor: function (dto) {
            return this.post('/api/auth/doctor', dto);
        },

        /** — doctorContents */
        getDoctorMe: function () {
            return this.get('/api/doctor/me');
        },
        getDoctorCountInfo: function () {
            return this.get('/api/doctor/count/info');
        },
        getDoctorContentsList: function (page, searchType, searchText) {
            return this.get('/api/doctor/contents?page=' + encodeURIComponent(page) +
                '&searchType=' + encodeURIComponent(searchType) +
                '&searchText=' + encodeURIComponent(searchText || ''));
        },
        getDoctorContentsDisabledList: function (page, searchType, searchText) {
            return this.get('/api/doctor/disable/contents?page=' + encodeURIComponent(page) +
                '&searchType=' + encodeURIComponent(searchType) +
                '&searchText=' + encodeURIComponent(searchText || ''));
        },
        postDoctorContents: function (dto) {
            return this.post('/api/doctor/contents', dto);
        },
        getDoctorContentsView: function (seq) {
            return this.get('/api/doctor/contents/' + encodeURIComponent(seq) + '/view');
        },
        putDoctorContentsView: function (seq, dto) {
            return this.put('/api/doctor/contents/' + encodeURIComponent(seq) + '/view', dto);
        },
        deleteDoctorContentsView: function (seq) {
            return this.delete('/api/doctor/contents/' + encodeURIComponent(seq) + '/view');
        },
        getDoctorServiceList: function (page) {
            var q = (page !== undefined && page !== null && page !== '')
                ? ('?page=' + encodeURIComponent(page))
                : '';
            return this.get('/api/doctor/service' + q);
        },
        getDoctorServiceView: function (seq) {
            return this.get('/api/doctor/service/' + encodeURIComponent(seq) + '/view');
        },
        putDoctorServiceView: function (seq, dto) {
            return this.put('/api/doctor/service/' + encodeURIComponent(seq) + '/view', dto);
        },

        /** — monitoring */
        getMonitoringPatientList: function (page, searchType, searchText) {
            return this.get('/api/monitoring/patient?page=' + encodeURIComponent(page) +
                '&searchType=' + encodeURIComponent(searchType) +
                '&searchText=' + encodeURIComponent(searchText || ''));
        },

        /** — contents (웹뷰) */
        getContentsDetailForWebview: function (seq) {
            return this.get('/api/contents/' + encodeURIComponent(seq) + '/webview');
        },

        /** — common */
        postCommonImagesUpload: function (formData) {
            return this.postForm('/api/common/images/upload', formData);
        },
        postCommonImagesBase64Upload: function (dto) {
            return this.post('/api/common/images/base64/upload', dto);
        },
        postCommonCareTimeType: function () {
            return this.post('/api/common/care/time/type', {});
        },
        getCommonDiseaseDetailList: function (hospitalSeq) {
            return this.get('/api/common/disease/' + encodeURIComponent(hospitalSeq) + '/detail/list');
        },
        getCommonDiseaseList: function () {
            return this.get('/api/common/disease/list');
        },
        getCommonHospitalDiseaseList: function (hospitalSeq) {
            return this.get('/api/common/hospital/' + encodeURIComponent(hospitalSeq) + '/disease/list/B');
        },

        /**
         * React Navigation / 치료 목록과 동일: 건수 API 후 사이드바 배지 갱신
         */
        refreshSidebarCountsFromApi: function () {
            return this.getDoctorCountInfo().then(function (res) {
                var d = document.getElementById('navCountDone');
                var ing = document.getElementById('navCountIng');
                if (d && res && typeof res.doneContents === 'number') {
                    d.textContent = ' (' + res.doneContents + ')';
                }
                if (ing && res && typeof res.ingContents === 'number') {
                    ing.textContent = ' (' + res.ingContents + ')';
                }
                return res;
            });
        }
    };
})();
