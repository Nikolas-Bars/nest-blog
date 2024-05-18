export type PaginationType<I> = {
  pagesCount: number,
  page: number,
  pageSize: number,
  totalCount: number,
  items: I[]
}

export type DeleteResult = {
  acknowledged: boolean;
  deletedCount: number;
}