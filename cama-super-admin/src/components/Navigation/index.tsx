import React, { useEffect, useState } from 'react';
import { List } from '@mui/material';

import NavigationListItem from './NavigationListItem';

import { useCountRecoilState } from '../../hooks/recoil/useCountState';
import doctorContentsApi from '../../services/apis/doctorContents';

import menus from 'constants/menus';

function Navigation() {
  const [countState, setCountState] = useCountRecoilState();

  const initData = () => {
    // doctorContentsApi
    //   .getDoctorInfoCount()
    //   .then(res => {
    //     setCountState(prev => ({
    //       ...prev,
    //       doneContents: res.doneContents,
    //       ingContents: res.ingContents,
    //     }));
    //   })
    //   .catch(err => console.log(err))
  };

  useEffect(() => {
    initData();
  }, []);

  return (
    <List>
      {menus.map((menu) => (
        <NavigationListItem countInfo={countState} menu={menu} key={menu.title} />
      ))}
    </List>
  );
}

export default Navigation;
