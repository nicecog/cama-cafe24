import { atom } from "jotai";

export const paramsAtom = atom({
  stDt: "",
  edDt: "",
});
export const resultAtom = atom([]);

export const chartInfoAtom = atom(
  (get) => {
    const searchParam = get(paramsAtom);
    const list = get(resultAtom);

    return {
      searchParam,
      list,
    };
  },
  (_, set, update: any) => {
    set(paramsAtom, update?.params);
    set(resultAtom, update?.result);
  }
);

// export const selectedMonthAtom = atom((get) => {
//   const { stDt, edDt } = get(paramsAtom);

//   if (!stDt || !edDt) return [];
//   const start = dayjs(stDt),
//     end = dayjs(edDt);
//   if (start.isAfter(end)) return [];

//   return Array.from({ length: end.diff(start, "month") + 1 }, (_, i) =>
//     start.add(i, "month").format("M월")
//   );
// });
