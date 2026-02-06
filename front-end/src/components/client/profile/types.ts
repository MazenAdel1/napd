import type z from "zod";
import type { EDIT_PROFILE_SCHEMA } from "./consts";

export type EditProfileFormSchema = z.infer<typeof EDIT_PROFILE_SCHEMA>;

export type InfoItemProps = {
  icon: React.ReactNode;
  label: string;
  value: React.ReactNode;
};

export type SectionCardProps = {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
};
