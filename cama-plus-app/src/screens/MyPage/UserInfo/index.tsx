import React, { useState, Fragment } from 'react';
import {
  View,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  Modal,
  TextInput,
  ActivityIndicator,
} from 'react-native';

/** Types **/
import { MainNavigationScreenProps } from '@/navigations/MainNavigation';

/** Components **/
import LeftBackHeader from '@/components/Headers/LeftBackHeader';
import InfoRow from '@/screens/MyPage/UserInfo/InfoRow';
import ConfirmModal from '@/components/Modals/ConfirmModal';

/** Hooks **/
import {
  removeTokenEncryptedStorage,
  setTokenEncryptedStorage,
} from '@/storages/tokenStorage';
import { useSetAuthState } from '@/hooks/recoil/useAuthRecoilHooks';
import { useAccountState } from '@/hooks/recoil/useAccountMeRecoilState';

/** Styles **/
import {
  viewStyles,
  borderStyles,
  modalStyles,
} from '@/components/_StyleSheets';
import { Inter400Text, Inter700Text } from '@/components/Texts/InterText';

/** Services **/
import accountApi from '@/services/apis/account';
import patientAuthApi from '@/services/apis/patientAuth';

/** Helpers **/
import { showAlertMessage } from '@/utils/alertMessage';
import { defaultAccount } from '@/stores/accountMeState';
import {
  validateLoginId,
  validatePassword,
} from '@/utils/patientAuthValidation';
import { asciiTextInputProps } from '@/utils/textInputProps';

/** Assets **/
import IC_INDICATOR from '@/assets/icons/buttons/ic_indicator.svg';

type ConfirmType = 'WITHDRAW';

interface PageState {
  showConfirmModal: boolean;
  confirmType: ConfirmType;
  showChangeIdModal: boolean;
  newLoginId: string;
  password: string;
  changingId: boolean;
}

