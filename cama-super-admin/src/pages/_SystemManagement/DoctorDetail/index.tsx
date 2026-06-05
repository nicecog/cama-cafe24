import React, { Fragment, useEffect, useState } from 'react';
import { Typography, Grid } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';

/** Types **/
import { DoctorDto } from '../../../services/apis/adminDoctor/request';
import { OptionItem } from '../../../constants/options';

/** Components **/
import { CardContainer } from 'components/PageCard';
import { TextInput } from '../../../components/_Styled/TextFields';
import { Container, Content } from '../../../components/Layout/Detail';
import { SubmitButton } from '../../../components/_Styled/Buttons';
import { Section } from '../../../components/_Styled/Views';
import { ThumbImgView, ThumbImg } from '../../../components/_Styled/Views';
import PageHeader from 'components/PageHeader';
import CustomSelect from '../../../components/Select/CustomSelect';
import BasicDropzone from '../../../components/Dropzone/BasicDropzone';

import AlertModal from 'components/Modals/AlertModal';
import ConfirmModal from 'components/Modals/ConfirmModal';

/** Services **/
import adminHospitalApi from '../../../services/apis/adminHospital';
import adminDepartmentApi from '../../../services/apis/adminDepartment';
import adminDoctorApi from '../../../services/apis/adminDoctor';

/** Hooks **/
import useAlertState from 'hooks/useAlertState';

/** Assets **/
import ADD_IMAGE from '../../../assets/images/add-image.png';

interface PageState {
  name: string;
  nick: string;
  hospitalOptions: OptionItem[];
  targetHospital: string;
  departmentOptions: OptionItem[];
  targetDepartment: string;
  loginId: string;
  password: string;
  password2: string;
  profileImg: string[];
  profileLink: string;
  phone: string;
}

