import React, { ReactNode } from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
} from 'react-native';

import FONTS from '@/constants/fonts';
import { viewStyles } from '@/components/_StyleSheets';
import { Inter400Text } from '@/components/Texts/InterText';


interface BasicPickerItemProps {
  label: string;
  selected: boolean;
  onPress?: () => void;
  icon?: ReactNode;
}

const BasicPickerItem: React.FC<BasicPickerItemProps> = ({
  label,
  selected,
  onPress,
  icon,
}) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <View style={icon ? viewStyles.rowAiCenter : {}}>
        {icon}
        <Inter400Text
          style={[
            selected
              ? pickerItemStyles.pickerCellSelected
              : pickerItemStyles.pickerCell,
            icon ? { marginLeft: 10 } : {},
          ]}
        >
          {label}
        </Inter400Text>
      </View>
    </TouchableOpacity>
  );
};

export default BasicPickerItem;

export const pickerItemStyles = StyleSheet.create({
  pickerCell: {
    height: 45,
    textAlign: 'center',
    textAlignVertical: 'center',
    color: '#666666',
    justifyContent: 'center',
  },
  pickerCellSelected: {
    height: 45,
    textAlign: 'center',
    textAlignVertical: 'center',
    color: '#333333',
    fontFamily: FONTS.Inter.Bold,
  },
});
