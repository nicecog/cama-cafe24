import React from 'react';
import {
  createNativeStackNavigator,
  NativeStackScreenProps,
} from '@react-navigation/native-stack';
import {
  CompositeScreenProps,
  NavigatorScreenParams,
} from '@react-navigation/native';

import MainBottomTabNavigation, {
  MainBottomTabNavigationParams,
} from '@/navigations/MainBottomTabNavigation';

/** Types **/
import { AppNavigationParams } from '@/navigations';
import { ContentsInfo } from '@/services/apis/contents/response';
import { ScheduleInfo } from '@/services/apis/scheduleManager/response';

/** Screens **/
import AddScheduleScreen from '@/screens/ ScheduleManagement/AddScheduleScreen';
import UpdateScheduleScreen from '@/screens/ ScheduleManagement/UpdateScheduleScreen';
import ApplyCareTrackScreen from '@/screens/MyPage/ApplyCareTrack';
import UserInfoScreen from '@/screens/MyPage/UserInfo';
import StepInfoScreen from '@/screens/MyPage/StepInfo';
import MyFavoriteScreen from '@/screens/MyPage/MyFavorite';
import ContentsDetailScreen from '@/screens/Home/ContentsDetail';
import AddDoctorServiceScreen from '@/screens/MyPage/AddDoctorService';
import TermsOfUseServiceScreen from '@/screens/MyPage/TermsOfUseServiceScreen';
import SearchContentsScreen from '@/screens/Home/SearchContents';
import HealthCoachingCategoryScreen from '@/screens/HealthCoaching/CategoryScreen';
import MyPageMainScreen from '@/screens/MyPage/MainScreen';
import HelpPageMainScreen from '@/screens/MyPage/HelpInfo';

export type MainNavigationParams = {
  MainBottomTabNavigation: NavigatorScreenParams<MainBottomTabNavigationParams>;
  AddScheduleScreen: { paramTargetDate: string };
  UpdateScheduleScreen: {
    schedule: ScheduleInfo;
  };
  ApplyCareTrackScreen: undefined;
  UserInfoScreen: undefined;
  ContentsDetailScreen: {
    contentsInfo: ContentsInfo;
    trackServiceSeq: number | null;
  };
  AddDoctorServiceScreen: undefined;
  TermsOfUseServiceScreen: {
    title: string;
    uri: string;
  };
  SearchContentsScreen: undefined;
  StepInfoScreen: undefined;
  MyFavoriteScreen: undefined;
  HealthCoachingCategoryScreen: {
    categoryCd: string;
  };
};

const Stack = createNativeStackNavigator<MainNavigationParams>();

export type MainNavigationScreenProps<T extends keyof MainNavigationParams> =
  CompositeScreenProps<
    NativeStackScreenProps<MainNavigationParams, T>,
    NativeStackScreenProps<AppNavigationParams>
  >;

const MainNavigation = () => (
  <Stack.Navigator
    initialRouteName={'MainBottomTabNavigation'}
    screenOptions={{ headerShown: false, animation: 'slide_from_right' }}
  >
    <Stack.Screen
      name="MainBottomTabNavigation"
      component={MainBottomTabNavigation}
    />
    <Stack.Screen name="AddScheduleScreen" component={AddScheduleScreen} />
    <Stack.Screen
      name="UpdateScheduleScreen"
      component={UpdateScheduleScreen}
    />
    <Stack.Screen
      name="ApplyCareTrackScreen"
      component={ApplyCareTrackScreen}
    />
    <Stack.Screen name="UserInfoScreen" component={UserInfoScreen} />
    <Stack.Screen
      name="ContentsDetailScreen"
      component={ContentsDetailScreen}
    />
    <Stack.Screen
      name="AddDoctorServiceScreen"
      component={AddDoctorServiceScreen}
    />
    <Stack.Screen
      name="TermsOfUseServiceScreen"
      component={TermsOfUseServiceScreen}
    />
    <Stack.Screen
      name="SearchContentsScreen"
      component={SearchContentsScreen}
    />
    <Stack.Screen name="StepInfoScreen" component={StepInfoScreen} />
    <Stack.Screen name="MyFavoriteScreen" component={MyFavoriteScreen} />
    <Stack.Screen name="MyPageMainScreen" component={MyPageMainScreen} />
    <Stack.Screen name="HelpPageMainScreen" component={HelpPageMainScreen} />

    <Stack.Screen
      name="HealthCoachingCategoryScreen"
      component={HealthCoachingCategoryScreen}
    />
  </Stack.Navigator>
);

export default MainNavigation;
