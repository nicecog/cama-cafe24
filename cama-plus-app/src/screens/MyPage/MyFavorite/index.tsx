import React, { useState, useEffect } from 'react';
import {
  View,
  SafeAreaView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  FlatList,
} from 'react-native';

import { useIsFocused } from '@react-navigation/native';

/** Types **/
import { MainNavigationScreenProps } from '@/navigations/MainNavigation';
import { ContentsInfo } from '@/services/apis/contents/response';

/** Components **/
import LeftBackHeader from '@/components/Headers/LeftBackHeader';
import ContentCard from '@/screens/Home/MainScreen/ContentCard';

/** Services **/
import contentsApi from '@/services/apis/contents';

/** Styles **/
import { viewStyles } from '@/components/_StyleSheets';
import { Inter400Text } from '@/components/Texts/InterText';
import FONTS from '@/constants/fonts';

/** Utils **/
import { showAlertMessage } from '@/utils/alertMessage';

/** Assets **/
import IC_SEARCH from '@/assets/icons/common/ic_search.svg';
import IC_CIRCLE_X_MARK from '@/assets/icons/buttons/ic_circle_x_mark.svg';
import { CareTrackAppliedInfo } from '@/services/apis/careTrack/response';

interface PageState {
  contentsList: ContentsInfo[];
}

const MyFavoriteScreen: React.FC<
  MainNavigationScreenProps<'MyFavoriteScreen'>
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

  const initData = () => {
    contentsApi
      .fetchFavoriteList()
      .then(res => {
        changeState({
          contentsList: res.filter(d => !!d.viewed),
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

  const { contentsList } = state;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#FFF' }}>
      <LeftBackHeader borderBottom={false} title="즐겨찾기" />
      <View style={[styles.searchSection]}>
        <TouchableOpacity
          onPress={() => navigate('SearchContentsScreen')}
          style={[styles.searchView, viewStyles.rowAiCenterJcBetween]}
        >
          <Inter400Text
            style={{
              flex: 1,
              color: '#B6BDC3',
              fontSize: 18,
              fontFamily: FONTS.Inter.Regular,
            }}
          >
            암 정보를 직접 찾아보세요.
          </Inter400Text>
          <View style={viewStyles.rowAiCenter}>
            <View
              style={[
                { width: 24, height: 40 },
                viewStyles.rowAiCenterJcCenter,
              ]}
            >
              <IC_SEARCH />
            </View>
          </View>
        </TouchableOpacity>
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
});
