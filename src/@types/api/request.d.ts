export type IRequestResult<T> = IRequestSuccess<T> | IRequestError;

export type IRequestSuccess<T> = {
  statusCode: 200 | 201;
  data: T;
};

export type IRequestError = {
  statusCode: 400 | 401 | 403 | 404 | 500;
  errorCode: string;
  message: string;
  detail?: unknown;
};
