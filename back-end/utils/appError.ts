class AppError extends Error {
  statusCode: number;
  statusText: string;

  constructor(message?: string, statusCode?: number, statusText?: string) {
    super();
    this.message = message || "server error";
    this.statusCode = statusCode || 500;
    this.statusText = statusText || "server error";
  }

  create(message?: string, statusCode?: number, statusText?: string) {
    this.message = message || "server error";
    this.statusCode = statusCode || 500;
    this.statusText = statusText || "server error";
    return this;
  }
}

export default new AppError();
