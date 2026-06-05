import React, { useState, useEffect } from 'react';
import { Button, Typography, Table, TableCell, TableRow, styled } from '@mui/material';
import { useNavigate } from 'react-router-dom';

/** Types **/
import { Pagination } from '../../../services/apis/mainApiClient';
import { RouteTag } from '../../../stores/pagingState';
import { SelectOption } from '../../../components/Select';
import { TreatmentInfo } from '../../../services/apis/doctorContents/response';

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

/** Helpers **/
import { defaultPaginationValue } from '../../../constants/app';

/** Options **/

/** Alias **/
type SearchType = string;
const defaultSearchValue: SearchType = ''
const SEARCH_OPTIONS: SelectOption[] = []

interface PageState {
  list: TreatmentInfo[];
  pagination: Pagination;
  searchType: SearchType;
  searchValue: string;
  searchedValue: string;
}

const routeTag: RouteTag = 'CONTENT_TREATMENT_LIST';

function ContentTreatmentListPage() {
  const navigate = useNavigate();
  const [pagingState, setPagingState] = usePagingRecoilState();
  const setCountState = useSetCountState();
  const [state, setState] = useState<PageState>({
    list: [],
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
    fetchData(1, searchType, searchValue);
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
    doctorContentsApi.
      fetchDoctorContentsList(page, searchType, searchedValue)
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
    doctorContentsApi
      .getDoctorInfoCount()
      .then(res => {
        setCountState(prev => ({
          ...prev,
          doneContents: res.doneContents,
          ingContents: res.ingContents,
        }));
      })
      .catch(err => console.log(err))
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
              navigate(`/content-management/treatment/add`)
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
                    navigate(`/content-management/treatment/detail/${d.seq}`)
                  }}
                >
                  <TableCell align="left" style={{ display: 'flex', cursor: 'pointer' }}>
                    <ThumbImg src={d.image} alt="thumb"/>
                    <ContentView>
                      <Typography variant="subtitle1">{d.title}</Typography>
                      <InfoView>
                        <Typography
                          variant="body2"
                          style={{ width: 100 }}
                        >
                          작성자: {d.doctorName}
                        </Typography>
                        <Typography
                          variant="body2"
                          style={{ paddingLeft: 20 }}
                        >
                          최근수정: {d.updatedAt}
                        </Typography>
                        <Typography
                          variant="body2"
                          style={{ flex: 1, textAlign: 'right', paddingRight: 20 }}
                        >
                          조회수: {d.viewCount}
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

export default ContentTreatmentListPage;

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
  height: 80px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`

const InfoView = styled('div')`
  display: flex;
  align-items: center;
`
