import React from 'react';
import { StyleSheet } from 'react-native';
import {
  createBottomTabNavigator,
  BottomTabScreenProps,
} from '@react-navigation/bottom-tabs';

/** Types **/
import { CompositeScreenProps } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { MainNavigationParams } from '@/navigations/MainNavigation';

/** Screens **/
import ScheduleManagementMainScreen from '@/screens/ ScheduleManagement/MainScreen';
import HomeMainScreen from '@/screens/Home/MainScreen';
//import MyPageMainScreen from '@/screens/MyPage/MainScreen';
import HealthCoachingMainScreen from '@/screens/HealthCoaching/MainScreen';
import WellbeingMainScreen from '@/screens/Wellbeing/MainScreen';
import FavoriteMainScreen from '@/screens/Favorite/MainScreen';

/** Components **/
import BottomTabItem from '@/components/Tabs/BottomTabItem';

/** Hooks **/
import { useHideTabBarValue } from '@/hooks/recoil/useHideTabBarRecoilStates';

/** Utils **/
import { getBottomAdditionalHeight } from '@/utils/iPhoneHelpers';

export type MainBottomTabNavigationParams = {
  ScheduleManagementMainScreen: undefined;
  HomeMainScreen: undefined;
  HealthCoachingMainScreen: undefined;
  //MyPageMainScreen: undefined;
  WellbeingMainScreen: undefined;
  FavoriteMainScreen: undefined;
};

export type MainBottomTabNavigationProps<
  T extends keyof MainBottomTabNavigationParams,
> = CompositeScreenProps<
  BottomTabScreenProps<MainBottomTabNavigationParams, T>,
  NativeStackScreenProps<MainNavigationParams>
>;

const BottomTab = createBottomTabNavigator();

const MainBottomTabNavigation = () => {
  const hideTabBar = useHideTabBarValue();
  return (
    <BottomTab.Navigator
      initialRouteName={'HomeMainScreen'}
      screenOptions={{
        tabBarShowLabel: true,
        headerShown: false,
        tabBarIconStyle: {
          marginBottom: -48,
        },
        tabBarLabelStyle: {
          paddingTop: 14,
          paddingBottom: 8,
          color: '#777777',
        },
      }}
    >
      <BottomTab.Screen
        name={'HomeMainScreen'}
        component={HomeMainScreen}
        options={{
          tabBarStyle: [
            styles.tabBarStyle,
            hideTabBar && styles.tabBarHideOption,
          ],
          tabBarLabel: '홈',
          tabBarIcon: ({ focused }) => (
            <BottomTabItem bottomTabType={'Home'} selected={focused} />
          ),
        }}
      />
      <BottomTab.Screen
        name={'ScheduleManagementMainScreen'}
        component={ScheduleManagementMainScreen}
        options={{
          tabBarStyle: styles.tabBarStyle,
          tabBarLabel: '일정관리',
          tabBarIcon: ({ focused }) => (
            <BottomTabItem
              bottomTabType={'ScheduleManagement'}
              selected={focused}
            />
          ),
        }}
      />

      <BottomTab.Screen
        name={'HealthCoachingMainScreen'}
        component={HealthCoachingMainScreen}
        initialParams={{ categoryCd: 'M' }}
        options={{
          tabBarStyle: styles.tabBarStyle,
          tabBarLabel: '건강코칭',
          tabBarIcon: ({ focused }) => (
            <BottomTabItem
              bottomTabType={'HealthCoaching'}
              selected={focused}
            />
          ),
        }}
      />

      <BottomTab.Screen
        name={'WellbeingMainScreen'}
        component={WellbeingMainScreen}
        initialParams={{ categoryCd: 'M' }}
        options={{
          tabBarStyle: styles.tabBarStyle, //{ display: 'none' },
          tabBarLabel: '웰빙자원',
          tabBarIcon: ({ focused }) => (
            <BottomTabItem bottomTabType={'Wellbeing'} selected={focused} />
          ),
        }}
      />

      <BottomTab.Screen
        name={'FavoriteMainScreen'}
        component={FavoriteMainScreen}
        initialParams={{ categoryCd: 'M' }}
        options={{
          tabBarStyle: styles.tabBarStyle, //{ display: 'none' },
          tabBarLabel: '즐겨찾기',
          tabBarIcon: ({ focused }) => (
            <BottomTabItem bottomTabType={'Favorite'} selected={focused} />
          ),
        }}
      />
      {/*
      <BottomTab.Screen
        name={'MyPageMainScreen'}
        component={MyPageMainScreen}
        options={{
          tabBarStyle: styles.tabBarStyle,
          tabBarLabel: '내정보',
          tabBarIcon: ({ focused }) => (
            <BottomTabItem bottomTabType={'MyPage'} selected={focused} />
          ),
        }}
      />
      */}
    </BottomTab.Navigator>
  );
};

export default MainBottomTabNavigation;

const styles = StyleSheet.create({
  tabBarStyle: {
    backgroundColor: '#FFFFFF',
    height: 56 + getBottomAdditionalHeight(),
    zIndex: 1,
    borderStyle: 'solid',
    borderTopWidth: 1,
    borderTopColor: '#D3D3D3',
    elevation: 0, // remove shadow on Android
    shadowOpacity: 0, // remove shadow on iOS
  },
  tabBarHideOption: {
    display: 'none',
  },
});
