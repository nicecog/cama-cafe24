import React, { useState, useEffect, Fragment } from 'react';
import {
  View,
  TouchableOpacity,
  SafeAreaView,
  StyleSheet,
  ScrollView,
  FlatList,
  ListRenderItem,
  Image,
  TextInput,
} from 'react-native';

/** Types **/
import { StepNavigationScreenProps } from '@/navigations/StepNavigation';
import { HospitalInfo, HospitalDoctorInfo } from '@/services/apis/hospital/response';
import { ApplyingHospitalServiceDto } from '@/services/apis/hospital/request';

/** Components **/
import LeftBackHeader from '@/components/Headers/LeftBackHeader';
import HospitalCheckCell from '@/screens/Auth/SignUpStep/HospitalCheckCell';
import DoctorCheckCell from '@/screens/Auth/SignUpStep/DoctorCheckCell';
import SelectedDoctorTag from '@/screens/Auth/SignUpStep/SelectedDoctorTag';
import RectRoundButton from '@/components/Buttons/RectRoundButton';
import SignUpCompletedModal from '@/screens/Auth/SignUpStep/SignUpCompletedModal';

/** Hooks **/
import { useDebounce } from '@/hooks/common/useDebounce';
import { useSetAuthState } from '@/hooks/recoil/useAuthRecoilHooks';

/** Styles **/
import { Inter400Text, Inter700Text } from '@/components/Texts/InterText';
import { viewStyles } from '@/components/_StyleSheets';

/** Services **/
import hospitalApi from '@/services/apis/hospital';

/** Utils **/
import { showAlertMessage } from '@/utils/alertMessage';
import { koreanTextInputProps } from '@/utils/textInputProps';

type StepType = 'STEP1' | 'STEP2';

interface PageState {
  stepType: StepType;
  hospitalName: string;
  selectedHospital: HospitalInfo | null;
  hospitalList: HospitalInfo[];
  filteredHospitals: HospitalInfo[];
  doctorName: string;
  doctorList: HospitalDoctorInfo[];
  filteredDoctorList: HospitalDoctorInfo[];
  selectedDoctorList: HospitalDoctorInfo[];
  showCompletedAlert: boolean;
  isSearching: boolean;
}

const SignUpStepScreen: React.FC<
  StepNavigationScreenProps<'SignUpStepScreen'>
