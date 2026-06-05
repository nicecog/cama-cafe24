import React from 'react';
import {
  createNativeStackNavigator,
  NativeStackScreenProps,
} from '@react-navigation/native-stack';
import { CompositeScreenProps } from '@react-navigation/native';

import { AppNavigationParams } from '@/navigations';
import SignUpStepScreen from '@/screens/Auth/SignUpStep';

export type StepNavigationParams = {
  SignUpStepScreen: undefined;
};

const Stack = createNativeStackNavigator<StepNavigationParams>();

export type StepNavigationScreenProps<T extends keyof StepNavigationParams> =
  CompositeScreenProps<
    NativeStackScreenProps<StepNavigationParams, T>,
    NativeStackScreenProps<AppNavigationParams>
  >;

const StepNavigation = () => (
  <Stack.Navigator
    initialRouteName={'SignUpStepScreen'}
    screenOptions={{
      headerShown: false,
      animation: 'slide_from_right'
    }}
  >
    <Stack.Screen name="SignUpStepScreen" component={SignUpStepScreen} />
  </Stack.Navigator>
);

export default StepNavigation;
