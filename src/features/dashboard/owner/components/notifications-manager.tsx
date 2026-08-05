"use client";

import React, { useState } from "react";
import { Bell, CheckCheck, Circle, ExternalLink, ShieldCheck, Mail, AlertCircle, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { markNotificationAsRead, markAllNotificationsAsRead } from "@/server/actions/notifications";
import { toast } from "sonner";

interface NotificationItem {
  id: string;
  type: string;
  title: string;
  message: string;
  link: string | null;
  read: boolean;
  createdAt: Date;
}

interface NotificationsManagerProps {
  notifications: NotificationItem[];
  unreadCount: number;
}

export function NotificationsManager({
  notifications: initialNotifications,
  unreadCount: initialUnreadCount,
}: NotificationsManagerProps) {
  const [notificationsList, setNotificationsList] = useState<NotificationItem[]>(initialNotifications);
  const [unreadCount, setUnreadCount] = useState<number>(initialUnreadCount);

  const handleMarkAsRead = async (id: string) => {
    try {
      const res = await markNotificationAsRead(id);
      if (res.success) {
        setNotificationsList((prev) =>
          prev.map((n) => (n.id === id ? { ...n, read: true } : n))
        );
        setUnreadCount((prev) => Math.max(0, prev - 1));
      }
    } catch {
      toast.error("Failed to update notification");
    }
  };

  const handleMarkAllRead = async () => {
    try {
      const res = await markAllNotificationsAsRead();
      if (res.success) {
        setNotificationsList((prev) => prev.map((n) => ({ ...n, read: true })));
        setUnreadCount(0);
        toast.success("All notifications marked as read");
      }
    } catch {
      toast.error("Failed to mark all as read");
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case "business_approved":
        return <ShieldCheck className="w-4 h-4 text-emerald-500" />;
      case "business_rejected":
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      case "lead_received":
        return <Mail className="w-4 h-4 text-blue-500" />;
      default:
        return <Info className="w-4 h-4 text-slate-400" />;
    }
  };

  return (
    <Card className="rounded-2xl border-border/60 shadow-sm p-6 space-y-4">
      <div className="flex items-center justify-between border-b border-border/40 pb-3">
        <div className="flex items-center gap-2">
          <Bell className="w-5 h-5 text-muted-foreground" />
          <h3 className="text-lg font-bold">Notifications</h3>
          {unreadCount > 0 && (
            <Badge className="bg-red-500 text-white font-extrabold text-xs px-2 py-0.5 rounded-full">
              {unreadCount} New
            </Badge>
          )}
        </div>

        {unreadCount > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleMarkAllRead}
            className="text-xs font-semibold text-muted-foreground hover:text-foreground h-8 gap-1"
          >
            <CheckCheck className="w-3.5 h-3.5" /> Mark all read
          </Button>
        )}
      </div>

      {notificationsList.length === 0 ? (
        <div className="py-8 text-center text-xs text-muted-foreground">
          No notifications recorded yet.
        </div>
      ) : (
        <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
          {notificationsList.map((item) => (
            <div
              key={item.id}
              onClick={() => {
                if (!item.read) handleMarkAsRead(item.id);
              }}
              className={`p-3.5 rounded-xl border transition-all flex items-start justify-between gap-3 ${
                !item.read
                  ? "border-blue-200 dark:border-blue-900/50 bg-blue-50/40 dark:bg-blue-950/20"
                  : "border-border/40 bg-card hover:bg-slate-50/50"
              }`}
            >
              <div className="flex items-start gap-3 min-w-0">
                <div className="mt-0.5 shrink-0">{getIcon(item.type)}</div>
                <div className="space-y-0.5 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className={`text-xs ${!item.read ? "font-bold text-foreground" : "font-medium text-muted-foreground"}`}>
                      {item.title}
                    </p>
                    {!item.read && <Circle className="w-2 h-2 fill-blue-500 text-blue-500 shrink-0" />}
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-snug">{item.message}</p>
                  <p className="text-[10px] text-muted-foreground">{new Date(item.createdAt).toLocaleDateString()}</p>
                </div>
              </div>

              {item.link && (
                <a href={item.link} className="shrink-0 text-muted-foreground hover:text-foreground p-1">
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}
