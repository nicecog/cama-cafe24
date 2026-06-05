import React, {Fragment, useEffect, useState} from 'react';
import { Typography, Grid, Box, styled } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';

/** Types **/
import { CareTimeInfo } from '../../services/apis/contents/response';
import { NewDiseaseInfo } from '../../services/apis/doctorContents/request';

/** Components **/
import Editor from '../../components/Editor';

import AlertModal from 'components/Modals/AlertModal';
import ConfirmModal from 'components/Modals/ConfirmModal';

/** Styles **/

/** Services **/
import contentsApi from '../../services/apis/contents';

/** Hooks **/
import useAlertState from 'hooks/useAlertState';

/** Helpers **/

type FontType = 'NORMAL' | 'LARGE' | 'MORE_LARGE';

interface PageState {
  content: string;
  interest: string[];
  careTimeList: string[];
  fontType: FontType;
}

function PublicCareTrackPage() {
  const navigate = useNavigate();
  const { seq } = useParams<{ seq: string }>();
  const [state, setState] = useState<PageState>({
    content: '',
    interest: [],
    careTimeList: [],
    fontType: 'NORMAL',
  });
  const {
    alertState,
    onShowAlert,
    onCloseAlert,
    onShowConfirm,
    onConfirmDone,
    onConfirmCancel,
  } = useAlertState();

  const changeState = (newState: Partial<PageState>) => {
    setState(prev => ({
      ...prev,
      ...newState,
    }));
  };

  const getFontSize = (fontType: FontType) => {
    switch (fontType) {
      case 'LARGE':
        return 20;
      case 'MORE_LARGE':
        return 24;
      default:
        return 16;
    }
  };

  const initData = (detailSeq: string) => {
    contentsApi
      .getContentsDetailForWebview(detailSeq)
      .then(res => {
        const careTimes = JSON.parse(res.disease || '{}') as NewDiseaseInfo;

        changeState({
          content: res.contents,
          interest: JSON.parse(res.interest || '[]') as string[],
          careTimeList: careTimes.diseaseTreatment === undefined ? [] : careTimes.diseaseTreatment.map(d => d.name),
        });
      })
      .catch(err => onShowAlert(err))
  };

  useEffect(() => {
    if (seq === undefined || isNaN(Number(seq))) {
      onShowAlert('잘못된 접근입니다.', () => {
        navigate(-1);
      })
      return ;
    }

    initData(seq);
  }, []);

  const { content, interest, careTimeList, fontType } = state;
  const { alertFlag, alertTitle, confirmFlag, confirmTitle } = alertState

  return (
    <div style={{ background: '#FFF' }}>
      <Editor
        value={content}
        onChange={text => {}}
        placeholder={'내용 입력'}
        readOnly
        fs={getFontSize(fontType)}
      />
      <InfoView>
        <span
          style={{
            color: '#696969',
            fontSize: 14,
            fontWeight: 400,
          }}
        >
          * 본 정보는 질환의 진단과 치료과정에 대한 일반적인 가이드만을 제공합니다. 정보의 적용,진단과 치료에 대한 모든 결정은 담당 의료진과 직접 상의하시기 바랍니다.
        </span>
      </InfoView>
      <AreaViewWrap>
        <AreaView>
          <AreaRow>
            <AreaLabel>시기</AreaLabel>
            <AreaUl>
              {careTimeList.map(d => (
                <AreaLi key={d}>{d}</AreaLi>
              ))}
            </AreaUl>
          </AreaRow>
          <AreaRow>
            <AreaLabel>영역</AreaLabel>
            <AreaUl>
              {interest.map(d => (
                <AreaLi key={d}>{d}</AreaLi>
              ))}
            </AreaUl>
          </AreaRow>
        </AreaView>
      </AreaViewWrap>
      <FontControlView>
        <span
          style={{
            color: '#000',
            fontSize: 16,
            fontWeight: 400,
          }}
        >
          글자크기
        </span>
        <FontBtnView>
          <TagView
            selected={fontType === 'NORMAL'}
            onClick={() => changeState({ fontType: 'NORMAL'})}
          >
            <TagText selected={fontType === 'NORMAL'}>보통</TagText>
          </TagView>
          <TagView
            selected={fontType === 'LARGE'}
            onClick={() => changeState({ fontType: 'LARGE'})}
          >
            <TagText selected={fontType === 'LARGE'}>크게</TagText>
          </TagView>
          <TagView
            selected={fontType === 'MORE_LARGE'}
            onClick={() => changeState({ fontType: 'MORE_LARGE'})}
          >
            <TagText selected={fontType === 'MORE_LARGE'}>더크게</TagText>
          </TagView>
        </FontBtnView>
      </FontControlView>

      {alertFlag &&
        <AlertModal
          title={alertTitle}
          onCloseModal={onCloseAlert}
        />}
      {confirmFlag &&
        <ConfirmModal
          title={confirmTitle}
          onDoneModal={onConfirmDone}
          onCloseModal={onConfirmCancel}
        />}
    </div>
  );
}

export default PublicCareTrackPage;

const InfoView = styled('div')`
  padding: 0 16px;
`;

const FontControlView = styled('div')`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
  border-top: 1px solid #D3D3D3;
  margin-top: 40px;
`

const FontBtnView =  styled('div')`
  display: flex;
  align-items: center;
  gap: 8px;
`

const TagView = styled('div')<{ selected: boolean }>`
  padding: 8px 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50px;
  border: 1px solid #979797;
  ${({ selected }) => selected && `
    border: 2px solid #1E71C0;
  `}
`

const TagText = styled('span')<{ selected: boolean }>`
  color: #979797;
  font-size: 16px;
  font-weight: 400;
  ${({ selected }) => selected && `
    color: #1E71C0;
    font-weight: 700;
  `}
`
const AreaViewWrap = styled('div')`
  padding: 0 16px;
  margin-top: 16px;
`;

const AreaView = styled('div')`
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  background: #F4F4F4;
`;

const AreaRow = styled('div')`
  display: flex;
  align-items: flex-start;
`;

const AreaLabel = styled('span')`
  display: block;
  color: #979797;
  font-size: 16px;
  font-weight: 400;
  width: 40px;
`;

const AreaUl = styled('ul')`
  display: flex;
  flex: 1;
  flex-wrap: wrap;
  list-style-type: none;
  gap: 16px;
`;

const AreaLi = styled('li')`
  color: #000;
  font-size: 16px;
  font-weight: 400;
`;
