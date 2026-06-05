import React from 'react';
import { NavLink } from 'react-router-dom';

import { Breadcrumb } from 'interfaces/menu';

import * as S from './styled';

interface Props {
  breadcrumbs: Array<Breadcrumb>;
}

function Breadcrumbs({ breadcrumbs }: Props) {
  return (
    <S.Breadcrumbs aria-label="breadcrumb">
      {breadcrumbs.map(({ title, link }) => (
        <S.Text variant="body2" key={title}>
          {link ? <NavLink to={link}>{title}</NavLink> : title}
        </S.Text>
      ))}
    </S.Breadcrumbs>
  );
}

export default Breadcrumbs;
