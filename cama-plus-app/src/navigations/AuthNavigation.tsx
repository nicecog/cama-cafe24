import React from 'react';
import {
  createNativeStackNavigator,
  NativeStackScreenProps,
} from '@react-navigation/native-stack';
import { CompositeScreenProps } from '@react-navigation/native';

import { AppNavigationParams } from '@/navigations';
import LoginScreen from '@/screens/Auth/LoginScreen';
import LoginCredentialsScreen from '@/screens/Auth/LoginCredentialsScreen';
import SignUpPatientScreen from '@/screens/Auth/SignUpPatientScreen';
import FindAccountScreen from '@/screens/Auth/FindAccountScreen';
import TermsOfUseServiceScreen from '@/screens/Auth/TermsOfUseServiceScreen';
import PreviewScreen from '@/screens/Auth/Preview';
import PreviewContentsDetailScreen from '@/screens/Auth/ContentsDetail';
import { ContentsInfo } from '@/services/apis/contents/response';

export type AuthNavigationParams = {
  LoginScreen: undefined;
  LoginCredentialsScreen: undefined;
  SignUpPatientScreen: undefined;
  FindAccountScreen: undefined;
  TermsOfUseServiceScreen: {
    title: string;
    uri: string;
  };
  PreviewScreen: undefined;
  PreviewContentsDetailScreen: {
    contentsInfo: ContentsInfo;
  };
};

const Stack = createNativeStackNavigator<AuthNavigationParams>();

export type AuthNavigationScreenProps<T extends keyof AuthNavigationParams> =
  CompositeScreenProps<
    NativeStackScreenProps<AuthNavigationParams, T>,
    NativeStackScreenProps<AppNavigationParams>
  >;

const AuthNavigation = () => (
  <Stack.Navigator
    initialRouteName={'LoginScreen'}
    screenOptions={{
      headerShown: false,
      animation: 'slide_from_right',
    }}
  >
    <Stack.Screen name="LoginScreen" component={LoginScreen} />
    <Stack.Screen name="LoginCredentialsScreen" component={LoginCredentialsScreen} />
    <Stack.Screen name="SignUpPatientScreen" component={SignUpPatientScreen} />
    <Stack.Screen name="FindAccountScreen" component={FindAccountScreen} />
    <Stack.Screen name="TermsOfUseServiceScreen" component={TermsOfUseServiceScreen} />
    <Stack.Screen name="PreviewScreen" component={PreviewScreen} />
    <Stack.Screen name="PreviewContentsDetailScreen" component={PreviewContentsDetailScreen} />
  </Stack.Navigator>
);

export default AuthNavigation;
