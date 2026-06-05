import React, { useState } from 'react';
import {
  View,
  TouchableOpacity,
  StyleProp,
  ViewStyle,
  Image,
  Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import dayjs from 'dayjs';

/** Styles **/
import { Inter400Text, Inter700Text } from '@/components/Texts/InterText';
import { viewStyles, borderStyles } from '@/components/_StyleSheets';

/** Types **/
import { ScheduleInfo } from '@/services/apis/scheduleManager/response';

/** Services **/
import scheduleManagerApi from '@/services/apis/scheduleManager';

/** Helpers **/
import { showAlertMessage } from '@/utils/alertMessage';

/** Assets **/
import IC_ARROW_PREV from '@/assets/icons/calendars/ic_arrow_prev.svg';
import IC_ARROW_NEXT from '@/assets/icons/calendars/ic_arrow_next.svg';
import IC_CHECK_ACTIVE from '@/assets/icons/buttons/ic_check_active.svg';
import IC_CHECK_DISABLE from '@/assets/icons/buttons/ic_check_disable.svg';
import IC_CHECK_EMPTY from '@/assets/icons/buttons/ic_check_empty.svg';

interface Props {
  ampm: string;
  time: string;
  title: string;
  memo: string;
  done: boolean;
  onPressUpdate: () => void;
  onPressDone: () => void;
}

export const EmptyScheduleItem = () => {
  return (
    <View
      style={[
        viewStyles.rowAiCenterJcCenter,
        borderStyles.basicBorder,
        {
          paddingHorizontal: 16,
          paddingVertical: 24,
          marginBottom: 8,
          backgroundColor: '#FFF',
        },
      ]}
    >
      <Inter400Text style={{ fontSize: 18, color: '#000', marginLeft: 24 }}>
        등록된 일정이 없습니다.
      </Inter400Text>
    </View>
  );
};

const ScheduleItem: React.FC<Props> = ({
  ampm,
  time,
  title,
  memo,
  done,
  onPressUpdate,
  onPressDone,
}) => {
  //console.log('title => ' + title);
  //console.log('done => ' + done);

  return (
    <View
      style={[
        viewStyles.rowAiCenterJcCenter,
        borderStyles.basicBorder,
        {
          padding: 8,
          marginTop: 0,
          marginBottom: 4,
          backgroundColor: '#FFF',
          borderRadius: 24,
        },
      ]}
    >
      <View style={{ flex: 1 }}>
        <View style={viewStyles.rowAiCenterJcBetween}>
          <View
            style={{
              flex: 1,
              paddingLeft: 10,
              paddingRight: 20,
              height: memo != '' ? 58 : 40,
            }}
          >
            <View style={viewStyles.rowAiCenter}>
              <Inter700Text
                style={[
                  { fontSize: 16 },
                  title === '내원' && { color: '#6cb77e' },
                  title === '복약' && { color: '#dd5e17' },
                  title === '기타' && { color: '#777777' },
                ]}
              >
                {title}
              </Inter700Text>

              <View style={viewStyles.rowAiCenterJcEnd}>
                <View
                  style={[
                    viewStyles.rowAiCenter,
                    { width: '38%', paddingLeft: 26 },
                  ]}
                >
                  <Inter700Text
                    style={{
                      fontSize: 16,
                      color: '#444444',
                      marginLeft: 20,
                    }}
                  >
                    {ampm}
                  </Inter700Text>
                  {Platform.OS === 'ios' && (
                    <Inter700Text
                      style={{
                        fontSize: 16,
                        color: '#444444',
                        paddingLeft: 10,
                        //marginTop: 3,
                        width: 100,
                      }}
                    >
                      {time}
                    </Inter700Text>
                  )}
                  {Platform.OS !== 'ios' && (
                    <Inter700Text
                      style={{
                        fontSize: 16,
                        color: '#444444',
                        paddingLeft: 10,
                        marginTop: 3,
                        width: 100,
                      }}
                    >
                      {time}
                    </Inter700Text>
                  )}
                </View>
                <View style={{ marginLeft: 70, marginRight: 20 }}>
                  {!done && (
                    <View style={viewStyles.rowAiStart}>
                      <View style={viewStyles.rowAiStart}>
                        <Inter400Text
                          style={{
                            fontSize: 16,
                            color: '#969696',
                            marginTop: 3,
                            marginRight: 4,
                          }}
                        >
                          미완료
                        </Inter400Text>
                        <TouchableOpacity onPress={onPressDone}>
                          <IC_CHECK_DISABLE width={30} height={30} />
                        </TouchableOpacity>
                      </View>
                    </View>
                  )}
                  {done && (
                    <View style={viewStyles.rowAiStart}>
                      <Inter400Text
                        style={{
                          fontSize: 16,
                          color: '#FE8825',
                          marginTop: 3,
                          marginRight: 4,
                        }}
                      >
                        완료됨
                      </Inter400Text>
                      <TouchableOpacity onPress={onPressDone}>
                        <IC_CHECK_ACTIVE width={30} height={30} />
                      </TouchableOpacity>
                    </View>
                  )}
                </View>
              </View>
            </View>
            {memo !== '' && memo !== null && (
              <View style={{ flex: 1 }}>
                <Inter400Text
                  style={{
                    fontSize: 16,
                    color: '#7E7E7E',
                    marginLeft: 50,
                    marginTop: 4,
                  }}
                >
                  {memo}
                </Inter400Text>
              </View>
            )}
          </View>
        </View>
      </View>
      {/*
      <TouchableOpacity
        onPress={onPressUpdate}
        style={{ paddingLeft: 16 }}
      >
        <Inter400Text
          style={{
            fontSize: 16,
            color: '#ED7101',
          }}
        >
          수정
        </Inter400Text>
      </TouchableOpacity>
        */}
    </View>
  );
};

export default ScheduleItem;
