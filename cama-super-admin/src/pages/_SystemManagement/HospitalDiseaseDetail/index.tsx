import React, {Fragment, useEffect, useState} from 'react';
import { Typography, Grid, InputAdornment, styled, Box } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import { ReactSortable, ItemInterface } from 'react-sortablejs';

/** Types **/
import { OptionItem } from '../../../constants/options';
import { DiseaseDto } from '../../../services/apis/adminDisease/request';
import { CustomItemInterface, CustomGroupItemInterface } from '../HospitalDiseaseAdd';

/** Components **/
import { CardContainer } from 'components/PageCard';
import { TextInput } from '../../../components/_Styled/TextFields';
import { Container, Content } from '../../../components/Layout/Detail';
import { SubmitButton, AdornButton } from '../../../components/_Styled/Buttons';
import { CustomButton } from '../../../components/_Styled/Buttons';
import { Section } from '../../../components/_Styled/Views';
import PageHeader from 'components/PageHeader';
import CustomSelect from '../../../components/Select/CustomSelect';

import AlertModal from 'components/Modals/AlertModal';
import ConfirmModal from 'components/Modals/ConfirmModal';

/** Services **/
import adminHospitalApi from '../../../services/apis/adminHospital';
import adminCancerApi from '../../../services/apis/adminCancer';
import adminDiseaseApi from '../../../services/apis/adminDisease';

/** Hooks **/
import useAlertState from 'hooks/useAlertState';

interface PageState {
  hospitalOptions: OptionItem[];
  targetHospital: string;
  diseaseOptions: OptionItem[];
  targetDisease: string;
  treatmentOrderList: CustomItemInterface[];
  diseasePropertyList: CustomGroupItemInterface[];
}

