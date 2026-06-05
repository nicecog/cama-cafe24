import React, {Fragment, useEffect, useState} from 'react';
import { Typography, Grid, Box, styled } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { pipe, map, reduce, groupBy, entries, toArray, flat, } from '@fxts/core';

/** Types **/
import { BindBy } from '../../../utils/fxts';
import { NewDoctorContentsDto, NewDiseaseInfo } from '../../../services/apis/doctorContents/request';
import { OptionItem, basicViewedType } from '../../../constants/options';
import { DiseaseTreatment } from '../../../services/apis/common/response';
import { CareTimeInfo, DiseaseOption, DiseaseOptionInfo, NewHospitalDiseaseInfo } from '../../../services/apis/common/response';
import { CommonDiseaseInfo, DiseaseOptionGroupInfo } from '../TreatmentAdd';

/** Components **/
import { CardContainer } from 'components/PageCard';
import { TextInput } from '../../../components/_Styled/TextFields';
import { Container, Content } from '../../../components/Layout/Detail';
import { SubmitButton } from '../../../components/_Styled/Buttons';
import { Section } from '../../../components/_Styled/Views';
import CustomSelect from '../../../components/Select/CustomSelect';
import PageHeader from 'components/PageHeader';
import Editor from '../../../components/Editor';
import BasicDropzone from '../../../components/Dropzone/BasicDropzone';
import CheckboxItem from '../../../components/Checkbox/CheckboxItem';

import AlertModal from 'components/Modals/AlertModal';
import ConfirmModal from 'components/Modals/ConfirmModal';

/** Styles **/
import { ThumbImgView, ThumbImg } from '../../../components/_Styled/Views';

/** Services **/
import commonApi from '../../../services/apis/common';
import doctorContentsApi from '../../../services/apis/doctorContents';

/** Hooks **/
import { useAuthRecoilValue } from '../../../hooks/recoil/useAuthState';
import useAlertState from 'hooks/useAlertState';

/** Helpers **/
import { INTEREST_OPTIONS, VIEWED_OPTIONS } from '../../../constants/options';

/** Assets **/
import ADD_IMAGE from '../../../assets/images/add-image.png';
import {TreatmentInfo} from '../../../services/apis/doctorContents/response';

interface PageState {
  title: string;
  content: string;
  interestedArea: string;
  targetInterestedAreas: string[];
  cancerStepOptions: BindBy<CareTimeInfo>[];
  selectedCancerSteps: number[];
  diseaseOptions: OptionItem[];
  diseaseInfo: string;
  liveThumb: string[];

  diseaseList: CommonDiseaseInfo[];
  diseaseType: CommonDiseaseInfo | null;
  diseaseTreatmentOptions: DiseaseTreatment[];
  diseaseTreatmentGroup: {
    [x: number]: DiseaseTreatment[];
  },
  targetDiseaseTreatment: DiseaseTreatment | null;
  targetDiseaseTreatments: DiseaseTreatment[];
  diseaseOptionGroupList: DiseaseOptionGroupInfo[];
  diseaseOptionGroupSet: {
    [x: number]: DiseaseOption[];
  };
  targetDiseaseOptionGroup: {
    [x: string]: DiseaseOptionInfo[];
  };
  hospitalDiseaseGroup: {
    [x: number]: NewHospitalDiseaseInfo;
  };
  viewed: basicViewedType;
}

