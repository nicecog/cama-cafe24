export const paginatedIndex = (page: number, index: number) => {
  return ((page - 1) * 10) + (index + 1);
}

export const isNullable = (value: any) => {
  return value === null || value === undefined;
}
