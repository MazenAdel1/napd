import axios from "@/lib/axios";
import type { markNotsProps } from "./types";

export const markNotificationsAsRead = async ({
  setNotifications,
  setNotsCount,
  page,
}: markNotsProps) => {
  const { notifications, notReadCount } = (
    await axios.patch(`/notifications/mark-as-read?page=${page}`, {
      withCredentials: true,
    })
  ).data.data;
  setNotifications(notifications);
  setNotsCount(notReadCount);
};
