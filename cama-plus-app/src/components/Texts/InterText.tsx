import React, { ReactNode } from 'react';
import { StyleProp, Text, TextStyle, StyleSheet } from 'react-native';

import FONTS from '@/constants/fonts';

interface TextProps {
  style?: StyleProp<TextStyle>;
  numberOfLines?: number;
  children: ReactNode;
}

export const Inter100Text: React.FC<TextProps> = ({ style, children }) => {
  return (
    <Text style={[styles.Thin, style]} allowFontScaling={false}>
      {children}
    </Text>
  );
};

export const Inter200Text: React.FC<TextProps> = ({ style, children }) => {
  return (
    <Text style={[styles.ExtraLight, style]} allowFontScaling={false}>
      {children}
    </Text>
  );
};

export const Inter300Text: React.FC<TextProps> = ({ style, children }) => {
  return (
    <Text style={[styles.Light, style]} allowFontScaling={false}>
      {children}
    </Text>
  );
};

export const Inter400Text: React.FC<TextProps> = ({
  style,
  numberOfLines,
  children,
}) => {
  return (
    <Text
      numberOfLines={numberOfLines}
      style={[styles.Regular, style]}
      allowFontScaling={false}
    >
      {children}
    </Text>
  );
};

export const Inter500Text: React.FC<TextProps> = ({ style, children }) => {
  return (
    <Text style={[styles.Medium, style]} allowFontScaling={false}>
      {children}
    </Text>
  );
};

export const Inter600Text: React.FC<TextProps> = ({
  style,
  numberOfLines,
  children,
}) => {
  return (
    <Text
      numberOfLines={numberOfLines}
      style={[styles.SemiBold, style]}
      allowFontScaling={false}
    >
      {children}
    </Text>
  );
};

export const Inter700Text: React.FC<TextProps> = ({
  style,
  numberOfLines,
  children,
}) => {
  return (
    <Text
      numberOfLines={numberOfLines}
      style={[styles.Bold, style]}
      allowFontScaling={false}
    >
      {children}
    </Text>
  );
};

export const Inter800Text: React.FC<TextProps> = ({ style, children }) => {
  return (
    <Text style={[styles.ExtraBold, style]} allowFontScaling={false}>
      {children}
    </Text>
  );
};

export const Inter900Text: React.FC<TextProps> = ({ style, children }) => {
  return (
    <Text style={[styles.Black, style]} allowFontScaling={false}>
      {children}
    </Text>
  );
};

const styles = StyleSheet.create({
  Thin: {
    fontFamily: FONTS.Inter.Thin,
    // fontWeight: '100',
  },
  ExtraLight: {
    fontFamily: FONTS.Inter.ExtraLight,
    // fontWeight: '200',
  },
  Light: {
    fontFamily: FONTS.Inter.Light,
    // fontWeight: '300',
  },
  Regular: {
    fontFamily: FONTS.Inter.Regular,
    // fontWeight: '400',
  },
  Medium: {
    fontFamily: FONTS.Inter.Medium,
    // fontWeight: '500',
  },
  SemiBold: {
    fontFamily: FONTS.Inter.SemiBold,
    // fontWeight: '600',
  },
  Bold: {
    fontFamily: FONTS.Inter.Bold,
    // fontWeight: '700',
  },
  ExtraBold: {
    fontFamily: FONTS.Inter.ExtraBold,
    // fontWeight: '800',
  },
  Black: {
    fontFamily: FONTS.Inter.Black,
    // fontWeight: '900',
  },
});
