import React, { ReactElement } from 'react';
import { View, Dimensions, StyleSheet } from 'react-native';

//import SCHEDULE_MANAGEMENT_TAB_ACTIVE from '@/assets/icons/bottomTabs/gp_schedule_tab_active.svg';
//import SCHEDULE_MANAGEMENT_TAB_INACTIVE from '@/assets/icons/bottomTabs/gp_schedule_tab_inactive.svg';
//import HOME_TAB from '@/assets/icons/bottomTabs/ic_home_tab.svg';
//import HOME_TAB_INACTIVE from '@/assets/icons/bottomTabs/ic_home_tab_inactive.svg';
//import MY_PAGE_TAB_ACTIVE from '@/assets/icons/bottomTabs/gp_mypage_tab_active.svg';
//import MY_PAGE_TAB_INACTIVE from '@/assets/icons/bottomTabs/gp_mypage_tab_inactive.svg';
//import HEALTH_COACHING_ON from '@/assets/icons/bottomTabs/gp_health_coaching_tab_on.svg';
//import HEALTH_COACHING_OFF from '@/assets/icons/bottomTabs/gp_health_coaching_tab_off.svg';

import SCHEDULE_MANAGEMENT_TAB_ACTIVE from '@/assets/icons/bottomTabs/icon_schedule_on.svg';
import SCHEDULE_MANAGEMENT_TAB_INACTIVE from '@/assets/icons/bottomTabs/icon_schedule_off.svg';
import HOME_TAB from '@/assets/icons/bottomTabs/icon_home_on.svg';
import HOME_TAB_INACTIVE from '@/assets/icons/bottomTabs/icon_home_off.svg';
//import MY_PAGE_TAB_ACTIVE from '@/assets/icons/bottomTabs/icon_my_on.svg';
//import MY_PAGE_TAB_INACTIVE from '@/assets/icons/bottomTabs/icon_my_off.svg';
import HEALTH_COACHING_ON from '@/assets/icons/bottomTabs/icon_health_on.svg';
import HEALTH_COACHING_OFF from '@/assets/icons/bottomTabs/icon_health_off.svg';
import WELLBEING_COACHING_ON from '@/assets/icons/bottomTabs/icon_wellbeing_on.svg';
import WELLBEING_COACHING_OFF from '@/assets/icons/bottomTabs/icon_wellbeing_off.svg';
//import FAVORITE_ON from '@/assets/icons/bottomTabs/icon_wellbeing_on.svg';
//import FAVORITE_OFF from '@/assets/icons/bottomTabs/icon_wellbeing_off.svg';
import FAVORITE_ON from '@/assets/icons/bottomTabs/icon_favorite_on.svg';
import FAVORITE_OFF from '@/assets/icons/bottomTabs/icon_favorite_off.svg';

type BottomTabType =
  | 'Home'
  | 'ScheduleManagement'
  | 'HealthCoaching'
  | 'Wellbeing'
  | 'Favorite';
// | 'MyPage';

interface BottomTabInfo {
  icon: ReactElement;
  activeIcon: ReactElement;
}

type BottomTabInfoType = {
  [key in BottomTabType]: BottomTabInfo;
};

const bottomTabInfo: BottomTabInfoType = {
  ScheduleManagement: {
    icon: <SCHEDULE_MANAGEMENT_TAB_INACTIVE />,
    activeIcon: <SCHEDULE_MANAGEMENT_TAB_ACTIVE />,
  },
  Home: {
    icon: <HOME_TAB_INACTIVE />,
    activeIcon: <HOME_TAB />,
  },
  HealthCoaching: {
    icon: <HEALTH_COACHING_OFF />,
    activeIcon: <HEALTH_COACHING_ON />,
  },
  Wellbeing: {
    icon: <WELLBEING_COACHING_OFF />,
    activeIcon: <WELLBEING_COACHING_ON />,
  },
  Favorite: {
    icon: <FAVORITE_OFF />,
    activeIcon: <FAVORITE_ON />,
  },
  // MyPage: {
  //   icon: <MY_PAGE_TAB_INACTIVE />,
  //   activeIcon: <MY_PAGE_TAB_ACTIVE />,
  // },
};

interface IBottomTabItemProps {
  bottomTabType: BottomTabType;
  selected: boolean;
}

const BottomTabItem: React.FC<IBottomTabItemProps> = ({
  bottomTabType,
  selected,
}) => {
  const windowWidth = Dimensions.get('window').width / 5;
  const { icon, activeIcon } = bottomTabInfo[bottomTabType];
  return (
    <View style={[styles.tabView, { width: windowWidth }]}>
      <View style={{ paddingBottom: 10 }}>{selected ? activeIcon : icon}</View>
    </View>
  );
};

export default BottomTabItem;

const styles = StyleSheet.create({
  tabView: {
    width: 56,
    height: 20,
    alignItems: 'center',
    justifyContent: 'flex-end',
    backgroundColor: '#FFF',
  },
});
