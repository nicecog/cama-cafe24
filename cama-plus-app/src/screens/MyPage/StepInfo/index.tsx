import React, { useState, useEffect, Fragment } from 'react';
import {
  View,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Dimensions,
} from 'react-native';
import dayjs from 'dayjs';
import { useIsFocused } from '@react-navigation/native';
import {
  LineChart,
  BarChart,
  PieChart,
  ProgressChart,
  ContributionGraph,
  StackedBarChart,
} from 'react-native-chart-kit';

/** Types **/
import { MainNavigationScreenProps } from '@/navigations/MainNavigation';
import { StepInfo } from '@/services/apis/stepInfo/response';
import { StepInfoDto } from '@/services/apis/stepInfo/request';

/** Components **/
import LeftBackHeader from '@/components/Headers/LeftBackHeader';
import ConfirmModal from '@/components/Modals/ConfirmModal';
import StepInfoCard from '@/screens/MyPage/StepInfo/StepInfoCard';
import RectRoundButton from '@/components/Buttons/RectRoundButton';

/** Styles **/
import { Inter400Text, Inter700Text } from '@/components/Texts/InterText';
import { viewStyles, borderStyles } from '@/components/_StyleSheets';
import FONTS from '@/constants/fonts';

/** Services **/
import stepInfoApi from '@/services/apis/stepInfo';

/** Helpers **/
import { showAlertMessage } from '@/utils/alertMessage';
import { defaultAccount } from '@/stores/accountMeState';

interface PageState {}
import { useAccountValue } from '@/hooks/recoil/useAccountMeRecoilState';

type ConfirmType = 'WITHDRAW';

interface PageState {
  stepHistoryList: StepInfo[];
  stepNum: string;
}

const StepInfoScreen: React.FC<
  MainNavigationScreenProps<'StepInfoScreen'>
