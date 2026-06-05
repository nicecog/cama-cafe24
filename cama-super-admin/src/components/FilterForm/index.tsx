import React, { PropsWithChildren } from 'react';

import * as S from './styled';

interface Props {
  onSubmit: () => void;
  onReset?: () => void;
}

function FilterForm({ onSubmit, onReset, children }: PropsWithChildren<Props>) {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit();
  };

  return (
    <form onSubmit={handleSubmit}>
      <S.Wrapper>
        {children}
        <S.ButtonGroup>
          <S.SubmitButton type="submit" variant="contained" color="primary">
            검색
          </S.SubmitButton>
          <S.ResetButton onClick={onReset}>초기화</S.ResetButton>
        </S.ButtonGroup>
      </S.Wrapper>
    </form>
  );
}

export default FilterForm;
