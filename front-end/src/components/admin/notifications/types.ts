import type { User } from "@/types";

export type markNotsProps = {
  setNotifications: React.Dispatch<React.SetStateAction<NotificationProps[]>>;
  setNotsCount: React.Dispatch<React.SetStateAction<number>>;
  page: number;
};

export type NotificationType =
  | "CLIENT_REGISTERED"
  | "APPOINTMENT_BOOKED"
  | "APPOINTMENT_CANCELLED";

export type NotificationProps = {
  id: number;
  type: NotificationType;
  message: string;
  isRead: boolean;
  createdAt: string;
  user: User;
};
