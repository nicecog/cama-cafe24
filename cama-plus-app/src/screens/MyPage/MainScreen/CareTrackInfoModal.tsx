import React, { Fragment, ReactNode } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  View,
  TouchableOpacity,
  ScrollView,
} from 'react-native';

/** Types **/
import { CareTrackAppliedInfo } from '@/services/apis/careTrack/response';
import { DiseaseInfo } from '@/services/apis/careTrack/request';

/** Components **/
import ModalScrollable from '@/components/Modals/ModalScrollable';

/** Styles **/
import { Inter400Text, Inter700Text } from '@/components/Texts/InterText';
import { viewStyles, gaugeStyles } from '@/components/_StyleSheets';

/** Utils **/
import { dateDotFormatted } from '@/utils/dayjs';

/** Assets **/
import IC_MODAL_CLOSE from '@/assets/icons/buttons/ic_modal_close.svg';

interface Props {
  showModal: boolean;
  careTrackAppliedInfo: CareTrackAppliedInfo | null;
  onStopCareTrack: () => void;
  onCloseModal: () => void;
  children: ReactNode;
}

interface SectionProps {
  title: string;
  infos: string[];
}

const CancerSectionView: React.FC<SectionProps> = ({ title, infos }) => {
  return (
    <Fragment>
      <Inter400Text style={{ color: '#7E7E7E', fontSize: 18, marginTop: 16 }}>
        {title}
      </Inter400Text>
      <View style={[viewStyles.rowAiCenter, { flexWrap: 'wrap' }]}>
        {infos.map(d => (
          <View key={d} style={styles.labelView}>
            <Inter400Text style={{ color: '#ED7101', fontSize: 14 }}>
              {d}
            </Inter400Text>
          </View>
        ))}
      </View>
    </Fragment>
  );
};

const CareTrackInfoModal: React.FC<Props> = ({
  showModal,
  careTrackAppliedInfo,
  onStopCareTrack,
  onCloseModal,
  children,
}) => {
  const percent = careTrackAppliedInfo?.process || 0;
  const days = careTrackAppliedInfo === null ? '' : careTrackAppliedInfo.days;
  const interest = JSON.parse(
    careTrackAppliedInfo?.interest || '[]',
  ) as string[];
  const trackCreatedAt =
    careTrackAppliedInfo === null ? '' : careTrackAppliedInfo.trackCreatedAt;

  const diseaseInfo = JSON.parse(
    careTrackAppliedInfo?.disease || '{}',
  ) as DiseaseInfo;
  const { diseaseOption, diseaseTreatment } = diseaseInfo;

  return (
    <ModalScrollable modalFlag={showModal} onCloseModal={onCloseModal}>
      <SafeAreaView style={styles.modalSafeArea}>
        <View style={styles.modalWrap}>
          <TouchableOpacity onPress={onCloseModal} style={styles.closeBtn}>
            <IC_MODAL_CLOSE />
          </TouchableOpacity>
          <View style={styles.headerView}>
            <Inter700Text style={{ color: '#FFF', fontSize: 18 }}>
              {careTrackAppliedInfo?.diseaseName || ''}
            </Inter700Text>
          </View>
          <View style={styles.bodyView}>
            <View style={{ height: 400 }}>
              <ScrollView
                showsHorizontalScrollIndicator={false}
                showsVerticalScrollIndicator={true}
              >
                <CancerSectionView
                  title={'암정보 가이드 진행일자'}
                  infos={[`${days}일`]}
                />
                <CancerSectionView
                  title={'암 치료 시기'}
                  infos={(diseaseTreatment || []).map(d => d.name)}
                />
                {(diseaseOption || []).map(d => (
                  <CancerSectionView
                    key={d.seq}
                    title={d.groupName}
                    infos={[d.optionName]}
                  />
                ))}
                <CancerSectionView title={'관심영역'} infos={interest} />
              </ScrollView>
            </View>
            <View style={{ marginTop: 16 }}>
              <View style={viewStyles.rowAiEndJcBetween}>
                <Inter400Text style={{ color: '#7E7E7E', fontSize: 12 }}>
                  시작일 : {dateDotFormatted(trackCreatedAt)}
                </Inter400Text>
                <Inter700Text style={{ color: '#ED7101', fontSize: 20 }}>
                  {percent === 0 ? 0 : percent.toFixed(1)}%
                </Inter700Text>
              </View>
              <View style={[gaugeStyles.gaugeView, { marginTop: 4 }]}>
                <View
                  style={[
                    gaugeStyles.gaugeFilledView,
                    { width: `${percent.toFixed(1)}%` },
                  ]}
                />
              </View>
            </View>
            <TouchableOpacity
              onPress={onStopCareTrack}
              style={{ paddingTop: 16 }}
            >
              <Inter700Text
                style={{
                  color: '#B6BDC3',
                  fontSize: 18,
                  textAlign: 'center',
                  textDecorationLine: 'underline',
                }}
              >
                암정보 가이드 중단
              </Inter700Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
      {children}
    </ModalScrollable>
  );
};

export default CareTrackInfoModal;

const styles = StyleSheet.create({
  modalSafeArea: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalWrap: {
    backgroundColor: '#fff',
    width: '80%',
    borderRadius: 8,
  },
  headerView: {
    padding: 16,
    backgroundColor: '#ED7101',
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  bodyView: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 24,
  },
  labelView: {
    paddingHorizontal: 16,
    paddingVertical: 4,
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#ED7101',
    borderRadius: 21,
    marginTop: 8,
    marginRight: 4,
  },
  closeBtn: {
    position: 'absolute',
    top: -48,
    right: 0,
  },
});
