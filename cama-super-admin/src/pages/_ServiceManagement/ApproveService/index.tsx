import React, {Fragment, useEffect, useState} from 'react';
import { Typography, Grid, Box, styled } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { groupBy, pipe, entries, map, toArray, flat, } from '@fxts/core';

/** Types **/
import { OptionItem } from '../../../constants/options';
import { DoctorServiceStatusDto } from '../../../services/apis/doctorContents/request';
import { ServiceInfo } from '../../../services/apis/doctorContents/response';

/** Components **/
import { CardContainer } from 'components/PageCard';
import { TextInput } from '../../../components/_Styled/TextFields';
import { Container, Content } from '../../../components/Layout/Detail';
import { SubmitButton } from '../../../components/_Styled/Buttons';
import { Section } from '../../../components/_Styled/Views';
import PageHeader from 'components/PageHeader';

import AlertModal from 'components/Modals/AlertModal';
import ConfirmModal from 'components/Modals/ConfirmModal';

/** Services **/
import commonApi from '../../../services/apis/common';
import adminServiceApi from '../../../services/apis/adminService';

/** Hooks **/
import useAlertState from 'hooks/useAlertState';

/** Helpers **/
import { bindBy } from '../../../utils/fxts';

/** Assets **/
import { ReactComponent as IC_CHECK_MARK } from '../../../assets/icons/ic_check_mark.svg';


interface SelectedItems {
  [x: number]: string[];
}

interface DiseaseGroup {
  diseaseSeq: number;
  diseaseName: string;
  diseaseOptions: OptionItem[];
}

interface PageState {
  diseaseGroup: DiseaseGroup[];
  selectedItems: SelectedItems;
  serviceInfo: ServiceInfo | null;
}

