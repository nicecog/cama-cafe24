import React, { useState, useEffect, useRef } from "react"
import styled from 'styled-components'

import { FULL_SCREEN_MAX_WIDTH } from '../../constants/app';

interface AlertModalProps {
  title: string;
  onCloseModal: () => void;
}

const AlertModal: React.FC<AlertModalProps> = ({title='', onCloseModal}) => {
  const [modalFlag, setModalFlag] = useState(false)
  const wrapRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setModalFlag(true);
    setTimeout(() => {
      wrapRef.current?.focus();
    }, 200);
  }, [])

  return (
    <Wrap modalFlag={modalFlag}>
      <Modal>
        <Title>{title}</Title>
        <ButtonSection
          ref={wrapRef}
          tabIndex={0}
          onKeyDown={(e) => {
            console.log('e.code >>> ', e.code)
            if (e.code === 'ENTER') {

            }
          }}
        >
          <Button onClick={onCloseModal}>
            닫기
          </Button>
        </ButtonSection>
      </Modal>
    </Wrap>
  )
}

export default AlertModal

const Wrap = styled.div<{ modalFlag: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: ${({modalFlag}) => modalFlag ? 'flex' : 'none'};
  background-color: rgba(57, 57, 57, 0.9);
  align-items: center;
  justify-content: space-between;
  z-index: 99999;
  overflow: visible;
`

const Modal = styled.div`
  width: 90%;
  max-width: ${FULL_SCREEN_MAX_WIDTH}px;
  box-shadow: 0 4px 16px 0 rgba(0, 0, 0, 0.5);
  background-color: #ffffff;
  position: relative;
  margin: 0 auto;
  text-align: center;
  
  padding: 14px 15px 14px 17px;
  border-radius: 5px;
  box-shadow: 0 6px 20px 0 rgba(0, 0, 0, 0.5);
`

const Title = styled.h3`
  font-size: 16px;
  line-height: 1.21;
  text-align: left;
  color: #393939;
  margin-bottom: 5px;
`

const ButtonSection = styled.div`
  display: flex;
  margin-top: 28px;
  justify-content: flex-end;
`

const Button = styled.button`
  font-size: 16px;
  line-height: 1.2;
  color: #0535ff;
  
  border: none;
  outline: none;
  background: #ffffff;
  cursor: pointer;
`