> = ({ navigation: { navigate } }) => {
  const [state, setState] = useState<PageState>({
    stepType: 'STEP1',
    hospitalName: '',
    selectedHospital: null,
    hospitalList: [],
    filteredHospitals: [],
    doctorName: '',
    doctorList: [],
    filteredDoctorList: [],
    selectedDoctorList: [],
    showCompletedAlert: false,
    isSearching: false,
  });
  const setAuthState = useSetAuthState();

  const changeState = (newState: Partial<PageState>) => {
    setState(prev => ({
      ...prev,
      ...newState,
    }));
  };

  const _filterHospitalList = (text: string) => {
    setState(prev => {
      const filteredHospitals =
        text === ''
          ? prev.hospitalList
          : prev.hospitalList.filter(d => d.name.includes(text));
      return { ...prev, filteredHospitals };
    });
  };

  const filterHospitalList = useDebounce(_filterHospitalList, 300);

  const _filterDoctorList = (text: string) => {
    setState(prev => {
      const filteredDoctorList =
        text === ''
          ? prev.doctorList
          : prev.doctorList.filter(
              d =>
                d.doctorName.includes(text) ||
                d.departmentName.includes(text),
            );
      return { ...prev, filteredDoctorList };
    });
  };

  const filterDoctorList = useDebounce(_filterDoctorList, 500);

  const onSubmitApplied = () => {
    const { selectedHospital, selectedDoctorList } = state;

    if (selectedHospital === null) {
      return;
    }

    const dto: ApplyingHospitalServiceDto = {
      hospitalSeq: selectedHospital.seq,
      // doctorInfo: selectedDoctorList.map(d => ({
      //   doctorSeq: d.doctorSeq,
      //   departmentSeq: d.departmentSeq,
      // })),
    };

    hospitalApi
      .applyHospitalService(dto)
      .then(res => {
        if (res) {
          // changeState({ showCompletedAlert: true })
          setAuthState('loggedIn');
        }
      })
      .catch(err => {
        showAlertMessage({
          message: err,
        });
      });
  };

  const goToNextStep = () => {
    const { selectedHospital } = state;

    if (selectedHospital === null) {
      return;
    }

    hospitalApi
      .fetchHospitalDoctorList(selectedHospital.seq)
      .then(res => {
        console.log({ res });
        changeState({
          doctorList: res,
          filteredDoctorList: [...res],
          stepType: 'STEP2',
        });
      })
      .catch(err => {
        showAlertMessage({
          message: err,
        });
      });
  };

  const initData = () => {
    hospitalApi
      .fetchHospitalList()
      .then(res => {
        const hospitalList = Array.isArray(res) ? res : [];
        setState(prev => {
          const text = prev.hospitalName;
          const filteredHospitals =
            text === ''
              ? hospitalList
              : hospitalList.filter(d => d.name.includes(text));
          return {
            ...prev,
            hospitalList,
            filteredHospitals,
          };
        });
      })
      .catch(err => {
        showAlertMessage({
          message: err,
        });
      });
  };

  useEffect(() => {
    initData();
  }, []);

  const {
    stepType,
    hospitalName,
    hospitalList,
    filteredHospitals,
    selectedHospital,
    doctorName,
    doctorList,
    selectedDoctorList,
    filteredDoctorList,
    showCompletedAlert,
    isSearching,
  } = state;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#FFF' }}>
      {/*<LeftBackHeader borderBottom={false} />*/}
      <View style={styles.stepSection}>
        <View style={styles.stepLineView}>
          <TouchableOpacity
            onPress={() => changeState({ stepType: 'STEP1'})}
          >
            <View
              style={[
                styles.stepView,
                styles.stepSelectedView,
              ]}
            />
          </TouchableOpacity>
          {/*<View*/}
          {/*  style={[*/}
          {/*    styles.stepView,*/}
          {/*    { left: 120 },*/}
          {/*    stepType === 'STEP2' && styles.stepSelectedView,*/}
          {/*  ]}*/}
          {/*/>*/}
        </View>
        <View style={{ marginTop: 20, width: '100%', position: 'relative' }}>
          <TouchableOpacity
            onPress={() => changeState({ stepType: 'STEP1'})}
          >
            <Inter700Text style={styles.step1Label}>병원 선택</Inter700Text>
          </TouchableOpacity>
          {/*<Inter700Text*/}
          {/*  style={[*/}
          {/*    styles.step2Label,*/}
          {/*    stepType === 'STEP2' && { color: '#000' },*/}
          {/*  ]}*/}
          {/*>*/}
          {/*  의사 선택*/}
          {/*</Inter700Text>*/}
        </View>
      </View>
      <ScrollView style={{ paddingHorizontal: 16, marginVertical: 48 }}>
        {stepType === 'STEP1' && (
          <Fragment>
            <View style={{ marginBottom: 40 }}>
              <Inter700Text style={{ fontSize: 24, color: '#000' }}>
                어떤 병원에서
              </Inter700Text>
              <Inter400Text style={{ fontSize: 24, color: '#000' }}>
                진료 받으셨나요?
              </Inter400Text>
            </View>
            <TextInput
              value={hospitalName}
              placeholder={'병원 검색'}
              onChangeText={text => {
                changeState({ hospitalName: text });
                filterHospitalList(text);
              }}
              placeholderTextColor={'#B6BDC3'}
              style={styles.searchInput}
              {...koreanTextInputProps}
              onFocus={() => changeState({ isSearching: true })}
              onBlur={() => {
                setTimeout(() => {
                  changeState({ isSearching: false });
                }, 200);
              }}
            />
            <View style={{ marginTop: 24 }}>
              {filteredHospitals.map(d => (
                <HospitalCheckCell
                  key={d.seq}
                  label={d.name}
                  selected={selectedHospital?.name === d.name}
                  onSelect={() => changeState({ selectedHospital: d })}
                />
              ))}
              {hospitalName !== '' && filteredHospitals.length === 0 && (
                <Inter700Text style={{ fontSize: 24, color: '#B6BDC3' }}>
                  검색하신 병원이 없습니다.
                </Inter700Text>
              )}
            </View>
          </Fragment>
        )}
        {stepType === 'STEP2' && (
          <Fragment>
            <View style={{ marginBottom: 40 }}>
              <Inter700Text style={{ fontSize: 24, color: '#000' }}>
                담당 의사
                <Inter400Text style={{ fontSize: 24, color: '#000' }}>
                  {'나 '}
                </Inter400Text>
                진료 과목
                <Inter400Text style={{ fontSize: 24, color: '#000' }}>
                  을
                </Inter400Text>
              </Inter700Text>
              <Inter400Text style={{ fontSize: 24, color: '#000' }}>
                모두 선택해주세요
              </Inter400Text>
            </View>
            <TextInput
              value={doctorName}
              placeholder={'의사를 검색하세요'}
              onChangeText={text => {
                changeState({ doctorName: text });
                filterDoctorList(text);
              }}
              placeholderTextColor={'#B6BDC3'}
              style={[styles.searchInput, { marginBottom: 16 }]}
              {...koreanTextInputProps}
              onFocus={() => changeState({ isSearching: true })}
              onBlur={() => {
                setTimeout(() => {
                  changeState({ isSearching: false });
                }, 200);
              }}
            />
            <View style={[viewStyles.rowAiCenter, { flexWrap: 'wrap' }]}>
              {selectedDoctorList.map(d => (
                <SelectedDoctorTag
                  key={d.doctorSeq}
                  name={d.doctorName}
                  onPress={() => {
                    const newSelectedDoctorList = selectedDoctorList.filter(s => s.doctorSeq !== d.doctorSeq);
                    changeState({ selectedDoctorList: newSelectedDoctorList });
                  }}
                />
              ))}
            </View>
            <View style={{ marginTop: 16 }}>
              {filteredDoctorList.map(d => {
                const selected = selectedDoctorList.map(s => s.doctorSeq).includes(d.doctorSeq)
                return (
                  <DoctorCheckCell
                    key={d.doctorSeq}
                    name={d. doctorName}
                    major={d.departmentName}
                    selected={selected}
                    onSelect={() => {
                      if (selected) {
                        const newSelectedDoctorList = selectedDoctorList.filter(s => s.doctorSeq !== d.doctorSeq);
                        changeState({ selectedDoctorList: newSelectedDoctorList });
                      } else {
                        changeState({ selectedDoctorList: [...selectedDoctorList, d] });
                      }
                    }}
                  />
                )
              })}
            </View>
          </Fragment>
        )}
        <View style={{ height: 60 }} />
      </ScrollView>
      {!isSearching && selectedHospital !== null && stepType === 'STEP1' && (
        <View style={styles.buttonSection}>
          {/*<RectRoundButton*/}
          {/*  label={'다음 단계로'}*/}
          {/*  onPress={() => goToNextStep()}*/}
          {/*/>*/}
          <RectRoundButton
            label={'가입 신청'}
            onPress={() => onSubmitApplied()}
          />
        </View>
      )}
      {/*{!isSearching && selectedDoctorList.length > 0  && stepType === 'STEP2' && (*/}
      {/*  <View style={styles.buttonSection}>*/}
      {/*    <RectRoundButton*/}
      {/*      label={'가입 신청'}*/}
      {/*      onPress={() => onSubmitApplied()}*/}
      {/*    />*/}
      {/*  </View>*/}
      {/*)}*/}
      <SignUpCompletedModal
        showPicker={showCompletedAlert}
        onPressDone={() => {
          changeState({ showCompletedAlert: false })
          setTimeout(() => {
            setAuthState('loggedIn')
          }, 500);
        }}
      />
    </SafeAreaView>
  );
};

export default SignUpStepScreen;

const styles = StyleSheet.create({
  stepSection: {
    marginTop: 16,
    paddingTop: 16,
    paddingLeft: 16,
  },
  stepLineView: {
    width: '100%',
    borderStyle: 'dotted',
    borderTopWidth: 2,
    borderTopColor: '#D9D9D9',
    position: 'relative',
  },
  stepView: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#D9D9D9',
    backgroundColor: '#FFF',
    position: 'absolute',
    left: 0,
    top: -12.5,
  },
  stepSelectedView: {
    backgroundColor: '#ED7101',
    borderColor: '#ED7101',
  },
  step1Label: {
    position: 'absolute',
    left: 0,
    top: 0,
    color: '#000',
  },
  step2Label: {
    position: 'absolute',
    left: 120,
    top: 0,
    color: '#B6BDC3',
  },
  buttonSection: {
    position: 'absolute',
    left: 16,
    right: 16,
    bottom: 40,
  },
  searchInput: {
    color: '#000',
    fontSize: 32,
    fontWeight: '700',
    padding: 0,
  },
});