function ApproveServicePage() {
  const navigate = useNavigate();
  const { serviceSeq } = useParams<{ serviceSeq: string }>();
  const [state, setState] = useState<PageState>({
    diseaseGroup: [],
    selectedItems: {},
    serviceInfo: null,
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

  const onReject = () => {
    if (serviceSeq === undefined || isNaN(Number(serviceSeq))) {
      onShowAlert('잘못된 접근입니다.', () => {
        navigate(-1);
      })
      return ;
    }

    const dto: DoctorServiceStatusDto = {
      status: 'REJECT',
      diseaseList: [],
    };

    adminServiceApi
      .updateAdminServiceStatus(serviceSeq, dto)
      .then(res => {
        if (res) {
          onShowAlert('거절되었습니다.', () => {
            navigate(-1);
          });
        }
      })
      .catch(err => {
        onShowAlert(err);
      });
  }

  const onSubmit = () => {
    if (serviceSeq === undefined || isNaN(Number(serviceSeq))) {
      onShowAlert('잘못된 접근입니다.', () => {
        navigate(-1);
      })
      return ;
    }

    const { selectedItems } = state;

    const diseaseList = pipe(
      selectedItems,
      entries,
      map(([k, v]) => v.map(d => ({
        diseaseSeq: k,
        diseaseDetailSeq: Number(d),
      }))),
      flat,
      toArray,
    );

    const dto: DoctorServiceStatusDto = {
      status: 'APPROVE',
      diseaseList,
    };

    adminServiceApi
      .updateAdminServiceStatus(serviceSeq, dto)
      .then(res => {
        if (res) {
          onShowAlert('승인되었습니다.', () => {
            navigate(-1);
          });
        }
      })
      .catch(err => {
        onShowAlert(err);
      });
  }

  const onToggleDiseaseItem = (gSeq: number, itemSeq: string) => {
    const { selectedItems } = state;

    const items = selectedItems[gSeq] || []

    if (items.includes(itemSeq)) {
      const newItems = items.filter(d => d !== itemSeq);
      changeState({
        selectedItems: {
          ...selectedItems,
          [gSeq]: newItems
        },
      });
    } else {
      changeState({
        selectedItems: {
          ...selectedItems,
          [gSeq]: [...items, itemSeq],
        },
      });
    }
  };

  const initData = (seq: string) => {
    adminServiceApi
      .getAdminServiceDetail(seq)
      .then((serviceInfo) => {
        return Promise.all([
          commonApi.fetchDiseaseList(),
          commonApi.fetchHospitalDiseaseList(serviceInfo.hospitalSeq),
          Promise.resolve(serviceInfo),
        ]).then(([diseaseList, hospitalDiseaseList, info]) => ({
          diseaseList,
          hospitalDiseaseList,
          serviceInfo: info,
        }));
      })
      .then(({ diseaseList, hospitalDiseaseList, serviceInfo }) => {
        const hospitalDiseaseGroup = pipe(
          hospitalDiseaseList,
          groupBy((d) => d.diseaseSeq),
        );

        const diseaseGroup: DiseaseGroup[] = diseaseList.map((d) => ({
          diseaseSeq: d.seq,
          diseaseName: d.name,
          diseaseOptions: (hospitalDiseaseGroup[d.seq] || []).map((k) => ({
            value: `${k.seq}`,
            label: k.name,
          })),
        }));

        changeState({
          diseaseGroup,
          serviceInfo,
        });
      })
      .catch((err) => {
        onShowAlert(err);
      });
  };

  useEffect(() => {
    if (serviceSeq === undefined || isNaN(Number(serviceSeq))) {
      onShowAlert('잘못된 접근입니다.1', () => {
        navigate(-1);
      })
      return ;
    }

    initData(serviceSeq);
  }, [serviceSeq]);

  const { diseaseGroup, selectedItems, serviceInfo } = state;
  const { alertFlag, alertTitle, confirmFlag, confirmTitle } = alertState

  return (
    <div>
      <PageHeader title={'치료정보 상세'} />
      <CardContainer>
        <Container>
          <Content>
            <Section>
              <Grid container rowSpacing={4}>
                <Fragment>
                  <Grid item xs={3}>
                    <Typography variant="subtitle1">신청자</Typography>
                  </Grid>
                  <Grid item xs={9}>
                    <TextInput
                      required
                      fullWidth
                      placeholder={''}
                      value={serviceInfo?.name || ''}
                      disabled
                      onChange={(e) => {}}
                    />
                  </Grid>
                </Fragment>
                {diseaseGroup.map(d => (
                  <Fragment key={d.diseaseSeq}>
                    <Grid item xs={3}>
                      <Typography variant="subtitle1">{d.diseaseName}</Typography>
                    </Grid>
                    <Grid item xs={9}>
                      {bindBy(2, d.diseaseOptions).map((g, idx) => (
                        <Box key={g.key} style={{ display: 'flex', gap: 20 }}>
                          {g.list.map(list => (
                            <div
                              key={list.value}
                              style={{
                                flex: 1,
                                position: 'relative',
                                marginTop: 8,
                              }}
                            >
                              {(selectedItems[d.diseaseSeq] || []).includes(list.value) && (
                                <div style={{ position: 'relative' }}>
                                  <CustomTextInputOn
                                    sx={{
                                      flex: 1,
                                      marginTop: 0,
                                      border: '1px solid #00A8A4',
                                      borderRadius: 2,
                                      width: '100%',
                                    }}
                                    value={list.label}
                                  />
                                  <div
                                    style={{
                                      position: 'absolute',
                                      top: 10,
                                      right: 10,
                                      width: 24,
                                      height: 24,
                                      borderRadius: 12,
                                      border: '1px solid #00A8A4',
                                      display: 'flex',
                                      alignItems: 'center',
                                      justifyContent: 'center',
                                      color: '#00A8A4',
                                    }}
                                  >
                                    <IC_CHECK_MARK />
                                  </div>
                                </div>
                              )}
                              {!(selectedItems[d.diseaseSeq] || []).includes(list.value) && (
                                <CustomTextInputOff
                                  sx={{
                                    marginTop: 0,
                                    border: '1px solid #D6D6DC',
                                    borderRadius: 2,
                                    width: '100%',
                                  }}
                                  value={list.label}
                                />
                              )}
                              <div
                                style={{
                                  position: 'absolute',
                                  top: 0,
                                  left: 0,
                                  width: '100%',
                                  height: '100%',
                                  cursor: 'pointer',
                                }}
                                onClick={() => onToggleDiseaseItem(d.diseaseSeq, list.value)}
                              />
                            </div>
                          ))}
                          {g.list.length === 1 && (
                            <div style={{ flex: 1 }} />
                          )}
                        </Box>
                      ))}
                    </Grid>
                  </Fragment>
                ))}
              </Grid>
            </Section>

            <Section>
              <Grid container rowSpacing={4}>
                <Grid item xs={5.5}>
                  <SubmitButton
                    onClick={() => {
                      onShowConfirm('거절 하시겠습니까?',  () => {
                        onReject();
                      });
                    }}
                    style={{ border: '1px solid red', backgroundColor: '#FFF', marginTop: 32 }}
                  >
                    <Typography variant="subtitle2" color="red">
                      거절
                    </Typography>
                  </SubmitButton>
                </Grid>
                <Grid item xs={1}/>
                <Grid item xs={5.5}>
                  <SubmitButton
                    onClick={() => {
                      onShowConfirm('승인 하시겠습니까?',  () => {
                        onSubmit();
                      });
                    }}
                    style={{ border: '1px solid #00AB55', backgroundColor: '#00AB55', marginTop: 32 }}
                  >
                    <Typography variant="subtitle2" color="white">
                      승인
                    </Typography>
                  </SubmitButton>
                </Grid>
              </Grid>
            </Section>
          </Content>
        </Container>
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

export default ApproveServicePage;

const CustomTextInputOn = styled(TextInput)`
  input {
    color: #00A8A4;
  }
`

const CustomTextInputOff = styled(TextInput)`
  input {
    color: #68667C;
  }
`
