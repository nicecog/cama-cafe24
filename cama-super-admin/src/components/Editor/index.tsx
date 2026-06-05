import React, { useMemo, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import ReactQuill, { ReactQuillProps } from 'react-quill';
import styled from 'styled-components';

import 'react-quill/dist/quill.snow.css';
import commonApi from '../../services/apis/common';
import { convertImageToBase64 } from 'utils/imageReader';

// Github: https://github.com/zenoamaro/react-quill#themes
// Quill 공식 홈페이지 : https://quilljs.com/

const StyledEditor = styled(ReactQuill)<{ hideToolbar: boolean; fontSize?: number; }>`
  .ql-editor {
    min-height: 300px;
  }
  ${({hideToolbar, fontSize }) => hideToolbar && `
    .ql-toolbar {
      display: none;
    }
    .ql-container.ql-snow {
      border: unset;
    }
    .ql-editor {
      padding: 20px;
      font-size: ${fontSize || 16}px;
    }
    .ql-video {
      width: 100%;
      aspect-ratio: 2;
    }
    img: {
      width: 100%;
    }
  `}
`;

function Editor({ value, onChange, placeholder = '내용을 입력하세요', readOnly = false, fs }: ReactQuillProps & { fs?: number }) {
  const ref = useRef<ReactQuill>();
  // const [searchParams, setSearchParams] = useSearchParams();
  // const fs = searchParams.get('fs');

  // 이미지 업로드 관련
  const imageHandler = () => {
    const input = document.createElement('input');

    input.setAttribute('type', 'file');
    input.setAttribute('accept', 'image/*');
    input.click();

    input.onchange = async () => {
      const file = input.files;
      if (!file) return;

      try {
        const base64Image = await convertImageToBase64(file[0]);

        const response = await commonApi.uploadBase64Image({ base64: base64Image });
        if (!response) throw new Error('에디터 이미지 업로드 중 에러 발생');

        // 현재 커서 위치에 이미지 태그 삽입
        const range = ref.current?.getEditor().getSelection()?.index;
        if (range !== null && range !== undefined) {
          const quill = ref.current?.getEditor();

          quill?.setSelection(range, 1);

          quill?.clipboard.dangerouslyPasteHTML(range, `<img src=${response[0]} alt="이미지 태그가 삽입됩니다." />`);
        }
      } catch (e) {
        console.error(e);
      }
    };
  };

  const modules = useMemo(
    () => ({
      toolbar: {
        container: [
          [{ font: [] }],
          [{ size: ['small', false, 'large', 'huge'] }],
          [{ header: [1, 2, 3, 4, 5, 6] }],
          [{ color: [] }, { background: [] }],
          ['bold', 'italic', 'underline', 'strike', 'blockquote', 'code-block'],
          [{ align: [] }],
          [{ list: 'ordered' }, { list: 'bullet' }, { indent: '-1' }, { indent: '+1' }],
          ['link', 'image', 'video'],
          ['clean'],
        ],
        handlers: {
          image: imageHandler,
        },
      },
    }),
    [],
  );

  return (
    <StyledEditor
      theme="snow"
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      modules={modules}
      readOnly={readOnly}
      hideToolbar={readOnly}
      fontSize={fs}
      ref={(el) => {
        if (el !== null) {
          ref.current = el;
        }
      }}
    />
  );
}

export default Editor;
