import React, { useEffect, useState } from 'react';
import { Button, Table, TableCell, TableRow, Typography, styled } from '@mui/material';

import EmptyCheckTableBody from 'components/EmptyCheckTableBody';
import { CardContainer, CardHeader } from 'components/PageCard';
import PageHeader from 'components/PageHeader';
import SearchInput from 'components/SearchInput';
import WithPagination from 'components/WithPagination';
import AlertModal from 'components/Modals/AlertModal';

import useAlertState from 'hooks/useAlertState';
import { usePagingRecoilState } from 'hooks/recoil/usePagingState';

import contentsApi from 'services/apis/contents';
import { ContentsListItem } from 'services/apis/contents/response';
import { Pagination } from 'services/apis/mainApiClient';
import { RouteTag } from 'stores/pagingState';
import { defaultPaginationValue } from 'constants/app';

interface PageState {
  list: ContentsListItem[];
  pagination: Pagination;
  searchValue: string;
  searchedValue: string;
}

const routeTag: RouteTag = 'SYSTEM_TREATMENT_STATUS_LIST';

function SystemTreatmentStatusPage() {
  const [pagingState, setPagingState] = usePagingRecoilState();
  const [state, setState] = useState<PageState>({
    list: [],
    pagination: defaultPaginationValue,
    searchValue: '',
    searchedValue: '',
  });
  const { alertState, onCloseAlert } = useAlertState();

  const changeState = (newState: Partial<PageState>) => {
    setState((prev) => ({
      ...prev,
      ...newState,
    }));
  };

  const fetchData = (page: number = 1, searchedValue: string = '') => {
    contentsApi
      .fetchContentsList(page, searchedValue)
      .then((res) => {
        const { data, pagination } = res;
        changeState({
          list: data,
          pagination,
          searchedValue,
        });
        setPagingState((prev) => ({
          ...prev,
          [routeTag]: {
            prevPagination: pagination,
            searchedValue,
            searchType: '',
            startDate: '',
            endDate: '',
          },
        }));
      })
      .catch((err) => console.log(err));
  };

  const searchData = () => {
    fetchData(1, state.searchValue);
  };

  const handlePageChange = (page: number) => {
    fetchData(page, state.searchedValue);
  };

  useEffect(() => {
    const prevPagingState = pagingState[routeTag];

    if (prevPagingState === null || prevPagingState === undefined) {
      fetchData();
    } else {
      const { prevPagination, searchedValue } = prevPagingState;
      fetchData(prevPagination.currentPage, searchedValue);
    }
  }, []);

  const { pagination, list, searchValue } = state;
  const { currentPage, totalCount } = pagination;
  const { alertFlag, alertTitle } = alertState;

  return (
    <div>
      <PageHeader />
      <CardContainer>
        <CardHeader>
          <SearchInput
            value={searchValue}
            placeholder="제목·내용 검색"
            onChange={(e) => changeState({ searchValue: e.target.value })}
            onKeyUp={(e) => {
              if (e.code === 'Enter') {
                searchData();
              }
            }}
          />
          <Button
            variant="contained"
            color="primary"
            style={{ height: 56, width: 100 }}
            onClick={searchData}
          >
            검색
          </Button>
        </CardHeader>
        <div style={{ borderBottom: '1px solid rgba(224,224,224,1)' }} />

        <WithPagination
          currentPage={currentPage}
          totalCount={totalCount ?? 0}
          onPageChange={handlePageChange}
        >
          <Table stickyHeader>
            <EmptyCheckTableBody data={list} colSpan={1} noDataText="등록된 치료정보가 없습니다.">
              {list.map((item) => (
                <TableRow key={item.seq}>
                  <TableCell align="left" style={{ display: 'flex' }}>
                    {item.image ? (
                      <ThumbImg src={item.image} alt="thumb" />
                    ) : (
                      <EmptyThumb />
                    )}
                    <ContentView>
                      <Typography variant="subtitle1">{item.title}</Typography>
                      <InfoView>
                        <Typography variant="body2">의사: {item.doctorName}</Typography>
                        <Typography variant="body2" style={{ paddingLeft: 20 }}>
                          진료과: {item.departmentName}
                        </Typography>
                        <Typography variant="body2" style={{ paddingLeft: 20 }}>
                          질환: {item.diseaseName}
                        </Typography>
                        <Typography variant="body2" style={{ paddingLeft: 20 }}>
                          조회수: {item.viewCount ?? 0}
                        </Typography>
                        <Typography variant="body2" style={{ paddingLeft: 20 }}>
                          공개: {item.viewed ? 'Y' : 'N'}
                        </Typography>
                        <Typography variant="body2" style={{ paddingLeft: 20 }}>
                          수정일: {item.updatedAt}
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

      {alertFlag && <AlertModal title={alertTitle} onCloseModal={onCloseAlert} />}
    </div>
  );
}

export default SystemTreatmentStatusPage;

const ThumbImg = styled('img')`
  width: 80px;
  height: 80px;
  border-radius: 8px;
  object-fit: cover;
`;

const EmptyThumb = styled('div')`
  width: 80px;
  height: 80px;
  border-radius: 8px;
  background: #f0f0f0;
`;

const ContentView = styled('div')`
  margin-left: 16px;
  flex: 1;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const InfoView = styled('div')`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  margin-top: 8px;
  gap: 4px;
`;
