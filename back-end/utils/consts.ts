export const httpStatus = {
  SUCCESS: { code: 200, message: "success" },
  BAD_REQUEST: { code: 400, message: "bad request" },
  UNAUTHORIZED: { code: 401, message: "unauthorized" },
  FORBIDDEN: { code: 403, message: "forbidden" },
  NOT_FOUND: { code: 404, message: "not found" },
  SERVER_ERROR: { code: 500, message: "server error" },
} as const;

export const roles = {
  ADMIN: "ADMIN",
  CLIENT: "CLIENT",
} as const;
