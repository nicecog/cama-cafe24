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

/** Services **/
import adminHospitalApi from '../../../services/apis/adminHospital';

/** Hooks **/
import useAlertState from 'hooks/useAlertState';

/** Helpers **/
import { jhComma } from '../../../utils/numbers';

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

function HospitalDetailPage() {
  const navigate = useNavigate();
  const { hospitalSeq } = useParams<{ hospitalSeq: string }>();
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

  const onRemoveHospital = () => {
    adminHospitalApi
      .removeAdminHospital(Number(hospitalSeq))
      .then(res => {
        if (res) {
          onShowAlert('삭제되었습니다.', () => {
            navigate(-1);
          });
        }
      })
      .catch(err => {
        onShowAlert(err);
      });
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
      .updateAdminHospital(Number(hospitalSeq), dto)
      .then(res => {
        if (res) {
          onShowAlert('수정되었습니다.', () => {
            navigate(-1);
          });
        }
      })
      .catch(err => {
        onShowAlert(err);
      });
  };

  const initData = () => {
    adminHospitalApi
      .getAdminHospitalDetail(Number(hospitalSeq))
      .then(res => {
        if (res) {
          changeState({
            name: res.name,
            bizNumber: res.corpNumber,
            address: res.address,
            homepage: res.homepage,
            managerName: res.profName,
            managerMajor: res.profMajor,
            managerEmail: res.profEmail,
            managerPhone: res.profPhone,
          });
        }
      })
      .catch(err => {
        onShowAlert(err);
      });
  };

  useEffect(() => {
    initData();
  }, []);

  const { name, bizNumber, address, homepage, managerName, managerMajor, managerEmail, managerPhone } = state;
  const { alertFlag, alertTitle, confirmFlag, confirmTitle } = alertState

  return (
    <div>
      <PageHeader title={'병원정보 수정'} />
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
                <Grid item xs={3.8}>
                  <SubmitButton
                    onClick={() => {
                      onShowConfirm('변경사항을 취소하시겠습니까?', () => {
                        initData();
                      })
                    }}
                    style={{ border: '1px solid red', backgroundColor: '#FF0000', marginTop: 32 }}
                  >
                    <Typography variant="subtitle2" color="white">
                      취소
                    </Typography>
                  </SubmitButton>
                </Grid>
                <Grid item xs={0.3}/>
                <Grid item xs={3.8}>
                  <SubmitButton
                    onClick={() => {
                      onShowConfirm('삭제하시겠습니까?', () => {
                        onRemoveHospital();
                      })
                    }}
                    style={{ border: '1px solid red', backgroundColor: '#FFF', marginTop: 32 }}
                  >
                    <Typography variant="subtitle2" color="red">
                      삭제
                    </Typography>
                  </SubmitButton>
                </Grid>
                <Grid item xs={0.3}/>
                <Grid item xs={3.8}>
                  <SubmitButton
                    onClick={() => {
                      onShowConfirm('수정하시겠습니까?', () => {
                        onSubmit();
                      })
                    }}
                    style={{ border: '1px solid #00AB55', backgroundColor: '#00AB55', marginTop: 32 }}
                  >
                    <Typography variant="subtitle2" color="white">
                      수정
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

export default HospitalDetailPage;
