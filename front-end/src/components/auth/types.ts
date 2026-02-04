import type z from "zod";
import type { LOGIN_SCHEMA, REGISTER_SCHEMA } from "./consts";

export type RegisterFormSchema = z.infer<typeof REGISTER_SCHEMA>;

export type LoginFormSchema = z.infer<typeof LOGIN_SCHEMA>;