function DoctorDetailPage() {
  const navigate = useNavigate();
  const { doctorSeq } = useParams<{ doctorSeq: string }>();
  const [state, setState] = useState<PageState>({
    name: '',
    nick: '',
    hospitalOptions: [],
    targetHospital: '',
    departmentOptions: [],
    targetDepartment: '',
    loginId: '',
    password: '',
    password2: '',
    profileImg: [],
    profileLink: '',
    phone: '',
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

  const onRemoveDoctor = () => {
    adminDoctorApi
      .removeAdminDoctor(Number(doctorSeq))
      .then(res => {
        if (res) {
          navigate(-1);
        }
      })
      .catch(err => {
        onShowAlert(err);
      });
  }

  const onSubmit = () => {
    const {
      name,
      nick,
      targetHospital,
      targetDepartment,
      loginId,
      password,
      profileImg,
      profileLink,
      phone,
    } = state;

    if (name === '') {
      onShowAlert('의사명을 입력해주세요.');
      return;
    };

    if (nick === '') {
      onShowAlert('호칭은 필수 입니다.');
      return;
    };

    if (targetHospital === '' || targetDepartment === '') {
      onShowAlert('소속 & 전공은 필수 입니다.');
      return;
    };

    const dto: DoctorDto = {
      departmentSeq: Number(targetDepartment),
      hospitalSeq: Number(targetHospital),
      loginId: loginId,
      name: name,
      nick: nick,
      password: '',
      phone: phone,
      profileImage: profileImg.length > 0 ? profileImg[0] : null,
      profileLink: profileLink,
    };

    adminDoctorApi
      .updateAdminDoctor(Number(doctorSeq), dto)
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
    Promise.all([
      adminHospitalApi.fetchAdminHospitalListAll(),
      adminDepartmentApi.fetchAdminDepartmentList(),
      adminDoctorApi.getAdminDoctorDetail(Number(doctorSeq)),
    ])
      .then(([res, departmentList, doctorInfo]) => {
        const { data } = res;
        const hospitalOptions: OptionItem[] = data.map(d => ({ value: `${d.seq}`, label: d.name }));
        const departmentOptions: OptionItem[] = departmentList.map(d => ({ value: `${d.seq}`, label: d.name }));

        changeState({
          hospitalOptions: hospitalOptions,
          departmentOptions: departmentOptions,
          name: doctorInfo.name,
          nick: doctorInfo.nick,
          targetHospital: `${doctorInfo.hospitalSeq}`,
          targetDepartment: `${doctorInfo.departmentSeq}`,
          loginId: doctorInfo.loginId,
          // password: doctorInfo.pa,
          profileImg: doctorInfo.profileImage === null ? [] : [doctorInfo.profileImage],
          profileLink: doctorInfo.profileLink,
          phone: doctorInfo.phone,
        });
      })
      .catch(err => {
        onShowAlert(err, () => {
          navigate(-1);
        });
      });
  };

  useEffect(() => {
    initData();
  }, []);

  const {
    name,
    nick,
    hospitalOptions,
    targetHospital,
    departmentOptions,
    targetDepartment,
    loginId,
    password,
    password2,
    profileImg,
    profileLink,
    phone,
  } = state;
  const { alertFlag, alertTitle, confirmFlag, confirmTitle } = alertState

  return (
    <div>
      <PageHeader title={'의사정보 수정'} />
      <CardContainer>
        <Container>
          <Content>
            <Section>
              <Grid container rowSpacing={4}>
                <Fragment>
                  <Grid item xs={3}>
                    <Typography variant="subtitle1">이름</Typography>
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
                    <Typography variant="subtitle1">호칭</Typography>
                  </Grid>
                  <Grid item xs={9}>
                    <TextInput
                      required
                      fullWidth
                      placeholder={''}
                      value={nick}
                      onChange={(e) => changeState({ nick: e.target.value })}
                    />
                  </Grid>
                </Fragment>
                <Fragment>
                  <Grid item xs={3}>
                    <Typography variant="subtitle1">소속</Typography>
                  </Grid>
                  <Grid item xs={9}>
                    <CustomSelect
                      label=""
                      value={targetHospital}
                      onChange={(e) => {
                        changeState({ targetHospital: e.target.value });
                      }}
                      options={hospitalOptions}
                    />
                  </Grid>
                </Fragment>
                <Fragment>
                  <Grid item xs={3}>
                    <Typography variant="subtitle1">전공</Typography>
                  </Grid>
                  <Grid item xs={9}>
                    <CustomSelect
                      label=""
                      value={targetDepartment}
                      onChange={(e) => {
                        changeState({ targetDepartment: e.target.value });
                      }}
                      options={departmentOptions}
                    />
                  </Grid>
                </Fragment>
                {/** 프로필 이미지 **/}
                <Fragment>
                  <Grid item xs={3}>
                    <Typography variant="subtitle1">프로필 이미지</Typography>
                  </Grid>
                  <Grid item xs={9}>
                    <BasicDropzone
                      imageType={'IMAGE'}
                      setPreviews={(imgs) => changeState({ profileImg: imgs })}
                    >
                      <ThumbImgView height={240}>
                        {profileImg.length === 0 && (
                          <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }} >
                            <ThumbImg style={{ width: 74, height: 108 }} src={ADD_IMAGE} alt="add-image"/>
                          </div>
                        )}
                        {profileImg.length > 0 && (
                          <ThumbImg src={profileImg[0]} alt="add-image"/>
                        )}
                      </ThumbImgView>
                    </BasicDropzone>
                  </Grid>
                </Fragment>
                {/** 프로필 **/}
                <Fragment>
                  <Grid item xs={3}>
                    <Typography variant="subtitle1">프로필 링크</Typography>
                  </Grid>
                  <Grid item xs={9}>
                    <TextInput
                      required
                      fullWidth
                      placeholder={''}
                      value={profileLink}
                      onChange={(e) => changeState({ profileLink: e.target.value })}
                    />
                  </Grid>
                </Fragment>
                {/** 전화번호 **/}
                <Fragment>
                  <Grid item xs={3}>
                    <Typography variant="subtitle1">전화번호</Typography>
                  </Grid>
                  <Grid item xs={9}>
                    <TextInput
                      required
                      fullWidth
                      placeholder={''}
                      value={phone}
                      onChange={(e) => changeState({ phone: e.target.value })}
                    />
                  </Grid>
                </Fragment>
                <Fragment>
                  <Grid item xs={3}>
                    <Typography variant="subtitle1">이메일 주소 (로그인 ID)</Typography>
                  </Grid>
                  <Grid item xs={9}>
                    <TextInput
                      required
                      fullWidth
                      disabled
                      placeholder={''}
                      value={loginId}
                      onChange={(e) => {}}
                    />
                  </Grid>
                </Fragment>
                {/*<Fragment>*/}
                {/*  <Grid item xs={3}>*/}
                {/*    <Typography variant="subtitle1">임시비밀번호</Typography>*/}
                {/*  </Grid>*/}
                {/*  <Grid item xs={9}>*/}
                {/*    <TextInput*/}
                {/*      required*/}
                {/*      fullWidth*/}
                {/*      type={'password'}*/}
                {/*      placeholder={''}*/}
                {/*      value={password}*/}
                {/*      onChange={(e) => changeState({ password: e.target.value })}*/}
                {/*    />*/}
                {/*  </Grid>*/}
                {/*</Fragment>*/}
              </Grid>
            </Section>

            <Section>
              <Grid container rowSpacing={4}>
                <Grid item xs={5.5}>
                  <SubmitButton
                    onClick={() => {
                      onShowConfirm('삭제하시겠습니까?', () => {
                        onRemoveDoctor();
                      });
                    }}
                    style={{ border: '1px solid red', backgroundColor: '#FFF', marginTop: 32 }}
                  >
                    <Typography variant="subtitle2" color="red">
                      삭제
                    </Typography>
                  </SubmitButton>
                </Grid>
                <Grid item xs={1}/>
                <Grid item xs={5.5}>
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

export default DoctorDetailPage;
