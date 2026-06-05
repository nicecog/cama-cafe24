import React, { useState, useEffect } from 'react';
import { Button, Grid, Table, TableCell, TableHead, TableRow } from '@mui/material';

/** Types **/
import { Pagination } from '../../../services/apis/mainApiClient';
import { CancerInfo } from '../../../services/apis/adminCancer/response';

/** Components **/
import EmptyCheckTableBody from 'components/EmptyCheckTableBody';
import { CardContainer, CardHeader } from 'components/PageCard';
import { CustomButton } from '../../../components/_Styled/Buttons';
import { TextInput } from '../../../components/_Styled/TextFields';
import PageHeader from 'components/PageHeader';
import SearchInput from 'components/SearchInput';
import WithPagination from 'components/WithPagination';
import BasicModal from 'components/Modals/BasicModal';

import AlertModal from 'components/Modals/AlertModal';
import ConfirmModal from 'components/Modals/ConfirmModal';

/** Hooks **/
import useAlertState from 'hooks/useAlertState';

/** Services **/
import adminCancerApi from '../../../services/apis/adminCancer';

/** Helpers **/
import { defaultPaginationValue } from '../../../constants/app';
import { paginatedIndex } from '../../../utils';

/** Options **/

/** Alias **/
type SearchType = string;
const defaultSearchValue: SearchType = ''

type BasicModalType = 'ADD' | 'UPDATE'

interface PageState {
  list: CancerInfo[];
  filteredList: CancerInfo[];
  pagination: Pagination;
  searchType: SearchType;
  searchValue: string;
  searchedValue: string;
  showBasicModal: boolean;
  basicModalType: BasicModalType;
  nameText: string;
  targetSeq: number | null;
}

function SystemDiseaseListPage() {
  const [state, setState] = useState<PageState>({
    list: [],
    filteredList: [],
    pagination: defaultPaginationValue,
    searchType: '',
    searchValue: defaultSearchValue,
    searchedValue: '',
    showBasicModal: false,
    basicModalType: 'ADD',
    nameText: '',
    targetSeq: null,
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

  const onUpdateMajor = () => {
    const { nameText, targetSeq } = state;

    if (nameText === '' || targetSeq === null) {
      return;
    }

    adminCancerApi
      .updateAdminCancer(targetSeq, { name: nameText })
      .then(res => {
        if (res) {
          fetchData();
        }
      })
      .catch(err => {
        onShowAlert(err);
      });
  };

  const onRemoveMajor = (seq: number) => {
    adminCancerApi
      .removeAdminCancer(seq)
      .then(res => {
        if (res) {
          fetchData();
        }
      })
      .catch(err => {
        onShowAlert(err);
      });
  }

  const onAddMajor = () => {
    const { nameText } = state;

    if (nameText === '') {
      return;
    }

    adminCancerApi
      .addAdminCancer({ name: nameText })
      .then(res => {
        if (res) {
          fetchData();
        }
      })
      .catch(err => {
        onShowAlert(err);
      });
  };

  const searchData = () => {
    const { searchValue, list } = state;

    if (searchValue === '') {
      changeState({ filteredList: list });
      return;
    }

    const searchedList = list.filter(d => d.name.includes(searchValue))
    changeState({ filteredList: searchedList });
  }

  const fetchData = () => {
    adminCancerApi
      .fetchAdminCancerList()
      .then(res => {
        changeState({
          list: res,
          filteredList: res,
          showBasicModal: false,
        });
      })
      .catch(err => {
        onShowAlert(err);
      });
  }

  useEffect(() => {
    fetchData();
  }, []);

  const {
    pagination, list, filteredList,
    searchValue,
    showBasicModal, basicModalType, nameText,
  } = state;
  const { currentPage } = pagination;
  const { alertFlag, alertTitle, confirmFlag, confirmTitle } = alertState

  const totalCount = filteredList.length;

  return (
    <div>
      <PageHeader />
      <CardContainer>
        <CardHeader>
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
              changeState({
                showBasicModal: true,
                basicModalType: 'ADD',
                nameText: '',
                targetSeq: null,
              });
            }}
          >
            등록
          </Button>
        </CardHeader>

        <WithPagination currentPage={currentPage} totalCount={totalCount} onPageChange={() => {}}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell align="center">#</TableCell>
                <TableCell align="center">질병(암)</TableCell>
                <TableCell align="center">관리</TableCell>
              </TableRow>
            </TableHead>

            <EmptyCheckTableBody data={list} colSpan={3}>
              {filteredList.length === 0 && (
                <TableRow>
                  <TableCell align="center" colSpan={3}>
                    No Data
                  </TableCell>
                </TableRow>
              )}
              {filteredList.map((d, idx) => (
                <TableRow key={idx}>
                  {/*<TableCell align="center">*/}
                  {/*  <Checkbox isSelected={true} onToggleSelected={() => {}} />*/}
                  {/*</TableCell>*/}
                  <TableCell align="center">{paginatedIndex(currentPage, idx)}</TableCell>
                  <TableCell align="center">{d.name}</TableCell>
                  <TableCell align="center">
                    <CustomButton
                      onClick={() => {
                        changeState({
                          showBasicModal: true,
                          basicModalType: 'UPDATE',
                          nameText: d.name,
                          targetSeq: d.seq
                        });
                      }}
                    >
                      수정
                    </CustomButton>
                    <CustomButton
                      onClick={() => {
                        onShowConfirm('삭제하시겠습니까?', () => {
                          onRemoveMajor(d.seq);
                        });
                      }}
                    >
                      삭제
                    </CustomButton>
                  </TableCell>
                </TableRow>
              ))}
            </EmptyCheckTableBody>
          </Table>
        </WithPagination>
      </CardContainer>

      <BasicModal
        title={`질환 ${basicModalType === 'ADD' ? '등록' : '수정'}`}
        doneLabel={'적용'}
        open={showBasicModal}
        onClose={() => changeState({ showBasicModal: false })}
        onPressDone={() => {
          if (basicModalType === 'ADD') {
            onAddMajor();
          }
          if (basicModalType === 'UPDATE') {
            onUpdateMajor();
          }
        }}
      >
        <Grid direction={'column'} container>
          <Grid item xs={12}>
            <TextInput
              required
              fullWidth
              placeholder={''}
              value={nameText}
              onChange={(e) => changeState({ nameText: e.target.value })}
            />
          </Grid>
        </Grid>
      </BasicModal>

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

export default SystemDiseaseListPage;
