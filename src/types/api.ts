export type ApiError = {
  error?: string;
  detail?: string;
};

export type ApiResult<T> = T | ApiError;
