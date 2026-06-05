/**
 * 볼거리 등록 (React ArticleAddPage — 원본은 저장 시 API 없이 navigate(-1))
 * 저장 API가 생기면 CamaApi.post(...) 호출 후 목록으로 이동하도록 바꿉니다.
 */
(function () {
    function fileToBase64(file) {
        return new Promise(function (resolve, reject) {
            var r = new FileReader();
            r.onload = function () { resolve(r.result); };
            r.onerror = reject;
            r.readAsDataURL(file);
        });
    }

    document.addEventListener('DOMContentLoaded', function () {
        if (typeof Quill === 'undefined') return;

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

        var quill = new Quill('#afEditor', {
            theme: 'snow',
            placeholder: '상세내용 입력',
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

        document.getElementById('afBtnCancel').addEventListener('click', function () {
            window.location.href = '/content-management/article/list';
        });

        document.getElementById('afBtnSave').addEventListener('click', function () {
            window.CamaUi.confirm('저장하시겠습니까? (현재는 API 미연동 — 목록으로 이동합니다)').then(function (ok) {
                if (!ok) return;
                window.location.href = '/content-management/article/list';
            });
        });
    });
})();
