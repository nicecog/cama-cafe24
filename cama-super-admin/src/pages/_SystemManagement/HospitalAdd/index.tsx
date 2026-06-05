import React, {Fragment, useEffect, useState} from 'react';
import { Typography, Grid } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';

/** Types **/
import { HospitalDto } from '../../../services/apis/adminHospital/request';

/** Components **/
import { CardContainer } from 'components/PageCard';
import { TextInput } from '../../../components/_Styled/TextFields';
import { Container, Content } from '../../../components/Layout/Detail';
import { SubmitButton } from '../../../components/_Styled/Buttons';
import { Section } from '../../../components/_Styled/Views';
import PageHeader from 'components/PageHeader';

import AlertModal from 'components/Modals/AlertModal';
import ConfirmModal from 'components/Modals/ConfirmModal';

/** Services **/
import adminHospitalApi from '../../../services/apis/adminHospital';

/** Hooks **/
import useAlertState from 'hooks/useAlertState';

interface PageState {
  name: string;
  bizNumber: string;
  address: string;
  homepage: string;
  managerName: string;
  managerMajor: string;
  managerEmail: string;
  managerPhone: string;
}

function HospitalAddPage() {
  const navigate = useNavigate();
  const { userSeq } = useParams<{ userSeq: string }>();
  const [state, setState] = useState<PageState>({
    name: '',
    bizNumber: '',
    address: '',
    homepage: '',
    managerName: '',
    managerMajor: '',
    managerEmail: '',
    managerPhone: '',
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

  const onSubmit = () => {
    const { name, bizNumber, address, homepage, managerName, managerMajor, managerEmail, managerPhone } = state;

    if (name === '') {
      onShowAlert('병원명은 필수 입니다.');
      return;
    };

    if (bizNumber === '') {
      onShowAlert('사업자 등록번호는 필수 입니다.');
      return;
    };

    if (address === '') {
      onShowAlert('주소는 필수 입니다.');
      return;
    };

    const dto: HospitalDto = {
      address: address,
      corpNumber: bizNumber,
      homepage: homepage,
      name: name,
      profEmail: managerEmail,
      profMajor: managerMajor,
      profName: managerName,
      profPhone: managerPhone,
    };

    adminHospitalApi
      .addAdminHospital(dto)
      .then(res => {
        if (res) {
          onShowAlert('등록되었습니다.', () => {
            navigate(-1);
          });
        }
      })
      .catch(err => {
        onShowAlert(err);
      });
  };

  const { name, bizNumber, address, homepage, managerName, managerMajor, managerEmail, managerPhone } = state;
  const { alertFlag, alertTitle, confirmFlag, confirmTitle } = alertState

  return (
    <div>
      <PageHeader title={'병원정보 등록'} />
      <CardContainer>
        <Container>
          <Content>
            <Section>
              <Grid container rowSpacing={4}>
                <Fragment>
                  <Grid item xs={3}>
                    <Typography variant="subtitle1">병원 명칭</Typography>
                  </Grid>
                  <Grid item xs={9}>
                    <TextInput
                      required
                      fullWidth
                      placeholder={''}
                      value={name}
                      onChange={(e) => changeState({ name: e.target.value })}
                    />
                  </Grid>
                </Fragment>
                <Fragment>
                  <Grid item xs={3}>
                    <Typography variant="subtitle1">사업자 등록번호</Typography>
                  </Grid>
                  <Grid item xs={9}>
                    <TextInput
                      required
                      fullWidth
                      placeholder={''}
                      value={bizNumber}
                      onChange={(e) => changeState({ bizNumber: e.target.value })}
                    />
                  </Grid>
                </Fragment>
                <Fragment>
                  <Grid item xs={3}>
                    <Typography variant="subtitle1">주소</Typography>
                  </Grid>
                  <Grid item xs={9}>
                    <TextInput
                      required
                      fullWidth
                      placeholder={''}
                      value={address}
                      onChange={(e) => changeState({ address: e.target.value })}
                    />
                  </Grid>
                </Fragment>
                <Fragment>
                  <Grid item xs={3}>
                    <Typography variant="subtitle1">홈페이지</Typography>
                  </Grid>
                  <Grid item xs={9}>
                    <TextInput
                      fullWidth
                      placeholder={''}
                      value={homepage}
                      onChange={(e) => changeState({ homepage: e.target.value })}
                    />
                  </Grid>
                </Fragment>
                <Fragment>
                  <Grid item xs={3}>
                    <Typography variant="subtitle1">담당 교수</Typography>
                  </Grid>
                  <Grid item xs={9}>
                    <TextInput
                      required
                      fullWidth
                      placeholder={''}
                      value={managerName}
                      onChange={(e) => changeState({ managerName: e.target.value })}
                    />
                  </Grid>
                </Fragment>
                <Fragment>
                  <Grid item xs={3}>
                    <Typography variant="subtitle1">담당 교수 전공</Typography>
                  </Grid>
                  <Grid item xs={9}>
                    <TextInput
                      required
                      fullWidth
                      placeholder={''}
                      value={managerMajor}
                      onChange={(e) => changeState({ managerMajor: e.target.value })}
                    />
                  </Grid>
                </Fragment>
                <Fragment>
                  <Grid item xs={3}>
                    <Typography variant="subtitle1">담당 교수 이메일</Typography>
                  </Grid>
                  <Grid item xs={9}>
                    <TextInput
                      required
                      fullWidth
                      placeholder={''}
                      value={managerEmail}
                      onChange={(e) => changeState({ managerEmail: e.target.value })}
                    />
                  </Grid>
                </Fragment>
                <Fragment>
                  <Grid item xs={3}>
                    <Typography variant="subtitle1">담당 교수 연락처</Typography>
                  </Grid>
                  <Grid item xs={9}>
                    <TextInput
                      required
                      fullWidth
                      placeholder={''}
                      value={managerPhone}
                      onChange={(e) => changeState({ managerPhone: e.target.value })}
                    />
                  </Grid>
                </Fragment>
              </Grid>
            </Section>

            <Section>
              <Grid container rowSpacing={4}>
                <Grid item xs={5.5}>
                  <SubmitButton
                    onClick={() => {
                      onShowConfirm('작성하신 내용을 취소하시겠습니까?', () => {
                        navigate(-1);
                      });
                    }}
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
                    onClick={() => {
                      onShowConfirm('등록하시겠습니까?', () => {
                        onSubmit();
                      })
                    }}
                    style={{ border: '1px solid #00AB55', backgroundColor: '#00AB55', marginTop: 32 }}
                  >
                    <Typography variant="subtitle2" color="white">
                      등록
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

export default HospitalAddPage;
