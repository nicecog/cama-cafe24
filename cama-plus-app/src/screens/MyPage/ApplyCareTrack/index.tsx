import React, { useState, useEffect } from 'react';
import {
  View,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { pipe, groupBy, map, reduce, toArray, entries } from '@fxts/core';
import ModalScrollable from '@/components/Modals/ModalScrollable';

/** Types **/
import { MainNavigationScreenProps } from '@/navigations/MainNavigation';
import { CareTrackNewDto } from '@/services/apis/careTrack/request';
import { CommonDiseaseInfo } from '@/services/apis/common/response';
import {
  DiseaseOptionInfo,
  DiseaseOption,
} from '@/services/apis/hospital/response';
import { DiseaseTreatment } from '@/services/apis/hospital/response';
import { HospitalDiseaseInfo } from '@/services/apis/hospital/response';

/** Components **/
import LeftBackHeader from '@/components/Headers/LeftBackHeader';
import RectRoundButton from '@/components/Buttons/RectRoundButton';
import SelectedCheckCareTrackButton from '@/screens/ ScheduleManagement/AddScheduleScreen/SelectedCheckCareTrackButton';
import StartAlertModal from '@/components/Modals/StartAlertModal';

/** Hooks **/
import { useAccountHospitalValue } from '@/hooks/recoil/useAccountHospitalRecoilHook';
import { useAccountValue } from '@/hooks/recoil/useAccountMeRecoilState';

/** Assets **/
import IC_STEP1_OFF from '@/assets/icons/caretrack/step1_off.svg';
import IC_STEP1_ON from '@/assets/icons/caretrack/step1_on.svg';
import IC_STEP2_OFF from '@/assets/icons/caretrack/step2_off.svg';
import IC_STEP2_ON from '@/assets/icons/caretrack/step2_on.svg';
import IC_STEP3_OFF from '@/assets/icons/caretrack/step3_off.svg';
import IC_STEP3_ON from '@/assets/icons/caretrack/step3_on.svg';
import IC_STEP4_OFF from '@/assets/icons/caretrack/step4_off.svg';
import IC_STEP4_ON from '@/assets/icons/caretrack/step4_on.svg';
import IC_STEP5_OFF from '@/assets/icons/caretrack/step5_off.svg';
import IC_STEP5_ON from '@/assets/icons/caretrack/step5_on.svg';
import IC_CHECK_ACTIVE from '@/assets/icons/buttons/ic_check_active.svg';
import IC_CHECK_EMPTY from '@/assets/icons/buttons/ic_check_empty.svg';

/** Styles **/
import {
  viewStyles,
  borderStyles,
  modalStyles,
} from '@/components/_StyleSheets';
import {
  Inter700Text,
  Inter600Text,
  Inter400Text,
} from '@/components/Texts/InterText';

/** Services **/
import careTrackApi from '@/services/apis/careTrack';
import hospitalApi from '@/services/apis/hospital';

/** Helpers **/
import { showAlertMessage } from '@/utils/alertMessage';
import dayjs from 'dayjs';

let CARE_TRACK_DAYS = [7, 14, 30, 60];
const INTEREST_LIST = [
  '증상 알아보기',
  '치료 과정',
  '부작용과 대처',
  '위험요소와 관리법',
  '건강한 식생활과 운동',
  '마음 돌보기',
  '보호자를 위한 팁',
  '그외 도움되는 정보',
];

interface DiseaseOptionGroupInfo {
  groupName: string;
  diseaseOptions: DiseaseOptionInfo[];
}

interface PageState {
  careTrackDay: number;
  interestList: string[];
  showAlertModal: boolean;
  diseaseList: CommonDiseaseInfo[];
  diseaseType: CommonDiseaseInfo | null;

  diseaseTreatmentOptions: DiseaseTreatment[];
  diseaseTreatmentGroup: {
    [x: number]: DiseaseTreatment[];
  };
  targetDiseaseTreatment: DiseaseTreatment | null;

  diseaseOptionGroupList: DiseaseOptionGroupInfo[];
  diseaseOptionGroupSet: {
    [x: number]: DiseaseOption[];
  };
  targetDiseaseOptionGroup: {
    [x: string]: DiseaseOptionInfo;
  };
  hospitalDiseaseGroup: {
    [x: number]: HospitalDiseaseInfo;
  };
}

const ApplyCareTrackScreen: React.FC<
  MainNavigationScreenProps<'ApplyCareTrackScreen'>
> = ({ navigation: { goBack } }) => {
  const [state, setState] = useState<PageState>({
    careTrackDay: 0,
    interestList: [],
    showAlertModal: false,
    diseaseList: [],
    diseaseType: null,
    diseaseTreatmentOptions: [],
    diseaseTreatmentGroup: {},
    targetDiseaseTreatment: null,
    diseaseOptionGroupList: [],
    diseaseOptionGroupSet: {},
    targetDiseaseOptionGroup: {},
    hospitalDiseaseGroup: {},
  });
  const accountHospital = useAccountHospitalValue();
  const account = useAccountValue();
  //console.log('accountHospital => ' + JSON.stringify(accountHospital, null, 2));
  const changeState = (newState: Partial<PageState>) => {
    setState(prev => ({
      ...prev,
      ...newState,
    }));
  };
  const [chkStep1, setChkStep1] = useState(true);
  const [chkStep2, setChkStep2] = useState(false);
  const [chkStep3, setChkStep3] = useState(false);
  //const [chkStep4, setChkStep4] = useState(false);
  const [chkStep5, setChkStep5] = useState(false);
  const [chkStep6, setChkStep6] = useState(false);
  const [allMode, setAllMode] = useState(false);

  const onApplyCareTrack = () => {
    const {
      careTrackDay,
      interestList,
      diseaseType,
      targetDiseaseTreatment,
      diseaseOptionGroupList,
      targetDiseaseOptionGroup,
      hospitalDiseaseGroup,
    } = state;

    if (careTrackDay === 0) {
      let msg =
        account.name +
        '님에게 추천되는 CAMA+ 컨텐츠를 며칠에 걸쳐서 보시겠습니까?';
      showAlertMessage({
        message: msg,
      });
      return;
    }

    if (interestList.length === 0) {
      showAlertMessage({
        message: '어떤 영역에 관심있는지 선택해주세요.',
      });
      return;
    }

    if (diseaseType === null) {
      showAlertMessage({
        message: '어떤 질환이신지 선택해주세요.',
      });
      return;
    }

    if (targetDiseaseTreatment === null) {
      showAlertMessage({
        message: '치료시기 선택해주세요.',
      });
      return;
    }

    const groupNames = diseaseOptionGroupList.map(d => d.groupName);

    if (
      groupNames.filter(g => targetDiseaseOptionGroup[g] === undefined).length >
      0
    ) {
      showAlertMessage({
        message: '선택하지 않은 항목이 있습니다.',
      });
      return;
    }

    const dto: CareTrackNewDto = {
      days: careTrackDay,
      diseaseSeq: diseaseType.seq,
      diseases: {
        diseaseOption: groupNames.map(d => ({
          groupName: d,
          optionName: targetDiseaseOptionGroup[d].optionName,
          seq: targetDiseaseOptionGroup[d].seq,
        })),
        diseaseSeq: diseaseType.seq,
        diseaseTreatment: [targetDiseaseTreatment],
        name: diseaseType.name,
        seq: hospitalDiseaseGroup[diseaseType.seq].seq,
      },
      interest: interestList,
    };
    //console.log('CareTrackNewDto : ', JSON.stringify(dto, null, 2));

    careTrackApi
      .applyCareTrackService(dto)
      .then(res => {
        if (res) {
          console.log(`after: ${dayjs().format('YYYY-MM-DD hh:mm:ss')}`);
          changeState({ showAlertModal: true });
        }
      })
      .catch(err => {
        if (err === '암정보 가이드 여정 서비스 호출 응답 에러') {
          showAlertMessage({
            message: '암정보 가이드 여정을 설정 할 수 없습니다.',
          });
        } else {
          showAlertMessage({
            message: err,
          });
        }
      });
  };

  const initData = () => {
    hospitalApi
      .fetchHospitalDiseaseList(accountHospital.hospitalSeq)
      .then(res => {
        console.log(JSON.stringify(res));
        const diseaseTreatmentGroup =
          pipe(
            res,
            map(d => ({
              [d.diseaseSeq]: d.diseaseTreatment,
            })),
            reduce(Object.assign),
          ) || {};

        const diseaseOptionGroup =
          pipe(
            res,
            map(d => ({
              [d.diseaseSeq]: d.diseaseOption,
            })),
            reduce(Object.assign),
          ) || {};

        const hospitalDiseaseGroup =
          pipe(
            res,
            map(d => ({
              [d.diseaseSeq]: d,
            })),
            reduce(Object.assign),
          ) || {};

        changeState({
          diseaseList: res.map(d => ({
            seq: d.diseaseSeq,
            name: d.diseaseName,
          })),
          diseaseType:
            res.length === 0
              ? null
              : {
                  seq: res[0].diseaseSeq,
                  name: res[0].diseaseName,
                },
          diseaseTreatmentOptions: (res[0] || {}).diseaseTreatment || [],
          diseaseTreatmentGroup: diseaseTreatmentGroup,
          diseaseOptionGroupList:
            pipe(
              (res[0] || {}).diseaseOption || [],
              groupBy(d => d.groupName),
              entries,
              map(([k, v]) => ({
                groupName: k,
                diseaseOptions: v.map(d => ({
                  optionName: d.optionName,
                  seq: d.seq,
                })),
              })),
              toArray,
            ) || [],
          diseaseOptionGroupSet: diseaseOptionGroup,
          hospitalDiseaseGroup: hospitalDiseaseGroup,
        });
      })
      .catch(err => {
        showAlertMessage({
          message: err,
          onPress: () => goBack(),
        });
      });
  };

  useEffect(() => {
    initData();
  }, []);

  const {
    careTrackDay,
    interestList,
    showAlertModal,
    diseaseList,
    diseaseType,
    diseaseTreatmentOptions,
    diseaseTreatmentGroup,
    targetDiseaseTreatment,
    diseaseOptionGroupList,
    diseaseOptionGroupSet,
    targetDiseaseOptionGroup,
  } = state;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#FFF' }}>
      <LeftBackHeader title=" 생성하기" />
      {chkStep1 && (
        <View style={{ height: '100%' }}>
          <View style={{ height: '80%' }}>
            <View
              style={[
                viewStyles.rowAiCenter,
                {
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginTop: 20,
                },
              ]}
            >
              <IC_STEP1_ON width={60} height={60} />
              <IC_STEP2_OFF width={60} height={60} />
              <IC_STEP3_OFF width={60} height={60} />
              <IC_STEP4_OFF width={60} height={60} />
              <IC_STEP5_OFF width={60} height={60} />
            </View>
            <View style={[styles.sectionView]}>
              <Inter700Text style={{ color: '#774F2D', fontSize: 24 }}>
                어떤 질환인가요?
              </Inter700Text>
              <View
                style={[
                  styles.sectionDivider,
                  { marginTop: 40, marginBottom: 30 },
                ]}
              />
              <ScrollView
                showsHorizontalScrollIndicator={false}
                showsVerticalScrollIndicator={false}
              >
                <View
                  style={[
                    viewStyles.columnAiCenterJcCenter,
                    {
                      marginTop: 10,
                      marginBottom: 130,
                    },
                  ]}
                >
                  {diseaseList.map(d => (
                    <View key={d.seq} style={{ marginBottom: 20 }}>
                      <SelectedCheckCareTrackButton
                        key={d.seq}
                        label={d.name}
                        selected={diseaseType?.name === d.name}
                        onSelect={() => {
                          changeState({
                            diseaseType: d,
                            diseaseTreatmentOptions:
                              diseaseTreatmentGroup[d.seq] || [],
                            targetDiseaseTreatment: null,
                            targetDiseaseOptionGroup: {},
                            diseaseOptionGroupList:
                              pipe(
                                diseaseOptionGroupSet[d.seq] || [],
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
                              ) || [],
                          });
                        }}
                      />
                    </View>
                  ))}
                </View>
              </ScrollView>
            </View>
          </View>
          <View style={{ height: '20%' }}>
            <View style={styles.buttonSection}>
              <RectRoundButton
                label={'다음'}
                onPress={() => {
                  if (diseaseType === null) {
                    showAlertMessage({
                      message: '어떤 질환이신지 선택해주세요.',
                    });
                    return;
                  }
                  setChkStep1(false);
                  setChkStep2(true);
                  setChkStep3(false);
                  //setChkStep4(false);
                  setChkStep5(false);
                  setChkStep6(false);
                }}
              />
            </View>
          </View>
        </View>
      )}
      {chkStep2 && (
        <View style={{ height: '100%' }}>
          <View style={{ height: '80%' }}>
            <View
              style={[
                viewStyles.rowAiCenter,
                {
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginTop: 20,
                },
              ]}
            >
              <IC_STEP1_ON width={60} height={60} />
              <IC_STEP2_ON width={60} height={60} />
              <IC_STEP3_OFF width={60} height={60} />
              <IC_STEP4_OFF width={60} height={60} />
              <IC_STEP5_OFF width={60} height={60} />
            </View>
            <View style={[styles.sectionView]}>
              <Inter700Text style={{ color: '#774F2D', fontSize: 24 }}>
                치료시기를 선택하세요.
              </Inter700Text>
              <View
                style={[
                  styles.sectionDivider,
                  { marginTop: 40, marginBottom: 30 },
                ]}
              />
              <ScrollView
                showsHorizontalScrollIndicator={false}
                showsVerticalScrollIndicator={false}
              >
                <View
                  style={[
                    viewStyles.columnAiCenterJcCenter,
                    {
                      marginTop: 10,
                      marginBottom: 130,
                    },
                  ]}
                >
                  {diseaseTreatmentOptions.map(d => (
                    <View key={d.seq} style={{ marginBottom: 10 }}>
                      <SelectedCheckCareTrackButton
                        key={d.seq}
                        label={d.name}
                        selected={d.seq === targetDiseaseTreatment?.seq}
                        onSelect={() => {
                          changeState({ targetDiseaseTreatment: d });
                          //console.log(d.name + ' : ' + d.treatmentPeriod);
                          let treatmentPeriod = d.treatmentPeriod.split(',');
                          if (treatmentPeriod.length > 0) {
                            CARE_TRACK_DAYS = treatmentPeriod.map(Number);
                          } else {
                            CARE_TRACK_DAYS = [14, 28];
                          }
                        }}
                      />
                    </View>
                  ))}
                </View>
              </ScrollView>
            </View>
          </View>
          <View style={{ height: '20%' }}>
            <View style={styles.buttonSection}>
              <RectRoundButton
                label={'다음'}
                onPress={() => {
                  if (targetDiseaseTreatment === null) {
                    showAlertMessage({
                      message: '치료시기 선택해주세요.',
                    });
                    return;
                  }
                  setChkStep1(false);
                  setChkStep2(false);
                  setChkStep3(true);
                  //setChkStep4(false);
                  setChkStep5(false);
                  setChkStep6(false);
                }}
              />
            </View>
          </View>
        </View>
      )}

      {chkStep3 && (
        <View style={{ height: '100%' }}>
          <View style={{ height: '80%' }}>
            <View
              style={[
                viewStyles.rowAiCenter,
                {
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginTop: 20,
                },
              ]}
            >
              <IC_STEP1_ON width={60} height={60} />
              <IC_STEP2_ON width={60} height={60} />
              <IC_STEP3_ON width={60} height={60} />
              <IC_STEP4_OFF width={60} height={60} />
              <IC_STEP5_OFF width={60} height={60} />
            </View>

            <ScrollView
              showsHorizontalScrollIndicator={false}
              showsVerticalScrollIndicator={false}
            >
              {diseaseOptionGroupList.map(g => (
                <View
                  key={g.groupName}
                  style={[styles.sectionView, borderStyles.borderB]}
                >
                  <Inter700Text style={{ color: '#774F2D', fontSize: 24 }}>
                    {g.groupName.indexOf('고려사항') < 0
                      ? g.groupName + '를 '
                      : g.groupName + '을 '}
                    선택해주세요.
                  </Inter700Text>
                  <View
                    style={[
                      viewStyles.rowAiStart,
                      { marginTop: 16, flexWrap: 'wrap' },
                    ]}
                  >
                    {g.diseaseOptions.map(d => (
                      <SelectedCheckCareTrackButton
                        key={d.seq}
                        label={d.optionName}
                        selected={
                          d.seq ===
                          (targetDiseaseOptionGroup[g.groupName] || {}).seq
                        }
                        onSelect={() => {
                          changeState({
                            targetDiseaseOptionGroup: {
                              ...targetDiseaseOptionGroup,
                              [g.groupName]: d,
                            },
                          });
                        }}
                      />
                    ))}
                  </View>
                </View>
              ))}
            </ScrollView>
          </View>
          <View style={{ height: '20%' }}>
            <View style={styles.buttonSection}>
              <RectRoundButton
                label={'다음'}
                onPress={() => {
                  const groupNames = diseaseOptionGroupList.map(
                    d => d.groupName,
                  );
                  if (
                    groupNames.filter(
                      g => targetDiseaseOptionGroup[g] === undefined,
                    ).length > 0
                  ) {
                    showAlertMessage({
                      message: '선택하지 않은 항목이 있습니다.',
                    });
                    return;
                  }
                  setChkStep1(false);
                  setChkStep2(false);
                  setChkStep3(false);
                  //setChkStep4(false);
                  setChkStep5(true);
                  setChkStep6(false);
                }}
              />
            </View>
          </View>
        </View>
      )}

      {chkStep5 && (
        <View style={{ height: '100%' }}>
          <View style={{ height: '80%' }}>
            <View
              style={[
                viewStyles.rowAiCenter,
                {
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginTop: 20,
                },
              ]}
            >
              <IC_STEP1_ON width={60} height={60} />
              <IC_STEP2_ON width={60} height={60} />
              <IC_STEP3_ON width={60} height={60} />
              <IC_STEP4_ON width={60} height={60} />
              <IC_STEP5_OFF width={60} height={60} />
            </View>
            <View style={[styles.sectionView]}>
              <Inter700Text style={{ color: '#774F2D', fontSize: 24 }}>
                {account.name}님에게 추천되는{'\n'}CAMA+ 컨텐츠를 며칠에 걸쳐서
                {'\n'}
                보시겠습니까?'
              </Inter700Text>
              <View
                style={[
                  styles.sectionDivider,
                  { marginTop: 40, marginBottom: 30 },
                ]}
              />

              <ScrollView
                showsHorizontalScrollIndicator={false}
                showsVerticalScrollIndicator={false}
              >
                <View
                  style={[
                    viewStyles.columnAiCenterJcCenter,
                    {
                      marginTop: 10,
                      marginBottom: 130,
                    },
                  ]}
                >
                  {CARE_TRACK_DAYS.map(d => (
                    <View key={d} style={{ marginBottom: 20 }}>
                      <SelectedCheckCareTrackButton
                        key={d}
                        label={`${d}일`}
                        selected={d === careTrackDay}
                        onSelect={() => changeState({ careTrackDay: d })}
                      />
                    </View>
                  ))}
                </View>
              </ScrollView>
            </View>
          </View>
          <View style={{ height: '20%' }}>
            <View style={styles.buttonSection}>
              <RectRoundButton
                label={'다음'}
                onPress={() => {
                  if (careTrackDay === 0) {
                    showAlertMessage({
                      message:
                        account.name +
                        '님에게 추천되는 CAMA+ 컨텐츠를 며칠에 걸쳐서 보실지 선택해주세요.',
                    });
                    return;
                  }
                  setChkStep1(false);
                  setChkStep2(false);
                  setChkStep3(false);
                  //setChkStep4(false);
                  setChkStep5(false);
                  setChkStep6(true);
                }}
              />
            </View>
          </View>
        </View>
      )}
      {chkStep6 && (
        <View style={{ height: '100%' }}>
          <View style={{ height: '80%' }}>
            <View
              style={[
                viewStyles.rowAiCenter,
                {
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginTop: 20,
                },
              ]}
            >
              <IC_STEP1_ON width={60} height={60} />
              <IC_STEP2_ON width={60} height={60} />
              <IC_STEP3_ON width={60} height={60} />
              <IC_STEP4_ON width={60} height={60} />
              <IC_STEP5_ON width={60} height={60} />
            </View>
            <View style={[styles.sectionView]}>
              <Inter700Text style={{ color: '#774F2D', fontSize: 24 }}>
                관심있는 영역을 모두 선택하세요.
              </Inter700Text>
              <View
                style={[
                  styles.sectionDivider,
                  { marginTop: 20, marginBottom: 30 },
                ]}
              />

              <View style={[viewStyles.rowAiCenter, { marginBottom: 20 }]}>
                <View style={{ marginTop: 0, marginRight: 14 }}>
                  <TouchableOpacity
                    onPress={() => {
                      if (allMode) {
                        changeState({
                          interestList: [],
                        });
                      } else {
                        changeState({
                          interestList: INTEREST_LIST,
                        });
                      }
                      setAllMode(!allMode);
                    }}
                  >
                    {allMode ? (
                      <IC_CHECK_ACTIVE width={35} height={35} />
                    ) : (
                      <IC_CHECK_EMPTY width={35} height={35} />
                    )}
                  </TouchableOpacity>
                </View>
                <Inter700Text
                  style={{
                    fontSize: 18,
                    color: '#777777',
                    marginRight: 10,
                  }}
                >
                  모두 선택하기
                </Inter700Text>
              </View>
              <ScrollView
                showsHorizontalScrollIndicator={false}
                showsVerticalScrollIndicator={false}
              >
                <View
                  style={[
                    viewStyles.columnAiCenterJcCenter,
                    {
                      marginTop: 10,
                      marginBottom: 130,
                    },
                  ]}
                >
                  {INTEREST_LIST.map(d => (
                    <View key={d} style={{ marginBottom: 10 }}>
                      <SelectedCheckCareTrackButton
                        key={d}
                        label={d}
                        selected={interestList.includes(d)}
                        onSelect={() => {
                          if (interestList.includes(d)) {
                            changeState({
                              interestList: interestList.filter(i => d !== i),
                            });
                          } else {
                            changeState({
                              interestList: [...interestList, d],
                            });
                          }
                        }}
                      />
                    </View>
                  ))}
                </View>
              </ScrollView>
            </View>
          </View>
          <View style={{ height: '20%' }}>
            <View style={styles.buttonSection}>
              <RectRoundButton
                label={'암정보 가이드 설정완료'}
                onPress={onApplyCareTrack}
              />
            </View>
          </View>
        </View>
      )}

      <StartAlertModal showModal={showAlertModal} onPressDone={() => goBack()}>
        <Inter400Text style={modalStyles.msgLabel}>
          암정보 가이드가 설정되었습니다. 암정보 가이드는 메인페이지에서 바로
          확인하실 수 있습니다.
        </Inter400Text>
        <View style={[styles.sectionDivider2, { marginTop: 0 }]} />

        <View
          style={[
            borderStyles.basicBorder,
            {
              marginTop: 20,
              marginBottom: 20,
              backgroundColor: '#EFEFEF',
            },
          ]}
        >
          <Inter700Text style={styles.msgLabel1}>
            CAMA+의 맞춤형 관리 {'\n'} 컨텐츠는 뭐가 다른가요?
          </Inter700Text>
          <Inter400Text style={styles.msgLabel2}>
            - 암 유형 및 시기별로 개인 맞춤형으로 암정보를 제공합니다. {'\n'}-
            교수·전문의가 직접 제공하는 전문지식을 바탕으로 컨텐츠가
            만들어졌습니다.
          </Inter400Text>
        </View>
      </StartAlertModal>

      {/*
      <ModalScrollable modalFlag={showAlertModal} onCloseModal={() => goBack()}>
        <SafeAreaView style={styles.modalSafeArea}>
          <View style={styles.modalWrap}>
            <Inter400Text style={modalStyles.msgLabel}>
              암정보 가이드가 설정되었습니다. 암정보 가이드는 메인페이지에서
              바로 확인하실 수 있습니다.
            </Inter400Text>
            <View style={[styles.buttonSection, viewStyles.rowAiCenter]}>
              <RectRoundButton
                buttonStyle={{
                  flex: 1,
                  ...borderStyles.buttonBorder,
                }}
                label={'암정보 가이드 시작'}
                onPress={() => goBack()}
              />
            </View>
          </View>
        </SafeAreaView>
      </ModalScrollable>
      */}
    </SafeAreaView>
  );
};

export default ApplyCareTrackScreen;

const styles = StyleSheet.create({
  sectionView: {
    paddingHorizontal: 16,
    paddingVertical: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonSection: {
    paddingHorizontal: 16,
    paddingVertical: 40,
  },
  sectionDivider: {
    width: '100%',
    height: 8,
    backgroundColor: '#EFEFEF',
  },
  sectionDivider2: {
    width: '100%',
    height: 6,
    backgroundColor: '#EFEFEF',
  },
  modalSafeArea: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalWrap: {
    backgroundColor: '#fff',
    width: '80%',
    // height: 282,
    padding: 24,
    paddingBottom: 76,
    borderRadius: 8,
  },
  msgLabel1: {
    fontSize: 22,
    color: '#774F2D',
    textAlign: 'center',
    paddingBottom: 10,
    textDecorationLine: 'underline',
    margin: 4,
  },
  msgLabel2: {
    fontSize: 20,
    color: '#000',
    textAlign: 'center',
    paddingBottom: 16,
    margin: 4,
  },
});
