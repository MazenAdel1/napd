import { ArrowLeft, ArrowRight, Bell, Eye, Loader2Icon } from "lucide-react";
import { Button } from "../../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "../../ui/dropdown-menu";
import { useEffect, useRef, useState } from "react";
import { socket } from "@/lib/consts";
import axios from "@/lib/axios";
import { Item, ItemContent, ItemTitle } from "../../ui/item";
import { markNotificationsAsRead } from "./utils";
import { NOTIFICATION_MESSAGES } from "./consts";
import type { NotificationProps } from "./types";
import notificationSound from "/notification-sound.mp3";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export default function Notifications() {
  const [isLoading, setIsLoading] = useState(false);
  const [notifications, setNotifications] = useState<NotificationProps[]>([]);
  const [notsCount, setNotsCount] = useState(0);
  const [page, setPage] = useState(1);
  const totalPages = useRef(1);

  const audioRef = useRef(new Audio(notificationSound));

  useEffect(() => {
    (async () => {
      setIsLoading(true);
      const {
        notifications,
        notReadCount,
        totalPages: total,
      } = (
        await axios.get(`/notifications?page=${page}`, {
          withCredentials: true,
        })
      ).data.data;
      setNotifications(notifications);
      setNotsCount(notReadCount);
      totalPages.current = total;
      setIsLoading(false);
    })();
  }, [page]);

  useEffect(() => {
    const audioCurrent = audioRef.current;

    socket.on("notification", (notification: NotificationProps) => {
      audioCurrent.play();
      setNotifications((prev) => [notification, ...prev.slice(0, 9)]);
      setNotsCount((prev) => prev + 1);
    });

    return () => {
      socket.off("notification");
      audioCurrent.pause();
      audioCurrent.currentTime = 0;
    };
  }, []);

  useEffect(() => {
    document.title =
      notsCount > 0 ? `نظام نبض (${notsCount})` : document.title.split(" (")[0];
  }, [notsCount]);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant={"outline"} className="fixed top-1 left-4 z-50">
          {notsCount > 0 && (
            <span className="absolute -top-0.5 -left-0.5 flex size-4 items-center justify-center rounded-full bg-blue-500 text-xs text-white">
              {notsCount}
            </span>
          )}
          <Bell />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="ml-4 w-80">
        <DropdownMenuLabel className="flex items-center justify-between">
          الإشعارات{" "}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant={"ghost"}
                onClick={() =>
                  notsCount > 0 &&
                  markNotificationsAsRead({
                    setNotifications,
                    setNotsCount,
                    page,
                  })
                }
              >
                <Eye className="size-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>تمييز كل الإشعارات كمقروءة</p>
            </TooltipContent>
          </Tooltip>
        </DropdownMenuLabel>
        <div className="flex max-h-64 flex-col gap-1 overflow-y-auto">
          {isLoading ? (
            <Loader2Icon className="mx-auto size-5 animate-spin" />
          ) : notifications.length > 0 ? (
            notifications?.map((notification, index) => (
              <Item
                key={index}
                variant={notification.isRead ? "default" : "muted"}
              >
                <ItemContent className="flex flex-col">
                  <div className="flex items-center justify-between">
                    <div>
                      <ItemTitle>
                        {notification.user.name}{" "}
                        {NOTIFICATION_MESSAGES[notification.type]}{" "}
                      </ItemTitle>
                      <span className="flex items-center gap-5 text-xs text-gray-600">
                        {new Date(notification.createdAt).toLocaleTimeString(
                          "ar-EG",
                        )}
                      </span>
                    </div>
                    <span className="flex items-center gap-5 text-xs text-gray-600">
                      {new Date(notification.createdAt).toLocaleDateString(
                        "ar-EG",
                      )}
                    </span>
                  </div>
                </ItemContent>
              </Item>
            ))
          ) : (
            <Item variant={"outline"}>
              <ItemContent className="text-center">لا توجد إشعارات</ItemContent>
            </Item>
          )}
        </div>
        {totalPages.current > 1 && (
          <div className="flex justify-center p-2">
            <Button
              variant={"outline"}
              onClick={() => setPage((prev) => prev - 1)}
              disabled={page === 1}
            >
              <ArrowRight />
            </Button>
            <span className="flex items-center justify-center px-4">
              {page}
            </span>
            <Button
              variant={"outline"}
              onClick={() => setPage((prev) => prev + 1)}
              disabled={page === totalPages.current}
            >
              <ArrowLeft />
            </Button>
          </div>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
