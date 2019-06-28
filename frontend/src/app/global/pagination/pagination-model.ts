export class Pagination <T> {
  from: number;
  to: number;
  per_page: number;
  total: number;
  current_page: number;
  last_page: number;
  data: T;
}
