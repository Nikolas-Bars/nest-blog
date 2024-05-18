export type QueryUserDataType = {
  pageNumber: number
  pageSize: number
  searchLoginTerm?: string | null
  searchEmailTerm?: string | null
  sortBy: string
  sortDirection: string
}