> = () => {
  const isFocused = useIsFocused();
  const [state, setState] = useState<PageState>({
    stepHistoryList: [],
    stepNum: '',
  });

  const changeState = (newState: Partial<PageState>) => {
    setState(prev => ({
      ...prev,
      ...newState,
    }));
  };

  const account = useAccountValue();

  const fetchData = () => {
    const stepInfoSDto: StepInfoDto = {
      accountSeq: account.seq,
      stepNum: '',
      executionDate: '',
    };

    Promise.all([stepInfoApi.fetchCareTrackStepList(stepInfoSDto)])
      .then(([stepHistoryList]) => {
        changeState({
          stepHistoryList,
        });
      })
      .catch(err => {
        showAlertMessage({
          message: err,
        });
      });
  };

  useEffect(() => {
    if (isFocused) {
      fetchData();
    }
  }, [isFocused]);

  const { stepHistoryList, stepNum } = state;
  const onUpdateStepInfo = () => {
    const today = dayjs().format('YYYY-MM-DD');
    const dto: StepInfoDto = {
      accountSeq: account.seq,
      stepNum: stepNum,
      executionDate: today,
    };

    stepInfoApi
      .updateCareTrackStepInfo(dto)
      .then(res => {
        if (res) {
          showAlertMessage({
            message: '저장 되었습니다.',
            onPress: () => {
              fetchData();
            },
          });
        }
      })
      .catch(err => {
        showAlertMessage({
          message: err,
        });
      });
  };

  const today = dayjs().format('YYYY-MM-DD');
  const toDayStr =
    today.substring(0, 4) +
    '년 ' +
    Number(today.substring(5, 7)) +
    '월 ' +
    Number(today.substring(8, 10)) +
    '일';

  const chartConfig = {
    //backgroundGradientFrom: '#1E2923',
    //backgroundGradientFromOpacity: 0,
    //backgroundGradientTo: '#08130D',
    //backgroundGradientToOpacity: 0.5,
    backgroundGradientFrom: '#FFFFFF',
    backgroundGradientFromOpacity: 0,
    backgroundGradientTo: '#FFFFFF',
    backgroundGradientToOpacity: 0,
    //color: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`,
    //labelColor: (opacity = 1) => `rgba(1, 0, 255, ${opacity})`,
    color: (opacity = 1) => `rgba(134, 65, 244, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(000, 000, 000, ${opacity})`,
    //strokeWidth: 1, // optional, default 3
    useShadowColorFromDataset: false, // optional
  };
  let data = {};
  const getGarphValue: data = (type: string) => {
    let labels = [];
    let datas = [];
    let colors = [];

    for (let i = 0; i < stepHistoryList.length; i++) {
      if (i < 6) {
        labels.push(stepHistoryList[i].executionDate.substring(5, 10));
        datas.push(stepHistoryList[i].stepNum);
        colors.push(stepHistoryList[i].stepNum < 10000 ? '#F15F5F' : '#4374D9');
      }
    }

    //console.log('stepHistoryList ' + JSON.stringify(stepHistoryList, null, 2));
    let data = {
      labels: labels,
      datasets: [
        {
          data: datas.length > 0 ? datas : [1],
          color: (opacity = 1) => `rgba(134, 65, 244, ${opacity})`, // optional
          strokeWidth: 2, // optional
        },
      ],
      legend: ['걸음수'], // optional
    };

    let data2 = {
      labels: labels,
      datasets: [
        {
          data: datas.length > 0 ? datas : [1],
          color: colors,
        },
      ],
    };
    if (type === 'A') {
      return data;
    }
    if (type === 'B') {
      return data2;
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#FFF' }}>
      <LeftBackHeader title="" />
      <View style={[styles.stepHistorySection]}>
        {/*
        <Inter400Text style={{ fontSize: 18, padding: 4, color: '#000' }}>
          {toDayStr}
        </Inter400Text>
        <View style={styles.fixToText}>
          <TextInput
            value={stepNum}
            keyboardType="numeric"
            allowFontScaling={false}
            placeholder={'오늘의 걸음수를 입력해주세요.'}
            onChangeText={text => {
              changeState({ stepNum: text });
            }}
            placeholderTextColor={'#B6BDC3'}
            style={{
              color: '#000',
              fontSize: 18,
              borderWidth: 1,
              borderRadius: 10,
              fontFamily: FONTS.Inter.Bold,
            }}
          />
          <View style={styles.buttonSection}>
            <RectRoundButton label={'등록'} onPress={onUpdateStepInfo} />
          </View>
        </View>
          */}
        {stepHistoryList.length !== 0 && (
          <View>
            {/*
            <View style={{ padding: 10 }}>
              <LineChart
                data={getGarphValue('A')}
                width={Dimensions.get('window').width - 40}
                height={220}
                fromZero={true}
                withInnerLines={false}
                chartConfig={chartConfig}
              />
            </View>
        */}
            <View style={{ padding: 10 }}>
              <BarChart
                data={getGarphValue('B')}
                width={Dimensions.get('window').width - 60}
                height={220}
                //withCustomBarColorFromData={true}
                //flatColor={true}
                withInnerLines={false}
                fromZero={true}
                chartConfig={{
                  backgroundColor: '#3333FF',
                  backgroundGradientFrom: '#ffffff',
                  backgroundGradientTo: '#ffffff',
                  data: data.datasets,
                  color: (opacity = 1) => '#0000FF',
                  labelColor: (opacity = 1) =>
                    `rgba(000, 000, 000, ${opacity})`,
                }}
              />
            </View>
          </View>
        )}
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingTop: 10, paddingBottom: 440 }}
        >
          {stepHistoryList.map((d, idx) => (
            <StepInfoCard
              key={d.seq}
              seq={d.seq}
              executionDate={d.executionDate}
              stepNum={d.stepNum as unknown as number}
            />
          ))}
          {stepHistoryList.length === 0 && (
            <Inter400Text
              style={{
                color: '#000',
                fontSize: 16,
                marginTop: 40,
                textAlign: 'center',
              }}
            >
              걸음수 내역이 없습니다.
            </Inter400Text>
          )}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default StepInfoScreen;

const styles = StyleSheet.create({
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
  sectionView: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  buttonView: {
    paddingVertical: 16,
  },
  workView: {
    flex: 15,
  },
  bizView: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 10,
    paddingBottom: 20,
    backgroundColor: '#EAEAEA',
  },
  stepHistorySection: {
    paddingVertical: 20,
    paddingHorizontal: 20,
  },
  buttonSection: {
    width: 100,
    paddingHorizontal: 2,
    paddingVertical: 2,
  },
  fixToText: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
