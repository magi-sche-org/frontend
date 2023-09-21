export type IRequestResult<T> =
  | {
      statusCode: 200 | 201;
      data: T;
    }
  | {
      statusCode: 400 | 401 | 403 | 404 | 500;
      errorCode: string;
      message: string;
      detail?: unknown;
    };
