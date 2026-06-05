import React from 'react';

import AnalyticsOutlinedIcon from '@mui/icons-material/AnalyticsOutlined';
import ArticleOutlinedIcon from '@mui/icons-material/ArticleOutlined';
import CampaignOutlinedIcon from '@mui/icons-material/CampaignOutlined';
import ManageAccountsOutlinedIcon from '@mui/icons-material/ManageAccountsOutlined';
import PeopleOutlineOutlinedIcon from '@mui/icons-material/PeopleOutlineOutlined';

import { Menu } from 'interfaces/menu';

const menus: Menu[] = [
  {
    title: '시스템 관리',
    link: '/system-management',
    icon: <AnalyticsOutlinedIcon />,
    sub: [
      {
        title: '병원 정보',
        link: '/system-management/hospital/list',
      },
      {
        title: '전공 목록',
        link: '/system-management/major/list',
      },
      {
        title: '의사 정보',
        link: '/system-management/doctor/list',
      },
      {
        title: '질환 목록',
        link: '/system-management/disease/list',
      },
      {
        title: '질환 기준정보',
        link: '/system-management/hospital-disease/list',
      },
      {
        title: '치료정보 사용현황',
        link: '/system-management/treatment/status',
      },
    ],
  },
  {
    title: '기타 관리',
    link: '/etc-management',
    icon: <AnalyticsOutlinedIcon />,
    sub: [
      {
        title: '비밀번호 변경',
        link: '/etc-management/update/password',
      },
    ],
  },
];

export default menus;
