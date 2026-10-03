class AppError extends Error {
  statusCode: number;

  constructor(message: string, statusCode = 400) {
    super(message);
    this.name = "AppError";
    this.statusCode = statusCode;
  }
}

const isAppError = (error: unknown): error is AppError => {
  return error instanceof AppError;
};

export { AppError, isAppError };
