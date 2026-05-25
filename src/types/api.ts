export type ApiResult<T> =
  | { ok: true; data: T }
  | { ok: false; error: string };

export type PaginatedResult<T> = {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
};