function TreatmentDetailPage() {
  const navigate = useNavigate();
  const { seq } = useParams<{ seq: string }>();
  const account = useAuthRecoilValue();
  const [state, setState] = useState<PageState>({
    title: '',
    content: '',
    interestedArea: '',
    targetInterestedAreas: [],
    cancerStepOptions: [],
    selectedCancerSteps: [],
    diseaseOptions: [],
    diseaseInfo: '',
    liveThumb: [],

    diseaseList: [],
    diseaseType: null,
    diseaseTreatmentOptions: [],
    diseaseTreatmentGroup: {},
    targetDiseaseTreatment: null,
    targetDiseaseTreatments: [],
    diseaseOptionGroupList: [],
    diseaseOptionGroupSet: {},
    targetDiseaseOptionGroup: {},
    hospitalDiseaseGroup: {},
    viewed: 'NO',
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
      title,
      content,
      // interestedArea,
      targetInterestedAreas,
      // selectedCancerSteps,
      // diseaseInfo,
      liveThumb,
      diseaseType,
      targetDiseaseTreatments,
      // diseaseOptionGroupList,
      targetDiseaseOptionGroup,
      hospitalDiseaseGroup,
      viewed,
    } = state;

    if (title === '') {
      onShowAlert('제목을 입력하세요.');
      return ;
    }

    if (content === '') {
      onShowAlert('내용을 입력하세요.');
      return ;
    }

    if (diseaseType === null) {
      onShowAlert('어떤 질환이신지 선택해주세요.');
      return;
    }

    if (targetDiseaseTreatments.length === 0) {
      onShowAlert('시기를 선택하세요.');
      return ;
    }

    if (targetInterestedAreas.length === 0) {
      onShowAlert('관심영역을 선택하세요.');
      return ;
    }

    const diseaseOptions: DiseaseOption[] = pipe(
      targetDiseaseOptionGroup,
      entries,
      map(([k, v]) => v.map(d => ({
        groupName: `${k}`,
        optionName: `${d.optionName}`,
        seq: Number(d.seq),
      }))),
      flat,
      toArray,
    )

    const dto: NewDoctorContentsDto = {
      careTimeType: '',
      contents: content,
      disease: {
        diseaseOption: diseaseOptions,
        diseaseSeq: diseaseType.seq,
        diseaseTreatment: targetDiseaseTreatments,
        name: diseaseType.name,
        seq: hospitalDiseaseGroup[diseaseType.seq].seq,
      },
      diseaseSeq: diseaseType.seq,
      image: liveThumb[0],
      interest: targetInterestedAreas,
      title,
      viewed: viewed === 'YES',
    }

    doctorContentsApi
      .updateDoctorContents(`${seq}`, dto)
      .then(res => {
        if (res) {
          onShowAlert('수정되었습니다.');
        }
      })
      .catch(err => onShowAlert(err));
  }

  const initData = (detailSeq: string) => {
    if (account === null) {
      return;
    }

    // Promise.all([
    //   commonApi.fetchNewHospitalDiseaseList(account.doctor.hospitalSeq),
    //   doctorContentsApi.getDoctorContentsDetail(detailSeq),
    // ])
    //   .then(([res, treatmentInfo]) => {
    //     /** initData **/
    //     const diseaseTreatmentGroup = pipe(res,
    //       map(d => ({
    //         [d.diseaseSeq]: d.diseaseTreatment,
    //       })),
    //       reduce(Object.assign),
    //     ) || {};
    //
    //     const diseaseOptionGroup = pipe(res,
    //       map(d => ({
    //         [d.diseaseSeq]: d.diseaseOption,
    //       })),
    //       reduce(Object.assign),
    //     ) || {};
    //
    //     const hospitalDiseaseGroup = pipe(res,
    //       map(d => ({
    //         [d.diseaseSeq]: d,
    //       })),
    //       reduce(Object.assign),
    //     ) || {};
    //
    //     /** treatmentInfo **/
    //     const {
    //       title,
    //       contents,
    //       interest,
    //       image,
    //       viewed,
    //       disease,
    //       diseaseSeq,
    //       diseaseName,
    //     } = treatmentInfo;
    //     const targetInterestedAreas = JSON.parse((interest || '[]')) as string[];
    //
    //     const diseaseParsed = JSON.parse(disease || '{}') as NewDiseaseInfo;
    //     const {
    //       diseaseOption = [],
    //       diseaseTreatment = [],
    //     } = diseaseParsed;
    //
    //     changeState({
    //       title,
    //       content: contents,
    //       targetInterestedAreas,
    //       liveThumb: [image],
    //       diseaseType: {
    //         seq: diseaseSeq,
    //         name: diseaseName,
    //       },
    //       targetDiseaseTreatments: diseaseTreatment,
    //       targetDiseaseOptionGroup: pipe(
    //         diseaseOption,
    //         groupBy(d => d.groupName),
    //       ),
    //       viewed: viewed ? 'YES' : 'NO',
    //
    //       diseaseOptions: res.map(d => ({
    //         label: d.diseaseName,
    //         value: `${d.diseaseSeq}`,
    //       })),
    //       diseaseList: res.map(d => ({
    //         seq: d.diseaseSeq,
    //         name: d.diseaseName,
    //       })),
    //       // diseaseType: res.length === 0 ? null : {
    //       //   seq: res[0].diseaseSeq,
    //       //   name: res[0].diseaseName,
    //       // },
    //       diseaseTreatmentOptions: (res[0] || {}).diseaseTreatment || [],
    //       diseaseTreatmentGroup: diseaseTreatmentGroup,
    //       diseaseOptionGroupList: pipe(
    //         ((res[0] || {}).diseaseOption || []),
    //         groupBy(d => d.groupName),
    //         entries,
    //         map(([k, v]) => ({
    //           groupName: k,
    //           diseaseOptions: v.map(d => ({
    //             optionName: d.optionName,
    //             seq: d.seq,
    //           })),
    //         })),
    //         toArray,
    //       ) || [],
    //       diseaseOptionGroupSet: diseaseOptionGroup,
    //       hospitalDiseaseGroup: hospitalDiseaseGroup,
    //     });
    //   })
    //   .catch(err => onShowAlert(err))
  };

  useEffect(() => {
    if (seq === undefined || isNaN(Number(seq))) {
      onShowAlert('잘못된 접근입니다.', () => {
        navigate(-1);
      })
      return ;
    }

    initData(seq);
  }, [account]);

  const {
    title,
    content,
    interestedArea,
    targetInterestedAreas,
    cancerStepOptions,
    selectedCancerSteps,
    diseaseOptions,
    diseaseInfo,
    liveThumb,

    diseaseList,
    diseaseType,
    diseaseTreatmentOptions,
    diseaseTreatmentGroup,
    targetDiseaseTreatment,
    targetDiseaseTreatments,
    diseaseOptionGroupList,
    diseaseOptionGroupSet,
    hospitalDiseaseGroup,
    targetDiseaseOptionGroup,
    viewed,
  } = state;
  const { alertFlag, alertTitle, confirmFlag, confirmTitle } = alertState

  return (
    <div>
      <PageHeader title={'치료정보 수정/삭제'} />
      <CardContainer>
        <Container>
          <Content>
            <Section>
              <Grid container rowSpacing={4}>
                {/** 제목 **/}
                <Fragment>
                  <Grid item xs={3}>
                    <Typography variant="subtitle1">제목</Typography>
                  </Grid>
                  <Grid item xs={9}>
                    <TextInput
                      required
                      fullWidth
                      placeholder={'제목을 입력하세요.'}
                      value={title}
                      onChange={(e) => changeState({ title: e.target.value })}
                    />
                  </Grid>
                </Fragment>
                {/** 내용 **/}
                <Fragment>
                  <Grid item xs={3}>
                    <Typography variant="subtitle1">내용</Typography>
                  </Grid>
                  <Grid item xs={9}>
                    <Editor
                      value={content}
                      onChange={(text) => changeState({ content: text })}
                      placeholder={'내용 입력'}
                    />
                  </Grid>
                </Fragment>
                {/** 질환 **/}
                <Fragment>
                  <Grid item xs={3}>
                    <Typography variant="subtitle1">질환</Typography>
                  </Grid>
                  <Grid item xs={9}>
                    <CustomSelect
                      label=""
                      value={`${diseaseType?.seq || ''}`}
                      onChange={(e) => {
                        const d = hospitalDiseaseGroup[Number(e.target.value)] || null

                        if (d === null) return;

                        changeState({
                          diseaseType: {
                            seq: d.diseaseSeq,
                            name: d.diseaseName,
                          },
                          diseaseTreatmentOptions: diseaseTreatmentGroup[d.diseaseSeq] || [],
                          targetDiseaseTreatment: null,
                          targetDiseaseOptionGroup: {},
                          diseaseOptionGroupList: pipe(
                            (diseaseOptionGroupSet[d.diseaseSeq] || []),
                            groupBy(d => d.groupName),
                            entries,
                            map(([k, v]) => ({
                              groupName: k,
                              diseaseOptions: v.map(dd => ({
                                optionName: dd.optionName,
                                seq: dd.seq,
                              })),
                            })),
                            toArray,
                          ) || []
                        });
                      }}
                      options={diseaseOptions}
                    />
                  </Grid>
                </Fragment>
                {/** 시기 **/}
                <Fragment>
                  <Grid item xs={3}>
                    <Typography variant="subtitle1">시기</Typography>
                  </Grid>
                  <Grid item xs={9}>
                    {diseaseTreatmentOptions.map(d => (
                      <Fragment key={d.seq}>
                        <CheckboxItem
                          label={d.name}
                          isSelected={targetDiseaseTreatments.map(t => t.seq).includes(d.seq)}
                          onToggleSelect={() => {
                            if (targetDiseaseTreatments.map(t => t.seq).includes(d.seq)) {
                              const newTargetDiseaseTreatments = targetDiseaseTreatments.filter(t => t.seq !== d.seq)
                              changeState({ targetDiseaseTreatments: newTargetDiseaseTreatments });
                            } else {
                              changeState({ targetDiseaseTreatments: [...targetDiseaseTreatments, d ] });
                            }
                          }}
                        />
                        <div style={{ marginBottom: 4 }} />
                      </Fragment>
                    ))}
                  </Grid>
                </Fragment>
                {/** 속성s **/}
                <Fragment>
                  {diseaseOptionGroupList.map(g => (
                    <Fragment key={g.groupName}>
                      <Grid item xs={3}>
                        <Typography variant="subtitle1">{g.groupName}</Typography>
                      </Grid>
                      <Grid item xs={9}>
                        {g.diseaseOptions.map(d => (
                          <Fragment key={d.seq}>
                            <CheckboxItem
                              label={d.optionName}
                              isSelected={(targetDiseaseOptionGroup[g.groupName] || []).map(t => t.seq).includes(d.seq)}
                              onToggleSelect={() => {
                                const targetGroup = targetDiseaseOptionGroup[g.groupName] || [];

                                if (targetGroup.map(t => t.seq).includes(d.seq)) {
                                  const newTargetGroup = targetGroup.filter(t => t.seq !== d.seq);

                                  changeState({
                                    targetDiseaseOptionGroup: {
                                      ...targetDiseaseOptionGroup,
                                      [g.groupName]: newTargetGroup,
                                    },
                                  })
                                } else {
                                  changeState({
                                    targetDiseaseOptionGroup: {
                                      ...targetDiseaseOptionGroup,
                                      [g.groupName]: [...targetGroup, d],
                                    },
                                  })
                                }
                              }}
                            />
                            <div style={{ marginBottom: 4 }} />
                          </Fragment>
                        ))}
                      </Grid>
                    </Fragment>
                  ))}
                </Fragment>

                {/** 관심영역 **/}
                <Fragment>
                  <Grid item xs={3}>
                    <Typography variant="subtitle1">관심영역</Typography>
                  </Grid>
                  <Grid item xs={9}>
                    {INTEREST_OPTIONS.map(d => (
                      <Fragment key={d.value}>
                        <CheckboxItem
                          label={d.label}
                          isSelected={targetInterestedAreas.includes(d.value)}
                          onToggleSelect={() => {
                            if (targetInterestedAreas.includes(d.value)) {
                              changeState({
                                targetInterestedAreas: targetInterestedAreas.filter(t => t !== d.value),
                              });
                            } else {
                              changeState({
                                targetInterestedAreas: [...targetInterestedAreas, d.value],
                              });
                            }
                          }}
                        />
                        <div style={{ marginBottom: 4 }} />
                      </Fragment>
                    ))}
                  </Grid>
                </Fragment>
                {/** Featured Image **/}
                <Fragment>
                  <Grid item xs={3}>
                    <Typography variant="subtitle1">Featured Image</Typography>
                  </Grid>
                  <Grid item xs={9}>
                    <BasicDropzone
                      imageType={'IMAGE'}
                      setPreviews={(imgs) => changeState({ liveThumb: imgs })}
                    >
                      <ThumbImgView height={240}>
                        {liveThumb.length === 0 && (
                          <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }} >
                            <ThumbImg style={{ width: 74, height: 108 }} src={ADD_IMAGE} alt="add-image"/>
                          </div>
                        )}
                        {liveThumb.length > 0 && (
                          <ThumbImg src={liveThumb[0]} alt="add-image"/>
                        )}
                      </ThumbImgView>
                    </BasicDropzone>
                  </Grid>
                </Fragment>

                {/** 공개여부 **/}
                <Fragment>
                  <Grid item xs={3}>
                    <Typography variant="subtitle1">지금 공개할까요?</Typography>
                  </Grid>
                  <Grid item xs={9}>
                    {VIEWED_OPTIONS.map(d => (
                      <Fragment key={d.value}>
                        <CheckboxItem
                          label={d.label}
                          isSelected={viewed === d.value}
                          onToggleSelect={() => {
                            changeState({ viewed: d.value as basicViewedType });
                          }}
                        />
                        <div style={{ marginBottom: 4 }} />
                      </Fragment>
                    ))}
                  </Grid>
                </Fragment>
              </Grid>
            </Section>

            <Section>
              <Grid container rowSpacing={4}>
                <Grid item xs={5.5}>
                  <SubmitButton
                    onClick={() => {
                      onShowConfirm('삭제하시겠습니까?',  () => {

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
                      onShowConfirm('수정하시겠습니까?',  () => {
                        onSubmit();
                      });
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

export default TreatmentDetailPage;

const CustomTextInputOn = styled(TextInput)`
  input {
    color: #00A8A4;
  }
`

const CustomTextInputOff = styled(TextInput)`
  input {
    color: #68667C;
  }
`
