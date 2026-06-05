import React, { useState, useEffect } from 'react';
import {
  View,
  SafeAreaView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  FlatList,
  Platform,
} from 'react-native';

import { useIsFocused } from '@react-navigation/native';
import { SelectList } from 'react-native-dropdown-select-list';

/** Types **/
import { ContentsInfo } from '@/services/apis/contents/response';
import { MainBottomTabNavigationProps } from '@/navigations/MainBottomTabNavigation';

/** Components **/
import LeftBackHeader from '@/components/Headers/LeftBackHeader';
import ContentCard from '@/screens/Home/MainScreen/ContentCard';
import RectRoundButton from '@/components/Buttons/RectRoundButton';

/** Services **/
import contentsApi from '@/services/apis/contents';

/** Styles **/
import { viewStyles } from '@/components/_StyleSheets';
import { Inter400Text, Inter700Text } from '@/components/Texts/InterText';
import FONTS from '@/constants/fonts';

/** Utils **/
import { showAlertMessage } from '@/utils/alertMessage';

/** Assets **/
import IC_SEARCH from '@/assets/icons/common/ic_search.svg';
import IC_CIRCLE_X_MARK from '@/assets/icons/buttons/ic_circle_x_mark.svg';
import { CareTrackAppliedInfo } from '@/services/apis/careTrack/response';
import IC_PLUS_MARK from '@/assets/icons/buttons/ic_plus_mark.svg';

interface PageState {
  contentsList: ContentsInfo[];
}

const MyFavoriteScreen: React.FC<
  MainBottomTabNavigationProps<'MyFavoriteScreen'>
> = ({ navigation: { navigate } }) => {
  const isFocused = useIsFocused();
  const [state, setState] = useState<PageState>({
    contentsList: [],
  });

  const changeState = (newState: Partial<PageState>) => {
    setState(prev => ({
      ...prev,
      ...newState,
    }));
  };

  const { contentsList } = state;
  const [cancerSelected, setCancerSelected] = React.useState('99');
  const data = [
    { key: '99', value: '전체' },
    { key: '2', value: '유방암' },
    { key: '3', value: '폐암' },
    // { key: '4', value: '대장암', disabled: true },
    { key: '4', value: '대장암' },
    { key: '6', value: '갑상선암' },
    { key: '8', value: '암(General)' },
  ];

  const initData = () => {
    //console.log('cancerSelected => ' + cancerSelected);
    contentsApi
      .fetchFavoriteList()
      .then(res => {
        changeState({
          contentsList: res.filter(d => {
            // !!d.viewed && d.diseaseSeq === parseInt(cancerSelected),
            if (cancerSelected === '99') {
              return !!d.viewed;
            } else {
              return !!d.viewed && d.diseaseSeq === parseInt(cancerSelected);
            }
          }),
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
      initData();
    }
  }, [isFocused]);

  useEffect(() => {
    initData();
  }, [cancerSelected]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#FFF' }}>
      <LeftBackHeader borderBottom={false} title="즐겨찾기" />
      <View>
        <View style={[styles.searchSection]}>
          <View style={viewStyles.rowAiCenterJcEnd}>
            <TouchableOpacity
              onPress={() => navigate('SearchContentsScreen')}
              style={[viewStyles.rowAiCenterJcCenter, styles.btnStyle]}
            >
              {/*<IC_PLUS_MARK /> */}
              <Inter400Text style={{ color: '#ED7101', fontSize: 16 }}>
                암 정보검색
              </Inter400Text>
            </TouchableOpacity>
          </View>

          <View style={[{ paddingTop: 10 }]}>
            <SelectList
              setSelected={setCancerSelected}
              data={data}
              save="key"
              placeholder="암 종류를 선택하세요."
              search={false}
              maxHeight={400}
            />
          </View>
        </View>
      </View>
      <View style={[styles.contentSection]}>
        {contentsList.length > 0 && (
          <Inter400Text
            style={{
              fontSize: 14,
              color: '#000',
              marginBottom: 8,
            }}
          >
            {'조회결과 '}
            <Inter400Text style={{ color: '#ED7101' }}>
              {contentsList.length}
            </Inter400Text>
            건
          </Inter400Text>
        )}
      </View>
      <View style={{ flex: 1, paddingHorizontal: 16 }}>
        <FlatList
          data={contentsList}
          keyExtractor={item => `${item.seq}`}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => {
                navigate('ContentsDetailScreen', {
                  contentsInfo: item,
                  trackServiceSeq: '' || null,
                });
              }}
            >
              <ContentCard contentsInfo={item} />
            </TouchableOpacity>
          )}
          ListEmptyComponent={
            <View
              style={[
                { flex: 1, marginTop: 120 },
                viewStyles.rowAiCenterJcCenter,
              ]}
            >
              <Inter400Text style={{ fontSize: 18, color: '#B6BDC3' }}>
                즐겨찾기 내역이 없습니다.
              </Inter400Text>
            </View>
          }
        />
      </View>
    </SafeAreaView>
  );
};

export default MyFavoriteScreen;

const styles = StyleSheet.create({
  searchSection: {
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    marginTop: 8,
    marginBottom: 16,
    paddingHorizontal: 16,
    backgroundColor: '#FFF',
  },
  searchView: {
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#ED7101',
    borderRadius: 20,
    paddingHorizontal: 16,
  },
  contentSection: {
    paddingHorizontal: 20,
  },
  btnStyle: {
    width: 100,
    height: 40,
    borderRadius: 20,
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#ED7101',
  },
});
