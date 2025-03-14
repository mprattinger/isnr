export interface ProfidApiBaseResponseModel<T> {
  status: string;
  data: T;
  errmsg: string;
}