function HospitalDiseaseDetailPage() {
  const navigate = useNavigate();
  const { seq } = useParams<{ seq: string }>();
  const [state, setState] = useState<PageState>({
    hospitalOptions: [],
    targetHospital: '',
    diseaseOptions: [],
    targetDisease: '',
    treatmentOrderList: [{ id: uuidv4(), value: '', canRemove: true }],
    diseasePropertyList: [],
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
    const {
      targetHospital,
      targetDisease,
      treatmentOrderList,
      diseasePropertyList,
    } = state;

    if (targetHospital === '') {
      onShowAlert('병원 선택은 필수입니다.');
      return;
    }

    if (targetDisease === '') {
      onShowAlert('질환 선택은 필수입니다.');
      return;
    }

    if (treatmentOrderList.length > 0 && treatmentOrderList[0].value === '') {
      onShowAlert('한 개 이상의 치료 시기는 필수 입니다.');
      return;
    }

    const emptyTreatmentOrderList = treatmentOrderList.filter(d => d.value === '');
    if (emptyTreatmentOrderList.length > 0) {
      onShowAlert('치료시기 데이터 중 입력이 안 된 학목이 있습니다.');
      return;
    }

    const emptyData = diseasePropertyList.filter(d => d.groupName === '' || d.value === '');
    if (emptyData.length > 0) {
      onShowAlert('질환의 속성 데이터 중 입력이 안 된 학목이 있습니다.');
      return;
    }

    const dto: DiseaseDto = {
      diseaseSeq: Number(targetDisease),
      hospitalSeq: Number(targetHospital),
      options: diseasePropertyList.map((d, idx) => ({
        groupName: d.groupName,
        optionName: d.value,
        sort: idx,
      })),
      treatments: treatmentOrderList.map((d, idx) => ({
        name: d.value,
        sort: idx,
      })),
    };

    // console.log(JSON.stringify(dto));
    adminDiseaseApi
      .updateAdminDisease(Number(seq), dto)
      .then(res => {
        onShowAlert('수정되었습니다.', () => {
          navigate(-1);
        });
      })
      .catch(err => onShowAlert(err));
  };

  const onAddTreatmentItem = (targetIdx: number) => {
    const { treatmentOrderList } = state;
    if (treatmentOrderList.length >= 30) {
      onShowAlert('최대 30까지 등록 가능합니다.');
      return;
    }

    const arr1: CustomItemInterface[] = [];
    const arr2: CustomItemInterface[] = [];
    for (const a of treatmentOrderList) {
      if (arr1.length === targetIdx + 1) {
        arr2.push(a);
      } else {
        arr1.push(a);
      }
    }

    changeState({
      treatmentOrderList: [
        ...arr1,
        { id: uuidv4(), value: '', canRemove: true },
        ...arr2,
      ],
    });
  }

  const onRemoveTreatmentItem = (key: string) => {
    const { treatmentOrderList } = state;
    if (treatmentOrderList.length === 1) {
      onShowAlert('한 개 이상의 치료 시기는 필수 입니다.');
      return;
    }
    const newTreatmentOrderList = treatmentOrderList.filter(m => m.id !== key);
    changeState({ treatmentOrderList: newTreatmentOrderList });
  }

  const onChangeTreatmentItem = (key: string, value: string) => {
    const { treatmentOrderList } = state;
    const newTreatments = treatmentOrderList.map(m => m.id !== key ? m : { ...m, value });
    changeState({ treatmentOrderList: newTreatments });
  }

  const onChangeDiseaseGroupNameItem = (key: string, groupName: string) => {
    const { diseasePropertyList } = state;
    const newDiseasePropertyList = diseasePropertyList.map(m => m.id !== key ? m : { ...m, groupName });
    changeState({ diseasePropertyList: newDiseasePropertyList });
  }

  const onChangeDiseaseValueItem = (key: string, value: string) => {
    const { diseasePropertyList } = state;
    const newDiseasePropertyList = diseasePropertyList.map(m => m.id !== key ? m : { ...m, value });
    changeState({ diseasePropertyList: newDiseasePropertyList });
  }

  const onAddTopDiseaseItem = () => {
    const { diseasePropertyList } = state;

    changeState({
      diseasePropertyList: [
        { id: uuidv4(), groupName: '', value: '', canRemove: true },
        ...diseasePropertyList,
      ],
    });
  }

  const onAddDiseaseItem = (targetIdx: number) => {
    const { diseasePropertyList } = state;

    const arr1: CustomGroupItemInterface[] = [];
    const arr2: CustomGroupItemInterface[] = [];
    for (const a of diseasePropertyList) {
      if (arr1.length === targetIdx + 1) {
        arr2.push(a);
      } else {
        arr1.push(a);
      }
    }

    changeState({
      diseasePropertyList: [
        ...arr1,
        { id: uuidv4(), groupName: '', value: '', canRemove: true },
        ...arr2,
      ],
    });
  }

  const onRemoveDiseaseItem = (key: string) => {
    const { diseasePropertyList } = state;
    // if (diseasePropertyList.length === 1) {
    //   return;
    // }
    const newDiseasePropertyList = diseasePropertyList.filter(m => m.id !== key);
    changeState({ diseasePropertyList: newDiseasePropertyList });
  }

  const initData = () => {
    Promise.all([
      adminHospitalApi.fetchAdminHospitalListAll(),
      adminCancerApi.fetchAdminCancerList(),
      adminDiseaseApi.getAdminDiseaseDetail(Number(seq))
    ])
      .then(([res, cancers, diseaseInfo]) => {
        const { data } = res;
        const hospitalOptions: OptionItem[] = data.map(d => ({ value: `${d.seq}`, label: d.name }));
        const diseaseOptions: OptionItem[] = cancers.map(d => ({ value: `${d.seq}`, label: d.name }));

        changeState({
          hospitalOptions: hospitalOptions,
          diseaseOptions: diseaseOptions,
          targetDisease: `${diseaseInfo.diseaseSeq}`,
          targetHospital: `${diseaseInfo.hospitalSeq}`,
          treatmentOrderList: (diseaseInfo.treatments || []).map(d => ({
            id: uuidv4(),
            value: d.name,
            canRemove: false,
          })),
          diseasePropertyList: (diseaseInfo.options || []).map(d => ({
            id: uuidv4(),
            groupName: d.groupName,
            value: d.optionName,
            canRemove: false,
          })),
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
    hospitalOptions,
    targetHospital,
    diseaseOptions,
    targetDisease,
    treatmentOrderList,
    diseasePropertyList,
  } = state;
  const { alertFlag, alertTitle, confirmFlag, confirmTitle } = alertState

  return (
    <div>
      <PageHeader title={'질환 수정'} />
      <CardContainer>
        <Container>
          <Content>
            <Section>
              <Grid container rowSpacing={4}>
                {/** 병원 **/}
                <Fragment>
                  <Grid item xs={3}>
                    <Typography variant="subtitle1">병원</Typography>
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
                {/** 질환 명칭 **/}
                <Fragment>
                  <Grid item xs={3}>
                    <Typography variant="subtitle1">질환 명칭</Typography>
                  </Grid>
                  <Grid item xs={9}>
                    <CustomSelect
                      label=""
                      value={targetDisease}
                      onChange={(e) => {
                        changeState({ targetDisease: e.target.value });
                      }}
                      options={diseaseOptions}
                    />
                  </Grid>
                </Fragment>
                {/** 치료 시기 **/}
                <Fragment>
                  <Grid item xs={3}>
                    <Grid container rowSpacing={4}>
                      <Grid item xs={12}>
                        <Typography variant="subtitle1">
                          치료 시기
                          <br/>
                          (최대 30개 등록)
                        </Typography>
                      </Grid>
                    </Grid>
                  </Grid>
                  <Grid item xs={9}>
                    <Wrapper>
                      <ReactSortable
                        list={treatmentOrderList}
                        setList={newOrderList => changeState({ treatmentOrderList: newOrderList })}
                        animation={150}
                        fallbackOnBody
                        swapThreshold={0.65}
                        ghostClass="ghost"
                      >
                        {treatmentOrderList.map((d, idx) => (
                          <div key={d.id} style={{ display: 'flex', alignItems: 'center' }}>
                            <DragBar />
                            <TextInput
                              style={{ marginBottom: 4 }}
                              fullWidth
                              placeholder={'치료시기 입력'}
                              value={d.value}
                              onChange={e => onChangeTreatmentItem(`${d.id}`, e.target.value)}
                              InputProps={{
                                endAdornment: (
                                  <InputAdornment position="end">
                                    <AdornButton
                                      onClick={(e) => {
                                        e.preventDefault();
                                        onAddTreatmentItem(idx);
                                      }}
                                    >
                                      <Typography variant="body2" color="white">
                                        추가
                                      </Typography>
                                    </AdornButton>
                                    {d.canRemove && (
                                      <AdornButton
                                        style={{ marginLeft: 8 }}
                                        onClick={(e) => {
                                          e.preventDefault();
                                          onRemoveTreatmentItem(`${d.id}`);
                                        }}
                                      >
                                        <Typography variant="body2" color="white">
                                          삭제
                                        </Typography>
                                      </AdornButton>
                                    )}
                                  </InputAdornment>
                                )
                              }}
                            />
                          </div>
                        ))}
                      </ReactSortable>
                    </Wrapper>
                  </Grid>
                </Fragment>
                {/** 질환의 속성 **/}
                <Fragment>
                  <Fragment>
                    <Grid item xs={3}>
                      <Grid container rowSpacing={4}>
                        <Grid item xs={6}>
                          <Typography variant="subtitle1">질환의 속성</Typography>
                        </Grid>
                        <Grid item xs={6}>
                          <CustomButton onClick={onAddTopDiseaseItem}>
                            추가
                          </CustomButton>
                        </Grid>
                      </Grid>
                    </Grid>
                    <Grid item xs={3}>
                      <Typography variant="subtitle2" style={{ marginLeft: 28 }}>
                        속성 그룹명
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="subtitle2">속성</Typography>
                    </Grid>
                  </Fragment>
                  <Fragment>
                    <Grid item xs={3} style={{ paddingTop: 4 }}>
                      <Typography variant="subtitle1">{' '}</Typography>
                    </Grid>
                    <Grid item xs={9} style={{ paddingTop: 4 }}>
                      <Wrapper>
                        <ReactSortable
                          list={diseasePropertyList}
                          setList={newOrderList => changeState({ diseasePropertyList: newOrderList })}
                          animation={150}
                          fallbackOnBody
                          swapThreshold={0.65}
                          ghostClass="ghost"
                        >
                          {diseasePropertyList.map((d, idx) => (
                            <div key={d.id} style={{ display: 'flex', alignItems: 'center' }}>
                              <DragBar />
                              <TextInput
                                style={{ marginBottom: 4, width: '30%' }}
                                placeholder={'질환의 속성 그룹명 입력'}
                                value={d.groupName}
                                onChange={e => onChangeDiseaseGroupNameItem(`${d.id}`, e.target.value)}
                              />
                              <TextInput
                                style={{ marginBottom: 4, width: '70%', marginLeft: 4 }}
                                fullWidth
                                placeholder={'질환의 속성 입력'}
                                value={d.value}
                                onChange={e => onChangeDiseaseValueItem(`${d.id}`, e.target.value)}
                                InputProps={{
                                  endAdornment: (
                                    <InputAdornment position="end">
                                      <AdornButton
                                        onClick={(e) => {
                                          e.preventDefault();
                                          onAddDiseaseItem(idx);
                                        }}
                                      >
                                        <Typography variant="body2" color="white">
                                          추가
                                        </Typography>
                                      </AdornButton>
                                      {d.canRemove && (
                                        <AdornButton
                                          style={{ marginLeft: 8 }}
                                          onClick={(e) => {
                                            e.preventDefault();
                                            onRemoveDiseaseItem(`${d.id}`);
                                          }}
                                        >
                                          <Typography variant="body2" color="white">
                                            삭제
                                          </Typography>
                                        </AdornButton>
                                      )}
                                    </InputAdornment>
                                  )
                                }}
                              />
                            </div>
                          ))}
                        </ReactSortable>
                      </Wrapper>
                    </Grid>
                  </Fragment>
                </Fragment>
              </Grid>
            </Section>

            <Section>
              <Grid container rowSpacing={4}>
                <Grid item xs={5.5}>
                  <SubmitButton
                    onClick={() => {
                      onShowConfirm('수정한 내용을 취소하시겠습니까?',  () => {
                        if (seq !== undefined) {
                          initData();
                        }
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
                {/*<Grid item xs={3.8}>*/}
                {/*  <SubmitButton*/}
                {/*    onClick={() => {*/}
                {/*      onShowConfirm('삭제하시겠습니까?',  () => {*/}

                {/*      });*/}
                {/*    }}*/}
                {/*    style={{ border: '1px solid red', backgroundColor: 'red', marginTop: 32 }}*/}
                {/*  >*/}
                {/*    <Typography variant="subtitle2" color="white">*/}
                {/*      삭제*/}
                {/*    </Typography>*/}
                {/*  </SubmitButton>*/}
                {/*</Grid>*/}
                {/*<Grid item xs={0.3}/>*/}
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

export default HospitalDiseaseDetailPage;

const Wrapper = styled(Box)`
  .ghost {
    background: ${(props) => `${props.theme.palette.primary.main}14`};
  }
`;

const DragBar = styled('div')`
  width: 20px;
  height: 38px;
  background: #EFEFEF;
  border-radius: 4px;
  cursor: pointer;
  margin-right: 4px;
`;
