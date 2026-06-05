import React, { useState, useEffect } from 'react';
import { Button, Typography, Table, TableCell, TableRow, styled } from '@mui/material';
import { useNavigate } from 'react-router-dom';

/** Types **/
import { Pagination } from '../../../services/apis/mainApiClient';
import { RouteTag } from '../../../stores/pagingState';
import { SelectOption } from '../../../components/Select';
import { TreatmentInfo } from '../../../services/apis/doctorContents/response';
import { DoctorInfo } from '../../../services/apis/adminDoctor/response';

/** Components **/
import EmptyCheckTableBody from 'components/EmptyCheckTableBody';
import { CardContainer, CardHeader } from 'components/PageCard';
import PageHeader from 'components/PageHeader';
import SearchInput from 'components/SearchInput';
import WithPagination from 'components/WithPagination';
import Select from '../../../components/Select';

import AlertModal from 'components/Modals/AlertModal';
import ConfirmModal from 'components/Modals/ConfirmModal';

/** Hooks **/
import useAlertState from 'hooks/useAlertState';
import { usePagingRecoilState } from '../../../hooks/recoil/usePagingState';
import { useSetCountState } from '../../../hooks/recoil/useCountState';

/** Services **/
import doctorContentsApi from '../../../services/apis/doctorContents';
import adminDoctorApi from '../../../services/apis/adminDoctor';

/** Helpers **/
import { defaultPaginationValue } from '../../../constants/app';

/** Options **/
import { DOCTOR_LIST_SEARCH_OPTIONS, DoctorSearchValueType } from '../../../constants/options';

/** Alias **/
type SearchType = DoctorSearchValueType;
const defaultSearchValue: SearchType = 'name'
const SEARCH_OPTIONS: SelectOption[] = DOCTOR_LIST_SEARCH_OPTIONS

interface PageState {
  list: DoctorInfo[];
  pagination: Pagination;
  searchType: SearchType;
  searchValue: string;
  searchedValue: string;
}

const routeTag: RouteTag = 'SYSTEM_DOCTOR_LIST';

