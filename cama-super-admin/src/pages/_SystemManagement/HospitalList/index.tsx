import React, { useState, useEffect } from 'react';
import { Button, Typography, Table, TableCell, TableRow, styled } from '@mui/material';
import { useNavigate } from 'react-router-dom';

/** Types **/
import { Pagination } from '../../../services/apis/mainApiClient';
import { RouteTag } from '../../../stores/pagingState';
import { SelectOption } from '../../../components/Select';
import { HospitalInfo } from '../../../services/apis/adminHospital/response';

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
import adminHospitalApi from '../../../services/apis/adminHospital';

/** Helpers **/
import { defaultPaginationValue } from '../../../constants/app';

/** Options **/
import { HOSPITAL_LIST_SEARCH_OPTIONS, HospitalSearchValueType } from '../../../constants/options';

/** Alias **/
type SearchType = HospitalSearchValueType;
const defaultSearchType: SearchType = 'name'
const SEARCH_OPTIONS: SelectOption[] = HOSPITAL_LIST_SEARCH_OPTIONS

interface PageState {
  list: HospitalInfo[];
  pagination: Pagination;
  searchType: SearchType;
  searchValue: string;
  searchedValue: string;
}

const routeTag: RouteTag = 'SYSTEM_HOSPITAL_LIST';

function SystemHospitalListPage() {
  const navigate = useNavigate();
  const [pagingState, setPagingState] = usePagingRecoilState();
  const setCountState = useSetCountState();
  const [state, setState] = useState<PageState>({
    list: [],
    pagination: defaultPaginationValue,
    searchType: defaultSearchType,
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

  const fetchData = (page: number = 1, searchType: SearchType = defaultSearchType, searchedValue: string ='') => {
    adminHospitalApi
      .fetchAdminHospitalList(page, searchType, searchedValue)
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

  useEffect(() => {
    const prevPagingState = pagingState[routeTag];

    if (prevPagingState === null || prevPagingState === undefined) {
      fetchData();
    } else {
      const { prevPagination, searchType, searchedValue } = prevPagingState;
      fetchData(prevPagination.currentPage, searchType as SearchType, searchedValue);
    }
  }, []);

  const {
    pagination, list,
    searchValue, searchType,
  } = state;
  const { currentPage, totalCount } = pagination;
  const { alertFlag, alertTitle, confirmFlag, confirmTitle } = alertState

  console.log(JSON.stringify(list))

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
              navigate(`/system-management/hospital/add`)
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
                    navigate(`/system-management/hospital/detail/${d.seq}`)
                  }}
                >
                  <TableCell align="left" style={{ display: 'flex', cursor: 'pointer' }}>
                    <ContentView>
                      <ContentRow>
                        <div>
                          <Typography variant="h4">{d.name}</Typography>
                          <Typography variant="subtitle2">{d.address}</Typography>
                        </div>
                        <div style={{ paddingRight: 40 }}>
                          <Typography variant="subtitle2">사업자등록번호 {d.corpNumber}</Typography>
                          <Typography variant="subtitle2">홈페이지 {d.homepage}</Typography>
                        </div>
                      </ContentRow>
                      <InfoView>
                        <Typography
                          variant="body2"
                          style={{ paddingRight: 40 }}
                        >
                          담당자: <span style={{ fontWeight: 'bold', fontSize: 18 }}>{d.profName}</span> 교수
                        </Typography>
                        <Typography
                          variant="body2"
                          style={{ paddingRight: 40 }}
                        >
                          {d.profMajor}
                        </Typography>
                        <Typography
                          variant="body2"
                          style={{ paddingRight: 40 }}
                        >
                          {d.profEmail}
                        </Typography>
                        <Typography
                          variant="body2"
                          style={{ paddingRight: 40 }}
                        >
                          {d.profPhone}
                        </Typography>
                      </InfoView>
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

export default SystemHospitalListPage;

const ThumbImg = styled('img')`
  width: 80px;
  height: 80px;
  border-radius: 8px;
  object-fit: cover;
`

const ContentView = styled('div')`
  margin-left: 16px;
  flex: 1;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`

const ContentRow = styled('div')`
  display: flex;
  justify-content: space-between;
`;

const InfoView = styled('div')`
  display: flex;
  align-items: center;
  margin-top: 20px;
`
