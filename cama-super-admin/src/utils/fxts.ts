import { v4 as uuidv4 } from 'uuid';

export interface BindBy<T> {
  key: string;
  list: T[];
}

export function bindBy<T>(cnt: number, iter: T[]) {
  let res: BindBy<T>[] = [];

  let tmp: BindBy<T> = {
    key: `${uuidv4()}`,
    list: [],
  };
  for (const a of iter) {
    tmp.list.push(a);
    if (tmp.list.length === cnt) {
      res.push(tmp);
      tmp = {
        key: `${uuidv4()}`,
        list: [],
      };
    }
  }
  if (tmp.list.length > 0) {
    res.push(tmp);
  }
  return res;
}
