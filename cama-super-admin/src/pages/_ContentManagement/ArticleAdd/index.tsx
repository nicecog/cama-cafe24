import React, {Fragment, useEffect, useState} from 'react';
import { Typography, Grid } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';

/** Types **/


/** Components **/
import { CardContainer } from 'components/PageCard';
import { TextInput } from '../../../components/_Styled/TextFields';
import { Container, Content } from '../../../components/Layout/Detail';
import { SubmitButton } from '../../../components/_Styled/Buttons';
import { Section, ThumbImgView, ThumbImg } from '../../../components/_Styled/Views';
import CustomSelect from '../../../components/Select/CustomSelect';
import PageHeader from 'components/PageHeader';
import BasicDropzone from '../../../components/Dropzone/BasicDropzone';
import CheckboxItem from '../../../components/Checkbox/CheckboxItem';
import Editor from '../../../components/Editor';
import Select from '../../../components/Select';

import BasicModal from '../../../components/Modals/BasicModal';
import AlertModal from 'components/Modals/AlertModal';
import ConfirmModal from 'components/Modals/ConfirmModal';

/** Styles **/

/** Hooks **/
import useAlertState from 'hooks/useAlertState';

/** Helpers **/
import { jhComma } from '../../../utils/numbers';

interface PageState {
  title: string;
  content: string;
}

function ArticleAddPage() {
  const navigate = useNavigate();
  const { userSeq } = useParams<{ userSeq: string }>();
  const [state, setState] = useState<PageState>({
    title: '',
    content: '',
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

  const { title, content } = state;
  const { alertFlag, alertTitle, confirmFlag, confirmTitle } = alertState

  return (
    <div>
      <PageHeader title={'볼거리 등록'} />
      <CardContainer>
        <Container>
          <Content>
            <Section>
              <Grid container rowSpacing={4}>
                <Fragment>
                  <Grid item xs={3}>
                    <Typography variant="subtitle1">제목</Typography>
                  </Grid>
                  <Grid item xs={9}>
                    <TextInput
                      required
                      fullWidth
                      placeholder={'Ex. 컨텐츠 제목을 입력하세요.'}
                      value={title}
                      onChange={(e) => changeState({ title: e.target.value })}
                    />
                  </Grid>
                </Fragment>

                <Fragment>
                  <Grid item xs={3}>
                    <Typography variant="subtitle1">상세내용</Typography>
                  </Grid>
                  <Grid item xs={9}>
                    <Editor
                      value={content}
                      onChange={(text) => changeState({ content: text })}
                      placeholder={'상세내용 입력'}
                    />
                  </Grid>
                </Fragment>
              </Grid>
            </Section>

            <Section>
              <Grid container rowSpacing={4}>
                <Grid item xs={5.5}>
                  <SubmitButton
                    onClick={() => navigate(-1)}
                    style={{ border: '1px solid red', backgroundColor: '#FFF', marginTop: 32 }}
                  >
                    <Typography variant="subtitle2" color="red">
                      취소
                    </Typography>
                  </SubmitButton>
                </Grid>
                <Grid item xs={1}/>
                <Grid item xs={5.5}>
                  <SubmitButton
                    onClick={() => navigate(-1)}
                    style={{ border: '1px solid #00AB55', backgroundColor: '#00AB55', marginTop: 32 }}
                  >
                    <Typography variant="subtitle2" color="white">
                      저장
                    </Typography>
                  </SubmitButton>
                </Grid>
              </Grid>
            </Section>
          </Content>
        </Container>
      </CardContainer>


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

export default ArticleAddPage;
