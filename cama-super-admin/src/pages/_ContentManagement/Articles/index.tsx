
import React, { Fragment, useState, useEffect } from 'react';
import { Button, Grid, Typography, Table, TableCell, TableHead, TableRow, TextField } from '@mui/material';

/** Types **/
import { Pagination } from '../../../services/apis/mainApiClient';
import { RouteTag } from '../../../stores/pagingState';
import { SelectOption } from '../../../components/Select';

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

/** Helpers **/
import { defaultPaginationValue } from '../../../constants/app';
import { paginatedIndex } from '../../../utils';
import { dateSplit } from '../../../utils/days';
import {useNavigate} from 'react-router-dom';

/** Options **/

/** Alias **/
type SearchType = string;
const defaultSearchValue: SearchType = ''
const SEARCH_OPTIONS: SelectOption[] = []

interface PageState {
  list: string[];
  pagination: Pagination;
  searchType: SearchType;
  searchValue: string;
  searchedValue: string;
}

const routeTag: RouteTag = 'DATA_SENSOR_LIST';

function ContentArticleListPage() {
  const navigate = useNavigate();
  const [pagingState, setPagingState] = usePagingRecoilState();
  const [state, setState] = useState<PageState>({
    list: ['a'],
    pagination: defaultPaginationValue,
    searchType: '',
    searchValue: defaultSearchValue,
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
    // changeState({
    //   list: data,
    //   pagination,
    //   searchedValue: searchValue,
    // });
    // setPagingState(prev => ({
    //   ...prev,
    //   [routeTag]: {
    //     prevPagination: pagination,
    //     searchedValue: searchValue,
    //     searchType,
    //   },
    // }));
  }

  const handlePageChange = (page: number) => {
    const { searchType, searchedValue } = state;
    fetchData(page, searchType, searchedValue);
  }

  const fetchData = (page: number = 1, searchType: SearchType = defaultSearchValue, searchedValue: string ='') => {
    // changeState({
    //   list: [],
    //   pagination,
    // });
    // setPagingState(prev => ({
    //   ...prev,
    //   [routeTag]: {
    //     prevPagination: pagination,
    //     searchedValue,
    //     searchType,
    //   },
    // }));;
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
              navigate(`/content-management/article/add`)
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
                <TableCell align="center">제목</TableCell>
                <TableCell align="center">등록일</TableCell>
                <TableCell align="center">관리</TableCell>
              </TableRow>
            </TableHead>

            <EmptyCheckTableBody data={list} colSpan={4}>
              {list.map((d, idx) => (
                <TableRow key={idx}>
                  {/*<TableCell align="center">*/}
                  {/*  <Checkbox isSelected={true} onToggleSelected={() => {}} />*/}
                  {/*</TableCell>*/}
                  <TableCell align="center">{paginatedIndex(currentPage, idx)}</TableCell>
                  <TableCell align="center">
                    콘텐츠 제목입니다. 콘텐츠 제목입니다. 콘텐츠 제목입니다.
                  </TableCell>
                  <TableCell align="center">2023-08-11</TableCell>
                  <TableCell align="center">
                    <CustomButton onClick={() => {}}>상세</CustomButton>
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

export default ContentArticleListPage;