const UserInfoScreen: React.FC<MainNavigationScreenProps<'UserInfoScreen'>> = () => {
  const setAuthState = useSetAuthState();
  const [account, setAccountState] = useAccountState();
  const [state, setState] = useState<PageState>({
    showConfirmModal: false,
    confirmType: 'WITHDRAW',
    showChangeIdModal: false,
    newLoginId: '',
    password: '',
    changingId: false,
  });

  const changeState = (newState: Partial<PageState>) => {
    setState(prev => ({
      ...prev,
      ...newState,
    }));
  };

  const onLogout = () => {
    accountApi
      .resetFirebaseToken()
      .then(() => {
        removeTokenEncryptedStorage()
          .then(() => {
            setAuthState('loggedOut');
            setAccountState(defaultAccount);
          })
          .catch(err => console.log({ err }));
      })
      .catch(err => console.log({ err }));
  };

  const onWithdraw = () => {
    accountApi
      .withdrawalAccount()
      .then(res => {
        if (res) {
          changeState({ showConfirmModal: false });
          setTimeout(() => {
            onLogout();
          }, 500);
        }
      })
      .catch(err => {
        showAlertMessage({
          message: err,
        });
      });
  };

  const onChangeLoginId = async () => {
    const loginIdErr = validateLoginId(state.newLoginId);
    const passwordErr = validatePassword(state.password);
    if (loginIdErr || passwordErr) {
      showAlertMessage({ message: loginIdErr || passwordErr || '' });
      return;
    }

    const trimmed = state.newLoginId.trim();
    if (trimmed.toLowerCase() === account.loginId?.toLowerCase()) {
      showAlertMessage({ message: '현재 ID와 동일합니다.' });
      return;
    }

    changeState({ changingId: true });
    try {
      const availability = await patientAuthApi.checkLoginId({ loginId: trimmed });
      if (!availability.available) {
        showAlertMessage({ message: availability.message });
        return;
      }

      const resp = await accountApi.changeLoginId({
        newLoginId: trimmed,
        credentials: state.password,
      });

      await setTokenEncryptedStorage(resp.apiToken);
      setAccountState(resp.account);
      changeState({
        showChangeIdModal: false,
        newLoginId: '',
        password: '',
      });
      showAlertMessage({
        title: 'ID 변경 완료',
        message: resp.message || '로그인 ID가 변경되었습니다.',
      });
    } catch (err) {
      showAlertMessage({ message: String(err) });
    } finally {
      changeState({ changingId: false });
    }
  };

  const {
    showConfirmModal,
    confirmType,
    showChangeIdModal,
    newLoginId,
    password,
    changingId,
  } = state;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#FFF' }}>
      <LeftBackHeader title="" />
      <View style={styles.workView}>
        <View style={{ paddingVertical: 24, paddingHorizontal: 16 }}>
          <View style={[borderStyles.basicBorder, styles.sectionView]}>
            <InfoRow label={'아이디'} value={account.loginId || '-'} />
            <InfoRow label={'이름'} value={account.name} />
            <InfoRow label={'전화번호'} value={account.phone} />
            <InfoRow label={'생년월일'} value={account.birth} borderBottom={false} />
          </View>
          <View style={{ marginTop: 8 }}>
            <TouchableOpacity
              style={[
                borderStyles.basicBorder,
                styles.sectionView,
                viewStyles.rowAiCenterJcBetween,
                styles.buttonView,
              ]}
              onPress={() =>
                changeState({
                  showChangeIdModal: true,
                  newLoginId: '',
                  password: '',
                })
              }
            >
              <Inter400Text style={{ fontSize: 18, color: '#696969' }}>
                로그인 ID 변경
              </Inter400Text>
              <IC_INDICATOR />
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                borderStyles.basicBorder,
                styles.sectionView,
                viewStyles.rowAiCenterJcBetween,
                styles.buttonView,
              ]}
              onPress={onLogout}
            >
              <Inter400Text style={{ fontSize: 18, color: '#696969' }}>
                로그아웃
              </Inter400Text>
              <IC_INDICATOR />
            </TouchableOpacity>
          </View>
        </View>
        <TouchableOpacity
          style={[
            viewStyles.rowAiCenterJcCenter,
            styles.buttonView,
            {
              position: 'absolute',
              left: 16,
              right: 16,
              bottom: 24,
            },
          ]}
          onPress={() => {
            changeState({
              showConfirmModal: true,
              confirmType: 'WITHDRAW',
            });
          }}
        >
          <Inter400Text
            style={{
              fontSize: 18,
              color: '#696969',
              textDecorationLine: 'underline',
            }}
          >
            회원탈퇴
          </Inter400Text>
        </TouchableOpacity>
        <ConfirmModal
          showModal={showConfirmModal}
          cancelLabel={'아니오'}
          doneLabel={'예'}
          onPressDone={() => {
            if (confirmType === 'WITHDRAW') {
              onWithdraw();
            }
          }}
          onPressCancel={() => {
            if (confirmType === 'WITHDRAW') {
              changeState({ showConfirmModal: false });
            }
          }}
        >
          {confirmType === 'WITHDRAW' && (
            <Fragment>
              <Inter400Text style={modalStyles.msgLabel}>
                회원 탈퇴 시 계정 정보 및 진행중인 암정보 가이드 설정이 모두
                삭제되고 복구가 불가능합니다.
              </Inter400Text>
              <Inter400Text style={[modalStyles.msgLabel]}>
                정말 회원 탈퇴 하시겠습니까?
              </Inter400Text>
            </Fragment>
          )}
        </ConfirmModal>
      </View>
      <Modal visible={showChangeIdModal} transparent animationType="fade">
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <Inter700Text style={styles.modalTitle}>로그인 ID 변경</Inter700Text>
            <Inter400Text style={styles.modalDesc}>
              현재 ID: {account.loginId}
            </Inter400Text>
            <TextInput
              style={styles.input}
              placeholder="새 로그인 ID (영문/숫자 4~20자)"
              value={newLoginId}
              onChangeText={v => changeState({ newLoginId: v })}
              autoCapitalize="none"
              autoCorrect={false}
              {...asciiTextInputProps}
            />
            <TextInput
              style={styles.input}
              placeholder="현재 비밀번호"
              value={password}
              onChangeText={v => changeState({ password: v })}
              secureTextEntry
              autoCapitalize="none"
              {...asciiTextInputProps}
            />
            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.modalBtn}
                onPress={() => changeState({ showChangeIdModal: false })}
                disabled={changingId}
              >
                <Inter400Text>취소</Inter400Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalBtn, styles.modalBtnPrimary]}
                onPress={onChangeLoginId}
                disabled={changingId}
              >
                {changingId ? (
                  <ActivityIndicator color="#FFF" />
                ) : (
                  <Inter700Text style={{ color: '#FFF' }}>변경</Inter700Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      <View style={styles.bizView}>
        <Inter400Text style={{ fontSize: 11, color: '#696969' }}>
          (주) 휴딧
        </Inter400Text>
        <Inter400Text style={{ fontSize: 11, color: '#696969' }}>
          대표 : 한덕현 | 사업자번호 : 368-86-03038
        </Inter400Text>
        <Inter400Text style={{ fontSize: 11, color: '#696969' }}>
          주소 : 서울특별시 동작구 흑석로 109. 3층 | 02-6299-3877
        </Inter400Text>
      </View>
    </SafeAreaView>
  );
};

export default UserInfoScreen;

const styles = StyleSheet.create({
  sectionView: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  buttonView: {
    paddingVertical: 16,
  },
  workView: {
    flex: 15,
  },
  bizView: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 10,
    paddingBottom: 20,
    backgroundColor: '#EAEAEA',
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'center',
    padding: 24,
  },
  modalCard: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 20,
  },
  modalTitle: {
    fontSize: 20,
    marginBottom: 8,
  },
  modalDesc: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#E5E8EB',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    marginBottom: 12,
    fontSize: 16,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
    marginTop: 8,
  },
  modalBtn: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    minWidth: 72,
    alignItems: 'center',
  },
  modalBtnPrimary: {
    backgroundColor: '#ED7101',
  },
});
