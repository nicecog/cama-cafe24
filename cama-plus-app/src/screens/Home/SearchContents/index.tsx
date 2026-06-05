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

/** Types **/
import { MainNavigationScreenProps } from '@/navigations/MainNavigation';
import { ContentsInfo } from '@/services/apis/contents/response';
import { SelectList } from 'react-native-dropdown-select-list';

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
import careTrackApi from '@/services/apis/careTrack';

interface PageState {
  searchText: string;
  isSearched: boolean;
  contentsList: ContentsInfo[];
  careTrackAppliedInfo: CareTrackAppliedInfo | null;
}

const SearchContentsScreen: React.FC<
  MainNavigationScreenProps<'SearchContentsScreen'>
> = ({ navigation: { navigate } }) => {
  const [state, setState] = useState<PageState>({
    searchText: '',
    isSearched: true,
    contentsList: [],
    careTrackAppliedInfo: null,
  });

  const changeState = (newState: Partial<PageState>) => {
    setState(prev => ({
      ...prev,
      ...newState,
    }));
  };

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

  const onSearchContents = () => {
    const { searchText } = state;
    let cancerType = '';
    //console.log('cancerSelected => ' + cancerSelected);
    if (
      searchText === '' &&
      (cancerSelected === '' || cancerSelected === '99')
    ) {
      showAlertMessage({
        message: '암 종류 또는 검색어 중 하나는 입력하셔야 합니다.',
      });
      return;
    }

    if (cancerSelected === '99') {
      cancerType = '';
    } else {
      cancerType = cancerSelected;
    }
    //console.log('searchText => ' + searchText);
    //console.log('cancerType => ' + cancerType);

    contentsApi
      .searchContentsList(searchText, cancerType)
      .then(res => {
        changeState({
          contentsList: res.filter(d => !!d.viewed),
          isSearched: true,
        });
      })
      .catch(err => {
        showAlertMessage({
          message: err,
        });
      });
  };

  const onResetSearchedContents = () => {
    changeState({
      contentsList: [],
      isSearched: false,
      searchText: '',
    });
  };

  const initData = () => {
    careTrackApi
      .getCareTrackServiceAppliedInfo()
      .then(res => {
        changeState({ careTrackAppliedInfo: res });
      })
      .catch(err => console.log(err));
  };

  useEffect(() => {
    initData();
  }, []);

  const { searchText, isSearched, contentsList, careTrackAppliedInfo } = state;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#FFF' }}>
      <LeftBackHeader borderBottom={false} title="암 정보검색" />
      <View style={[styles.searchSection]}>
        <View style={[{ paddingBottom: 10 }]}>
          <SelectList
            setSelected={setCancerSelected}
            data={data}
            save="key"
            placeholder="암 종류를 선택하세요."
            search={false}
            maxHeight={400}
            boxStyles={styles.searchSelectView}
            dropdownStyles={styles.searchSelectView}
          />
        </View>
        <View style={[styles.searchView, viewStyles.rowAiCenterJcBetween]}>
          <TextInput
            value={searchText}
            placeholder={'암 정보 검색어를 입력하세요.'}
            onChangeText={text => changeState({ searchText: text })}
            placeholderTextColor={'#B6BDC3'}
            allowFontScaling={false}
            style={{
              flex: 1,
              color: '#000',
              fontSize: 15,
              fontFamily: FONTS.Inter.Regular,
              height: 44,
            }}
            onSubmitEditing={onSearchContents}
          />
          <View style={viewStyles.rowAiCenter}>
            {isSearched && (
              <TouchableOpacity
                onPress={onResetSearchedContents}
                style={[
                  { width: 24, height: 24 },
                  viewStyles.rowAiCenterJcCenter,
                ]}
              >
                <IC_CIRCLE_X_MARK />
              </TouchableOpacity>
            )}
            <TouchableOpacity
              onPress={onSearchContents}
              style={[
                { width: 34, height: 34 },
                viewStyles.rowAiCenterJcCenter,
              ]}
            >
              <IC_SEARCH />
            </TouchableOpacity>
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
            {'검색결과 '}
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
                  trackServiceSeq: careTrackAppliedInfo?.seq || null,
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
                검색결과가 없습니다.
              </Inter400Text>
            </View>
          }
        />
      </View>
    </SafeAreaView>
  );
};

export default SearchContentsScreen;

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
    //borderColor: '#ED7101',
    borderColor: '#808080',
    borderRadius: 10,
    paddingHorizontal: 16,
  },
  searchSelectView: {
    borderStyle: 'solid',
    borderWidth: 1,
    //borderColor: '#ED7101',
    borderColor: '#808080',
    borderRadius: 10,
  },
  contentSection: {
    paddingHorizontal: 20,
  },
});
