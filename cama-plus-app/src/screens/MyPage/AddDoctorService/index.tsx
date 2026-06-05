import React, { useState, useEffect, Fragment } from 'react';
import {
  View,
  SafeAreaView,
  StyleSheet,
  ScrollView,
  TextInput,
} from 'react-native';

/** Types **/
import { HospitalDoctorInfo } from '@/services/apis/hospital/response';
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
import { useAccountHospitalValue } from '@/hooks/recoil/useAccountHospitalRecoilHook';

/** Styles **/
import { Inter400Text, Inter700Text } from '@/components/Texts/InterText';
import FONTS from '@/constants/fonts';
import { viewStyles } from '@/components/_StyleSheets';

/** Services **/
import hospitalApi from '@/services/apis/hospital';

/** Utils **/
import { showAlertMessage } from '@/utils/alertMessage';
import { MainNavigationScreenProps } from '@/navigations/MainNavigation';

interface PageState {
  doctorName: string;
  doctorList: HospitalDoctorInfo[];
  filteredDoctorList: HospitalDoctorInfo[];
  selectedDoctorList: HospitalDoctorInfo[];
  showCompletedAlert: boolean;
  isSearching: boolean;
}

const AddDoctorServiceScreen: React.FC<
  MainNavigationScreenProps<'AddDoctorServiceScreen'>
> = ({ navigation: { goBack } }) => {
  const [state, setState] = useState<PageState>({
    doctorName: '',
    doctorList: [],
    filteredDoctorList: [],
    selectedDoctorList: [],
    showCompletedAlert: false,
    isSearching: false,
  });
  const accountHospital = useAccountHospitalValue();

  const changeState = (newState: Partial<PageState>) => {
    setState(prev => ({
      ...prev,
      ...newState,
    }));
  };

  const _filterDoctorList = (
    text: string,
    doctorList: HospitalDoctorInfo[],
  ) => {
    const filteredDoctors =
      text === ''
        ? doctorList
        : doctorList.filter(
            d => d.doctorName.includes(text) || d.departmentName.includes(text),
          );
    changeState({
      filteredDoctorList: filteredDoctors,
    });
  };

  const filterDoctorList = useDebounce(_filterDoctorList, 500);

  const onSubmitApplied = () => {
    const { selectedDoctorList } = state;

    if (selectedDoctorList.length === 0) {
      return;
    }

    const dto: ApplyingHospitalServiceDto = {
      hospitalSeq: accountHospital.hospitalSeq,
      // doctorInfo: selectedDoctorList.map(d => ({
      //   doctorSeq: d.doctorSeq,
      //   departmentSeq: d.departmentSeq,
      // })),
    };

    hospitalApi
      .applyHospitalService(dto)
      .then(res => {
        if (res) {
          changeState({ showCompletedAlert: true });
        }
      })
      .catch(err => {
        showAlertMessage({
          message: err,
        });
      });
  };

  const initData = () => {
    hospitalApi
      .fetchHospitalDoctorList(accountHospital.hospitalSeq)
      .then(res => {
        changeState({
          doctorList: res,
          filteredDoctorList: [...res],
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
    doctorName,
    doctorList,
    selectedDoctorList,
    filteredDoctorList,
    showCompletedAlert,
    isSearching,
  } = state;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#FFF' }}>
      <LeftBackHeader title="" />
      <ScrollView style={{ paddingHorizontal: 16, marginVertical: 48 }}>
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
              filterDoctorList(text, doctorList);
            }}
            placeholderTextColor={'#B6BDC3'}
            style={{
              color: '#000',
              fontSize: 32,
              fontFamily: FONTS.Inter.Bold,
              marginBottom: 16,
            }}
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
                  const newSelectedDoctorList = selectedDoctorList.filter(
                    s => s.doctorSeq !== d.doctorSeq,
                  );
                  changeState({ selectedDoctorList: newSelectedDoctorList });
                }}
              />
            ))}
          </View>
          <View style={{ marginTop: 16 }}>
            {filteredDoctorList.map(d => {
              const selected = selectedDoctorList
                .map(s => s.doctorSeq)
                .includes(d.doctorSeq);
              return (
                <DoctorCheckCell
                  key={d.doctorSeq}
                  name={d.doctorName}
                  major={d.departmentName}
                  selected={selected}
                  onSelect={() => {
                    if (selected) {
                      const newSelectedDoctorList = selectedDoctorList.filter(
                        s => s.doctorSeq !== d.doctorSeq,
                      );
                      changeState({
                        selectedDoctorList: newSelectedDoctorList,
                      });
                    } else {
                      changeState({
                        selectedDoctorList: [...selectedDoctorList, d],
                      });
                    }
                  }}
                />
              );
            })}
          </View>
        </Fragment>
        <View style={{ height: 60 }} />
      </ScrollView>
      {!isSearching && selectedDoctorList.length > 0 && (
        <View style={styles.buttonSection}>
          <RectRoundButton
            label={'병환 추가 신청'}
            onPress={() => onSubmitApplied()}
          />
        </View>
      )}
      <SignUpCompletedModal
        showPicker={showCompletedAlert}
        onPressDone={() => {
          changeState({ showCompletedAlert: false });
          setTimeout(() => {
            goBack();
          }, 500);
        }}
      />
    </SafeAreaView>
  );
};

export default AddDoctorServiceScreen;

const styles = StyleSheet.create({
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
});
