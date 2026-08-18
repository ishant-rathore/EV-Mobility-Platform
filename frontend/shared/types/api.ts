export interface ApiError {
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
}
