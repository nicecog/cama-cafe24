import { useMemo } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";



//  CodeGroupIds 를 배열 형태로 넘기면 배열 형태로 return 
//  ["0002", "0003"]

export const useCodeList = (codeGroupIds: string[]) => {
  //  코드 리스트
  const codeList = useSelector((state: RootState) => state.COMMON.codeList);

  const filteredOptions = useMemo(() => {
    const optionsByGroup: any[] = [];

    // 각 코드 그룹 ID에 해당하는 옵션 배열 생성 및 순서대로 저장 label, value 는 자동생성
    codeGroupIds.forEach((groupId) => {
      const options = codeList
        .filter((item: any) => item.cdGrpId === groupId)
        .map((item) => ({ label: item.cdNm, value: item.cdId, ...item }));
      optionsByGroup.push(options);
    });

    return optionsByGroup;
  }, [codeList, codeGroupIds]);

  return filteredOptions;
};
