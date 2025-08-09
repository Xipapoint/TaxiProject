import { BaseResponse } from './base-response';
export type ApiResponse<T> = {
  success: boolean;
  data: T;
  message?: string;
}