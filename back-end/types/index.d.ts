import type { User } from "../prisma/generated/prisma/client";
import {
  JwtPayload,
  type DecodeOptions,
  type Secret,
  type VerifyOptions,
} from "jsonwebtoken";

export type CustomJwtPayload = JwtPayload & User;

declare module "jsonwebtoken" {
  export function verify(
    token: string,
    secretOrPublicKey: Secret,
    options?: VerifyOptions,
  ): CustomJwtPayload;
  export function decode(
    token: string,
    options?: DecodeOptions,
  ): CustomJwtPayload | null;
}

declare global {
  namespace Express {
    interface Request {
      currentUser: CustomJwtPayload;
    }
  }

  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: "development" | "production" | "test";
      DATABASE_URL: string;
      JWT_SECRET: string;
      PORT: number;
    }
  }

  namespace SocketIO {
    interface Socket {
      user?: User;
    }
  }

  namespace Jwt {
    interface JwtPayload extends User {}
    export function verify(
      token: string,
      secretOrPublicKey: Secret,
      options?: VerifyOptions,
    ): CustomJwtPayload;
    export function decode(
      token: string,
      options?: DecodeOptions,
    ): CustomJwtPayload | null;
  }
}

export {};
