import React, { Fragment, useState, useEffect } from 'react';
import { Button, Grid, Typography, Table, TableCell, TableHead, TableRow, TextField } from '@mui/material';
import { useNavigate } from 'react-router-dom';

/** Types **/
import { Pagination } from '../../../services/apis/mainApiClient';
import { RouteTag } from '../../../stores/pagingState';
import { SelectOption } from '../../../components/Select';
import { StandardDiseaseRowInfo } from '../../../services/apis/adminDisease/response';

/** Components **/
import EmptyCheckTableBody from 'components/EmptyCheckTableBody';
import { CardContainer, CardHeader } from 'components/PageCard';
import { CustomButton } from '../../../components/_Styled/Buttons';
import PageHeader from 'components/PageHeader';
import SearchInput from 'components/SearchInput';
import WithPagination from 'components/WithPagination';
import Select from '../../../components/Select';
import BasicModal from 'components/Modals/BasicModal';

import AlertModal from 'components/Modals/AlertModal';
import ConfirmModal from 'components/Modals/ConfirmModal';

/** Hooks **/
import useAlertState from 'hooks/useAlertState';
import { usePagingRecoilState } from '../../../hooks/recoil/usePagingState';

/** Services **/
import adminDiseaseApi from '../../../services/apis/adminDisease';

/** Helpers **/
import { defaultPaginationValue } from '../../../constants/app';
import { paginatedIndex } from '../../../utils';
import { dateSplit } from '../../../utils/days';

/** Options **/
import { HOSPITAL_DISEASE_LIST_SEARCH_OPTIONS, HospitalDiseaseSearchValueType } from '../../../constants/options';

/** Alias **/
type SearchType = HospitalDiseaseSearchValueType;
const defaultSearchValue: SearchType = 'hospitalName'
const SEARCH_OPTIONS: SelectOption[] = HOSPITAL_DISEASE_LIST_SEARCH_OPTIONS

interface PageState {
  list: StandardDiseaseRowInfo[];
  pagination: Pagination;
  searchType: SearchType;
  searchValue: string;
  searchedValue: string;
}

const routeTag: RouteTag = 'SYSTEM_HOSPITAL_DISEASE_LIST';

function SystemHospitalDiseaseListPage() {
  const navigate = useNavigate();
  const [pagingState, setPagingState] = usePagingRecoilState();
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
    adminDiseaseApi
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
      .catch(err => {
        onShowAlert(err);
      });
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
              navigate(`/system-management/hospital-disease/add`)
            }}
          >
            등록
          </Button>
        </CardHeader>

        <WithPagination currentPage={currentPage} totalCount={totalCount ?? 0} onPageChange={handlePageChange}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell align="center">#</TableCell>
                <TableCell align="center">병원</TableCell>
                <TableCell align="center">질환</TableCell>
                <TableCell align="center">치료시기</TableCell>
                <TableCell align="center">치료정보</TableCell>
                <TableCell align="center">관리</TableCell>
              </TableRow>
            </TableHead>

            <EmptyCheckTableBody data={list} colSpan={6}>
              {list.map((d, idx) => (
                <TableRow key={idx}>
                  {/*<TableCell align="center">*/}
                  {/*  <Checkbox isSelected={true} onToggleSelected={() => {}} />*/}
                  {/*</TableCell>*/}
                  <TableCell align="center">{paginatedIndex(currentPage, idx)}</TableCell>
                  <TableCell align="center">
                    {d.hospitalName}
                  </TableCell>
                  <TableCell align="center">{d.diseaseName}</TableCell>
                  <TableCell align="center">{d.treatmentCount}개</TableCell>
                  <TableCell align="center">{d.contentsCount}개</TableCell>
                  <TableCell align="center">
                    <CustomButton
                      onClick={() => {
                        navigate(`/system-management/hospital-disease/detail/${d.seq}`)
                      }}
                    >
                      상세
                    </CustomButton>
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

export default SystemHospitalDiseaseListPage;
