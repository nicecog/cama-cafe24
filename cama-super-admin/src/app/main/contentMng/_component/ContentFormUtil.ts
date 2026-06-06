interface DiseaseOption {
  seq: number;
  groupName: string;
  optionName: string;
}

interface GroupedData {
  groupName: string;
  options: {
    seq: number;
    groupName: string;
    optionName: string;
    label: string;
    value: number;
  }[];
}

export const groupDiseaseOptions = (
  diseaseOptions: DiseaseOption[]
): GroupedData[] => {
  return diseaseOptions.reduce(
    (acc: GroupedData[], { seq, groupName, optionName }) => {
      const groupIndex = acc.findIndex(
        (group) => group.groupName === groupName
      );
      if (groupIndex === -1) {
        acc.push({
          groupName,
          options: [
            { seq, groupName, optionName, label: optionName, value: seq },
          ],
        });
      } else {
        acc[groupIndex].options.push({
          seq,
          groupName,
          optionName,
          label: optionName,
          value: seq,
        });
      }
      return acc;
    },
    []
  );
};

export const getOptDatas = (dataRow: any) => {
  return {
    ...dataRow,
    ...(dataRow
      ? {
          ...dataRow,
          groupedData: groupDiseaseOptions(dataRow.diseaseOption),
        }
      : {}), // _selectedOpt가 undefined인 경우 빈 객체로 처리
  };
};
