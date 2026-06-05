import { StyleSheet } from 'react-native';

export const viewStyles = StyleSheet.create({
  rowAiCenter: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rowAiStart: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  rowAiCenterJcBetween: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  rowAiEndJcBetween: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  rowAiCenterJcCenter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowAiCenterJcEnd: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  columnJcBetween: {
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  columnAiCenterJcCenter: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  columnAiCenter: {
    flexDirection: 'column',
    alignItems: 'center',
  },
  columnAiCenterJcBetween: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});

export const borderStyles = StyleSheet.create({
  basicBorder: {
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#D3D3D3',
    borderRadius: 8,
  },
  buttonBorder: {
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#ED7101',
  },
  borderLB: {
    borderStyle: 'solid',
    borderLeftWidth: 1,
    borderBottomWidth: 1,
    borderLeftColor: '#D3D3D3',
    borderBottomColor: '#D3D3D3',
  },
  borderB: {
    borderStyle: 'solid',
    borderBottomWidth: 1,
    borderBottomColor: '#D3D3D3',
  },
  borderB2: {
    borderStyle: 'solid',
    borderBottomWidth: 1,
    borderBottomColor: '#D3D3D3',
  },
  borderLR: {
    borderStyle: 'solid',
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderLeftColor: '#D3D3D3',
    borderRightColor: '#D3D3D3',
  },
});

export const barStyles = StyleSheet.create({
  basicTextBar: {
    width: 1,
    height: 8,
    backgroundColor: '#CCC',
    marginHorizontal: 8,
  },
});

export const gaugeStyles = StyleSheet.create({
  gaugeView: {
    width: '100%',
    height: 16,
    borderRadius: 18,
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#EEEEEE',
    backgroundColor: '#FFFFFF',
  },
  gaugeFilledView: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '0%',
    height: 14,
    borderRadius: 18,
    backgroundColor: '#FE8825',
  },
});

export const modalStyles = StyleSheet.create({
  msgLabel: {
    fontSize: 20,
    color: '#000',
    textAlign: 'center',
    paddingBottom: 40,
  },
});