function SystemDoctorListPage() {
  const navigate = useNavigate();
  const [pagingState, setPagingState] = usePagingRecoilState();
  const setCountState = useSetCountState();
  const [state, setState] = useState<PageState>({
    list: [],
    pagination: defaultPaginationValue,
    searchType: defaultSearchValue,
    searchValue: '',
    searchedValue: '',
  });
  const {
    alertState,
    onShowAlert,
    onCloseAlert,
    onShowConfirm,
    onConfirmDone,
    onConfirmCancel,
  } = useAlertState();

  const changeState = (newState: Partial<PageState>) => {
    setState(prev => ({
      ...prev,
      ...newState,
    }));
  };

  const searchData = () => {
    // searchValue === '' then, 전체 검색.
    const { searchType, searchValue } = state;
    fetchData(1, searchType, searchValue);
  }

  const handlePageChange = (page: number) => {
    const { searchType, searchedValue } = state;
    fetchData(page, searchType, searchedValue);
  }

  const fetchData = (page: number = 1, searchType: SearchType = defaultSearchValue, searchedValue: string ='') => {
    adminDoctorApi
      .fetchAdminDoctorList(page, searchType, searchedValue)
      .then(res => {
        const { data, pagination } = res;
        changeState({
          list: data,
          pagination,
          searchedValue,
        });
        setPagingState(prev => ({
          ...prev,
          [routeTag]: {
            prevPagination: pagination,
            searchedValue,
            searchType,
          },
        }));;
      })
      .catch(err => console.log(err));
  }

  const initCountData = () => {

  };

  useEffect(() => {
    const prevPagingState = pagingState[routeTag];

    if (prevPagingState === null || prevPagingState === undefined) {
      fetchData();
    } else {
      const { prevPagination, searchType, searchedValue } = prevPagingState;
      fetchData(prevPagination.currentPage, searchType as SearchType, searchedValue);
    }
    initCountData();
  }, []);``

  const {
    pagination, list,
    searchValue, searchType,
  } = state;
  const { currentPage, totalCount } = pagination;
  const { alertFlag, alertTitle, confirmFlag, confirmTitle } = alertState

  return (
    <div>
      <PageHeader />
      <CardContainer>
        <CardHeader>
          <Select
            styles={{ maxWidth: 240 }}
            label="검색필터"
            value={searchType}
            onChange={(e) => {
              const opt = e.target.value as SearchType;
              changeState({ searchType: opt });
            }}
            options={SEARCH_OPTIONS}
          />
          <SearchInput
            value={searchValue}
            placeholder="검색어 입력"
            onChange={e => changeState({ searchValue: e.target.value })}
            onKeyUp={e => {
              if (e.code === 'Enter') {
                searchData();
              }
            }}
          />
          <Button
            variant="contained" color="primary"
            style={{ height: 56, width: 100 }}
            onClick={searchData}
          >
            검색
          </Button>
          <Button
            variant="contained" color="primary"
            style={{ height: 56, width: 100 }}
            sx={{ background: '#FFF', color: '#00AB55', border: '1px solid #00AB55' }}
            onClick={() => {
              navigate(`/system-management/doctor/add`)
            }}
          >
            등록
          </Button>
        </CardHeader>
        <div style={{ borderBottom: '1px solid rgba(224,224,224,1)' }} />

        <WithPagination currentPage={currentPage} totalCount={totalCount ?? 0} onPageChange={handlePageChange}>
          <Table stickyHeader>
            <EmptyCheckTableBody data={list} colSpan={4}>
              {list.map((d, idx) => (
                <TableRow
                  key={idx}
                  onClick={() => {
                    navigate(`/system-management/doctor/detail/${d.seq}`)
                  }}
                >
                  <TableCell align="left" style={{ display: 'flex', cursor: 'pointer' }}>
                    {d.profileImage !== null && <ThumbImg src={d.profileImage} alt="thumb"/>}
                    {d.profileImage === null && <EmptyThumbImg />}
                    <ContentView>
                      <div style={{ display: 'flex' }}>
                        <SectionView>
                          <InfoView>
                            <Typography
                              variant="h4"
                              style={{ display: 'flex', alignItems: 'center' }}
                            >
                              {d.name}
                            </Typography>
                            <Typography
                              variant="subtitle2"
                              style={{ marginLeft: 8 }}
                            >
                              {d.nick}
                            </Typography>
                            <Typography
                              variant="subtitle2"
                              style={{ marginLeft: 20 }}
                            >
                              {d.departmentName}
                            </Typography>
                          </InfoView>
                          <Typography variant="subtitle2">
                            전화번호: {d.phone}
                          </Typography>
                          <Typography variant="subtitle2">
                            이메일 주소: {d.loginId}
                          </Typography>

                        </SectionView>
                        <SectionView>
                          <Typography variant="subtitle2">
                            {d.hospitalName}
                          </Typography>
                          <Typography variant="subtitle2">
                            치료정보: 0
                          </Typography>
                          <Typography variant="subtitle2">
                            최근접속정보: -
                          </Typography>
                        </SectionView>
                      </div>
                      <Typography variant="subtitle2">
                        프로필: {d.profileLink !== null && <a href={d.profileLink} target={'_blank'}>{d.profileLink}</a>}
                      </Typography>
                    </ContentView>
                  </TableCell>
                </TableRow>
              ))}
            </EmptyCheckTableBody>
          </Table>
        </WithPagination>
      </CardContainer>

      {alertFlag &&
        <AlertModal
          title={alertTitle}
          onCloseModal={onCloseAlert}
        />}
      {confirmFlag &&
        <ConfirmModal
          title={confirmTitle}
          onDoneModal={onConfirmDone}
          onCloseModal={onConfirmCancel}
        />}
    </div>
  );
}

export default SystemDoctorListPage;

const ThumbImg = styled('img')`
  width: 100px;
  height: 100px;
  border-radius: 8px;
  object-fit: cover;
`

const EmptyThumbImg = styled('div')`
  width: 100px;
  height: 100px;
  border-radius: 8px;
  background: #EFEFEF;
`

const ContentView = styled('div')`
  margin-left: 16px;
  flex: 1;
  width: 100%;
  height: 100px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`

const InfoView = styled('div')`
  display: flex;
  align-items: center;
`

const SectionView = styled(`div`)`
  flex: 1;
`
