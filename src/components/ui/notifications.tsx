"use client";

import { useEffect, useState } from "react";
import { CircleCheck, CircleX, X } from "lucide-react";
import { cn } from "cn";
import {
  dismissNotification,
  subscribeNotifications,
  type NotificationItem,
} from "@/lib/notify";

function NotificationPanel({
  item,
  onDismiss,
}: {
  item: NotificationItem;
  onDismiss: (id: string) => void;
}) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const frame = requestAnimationFrame(() => setVisible(true));
    return () => cancelAnimationFrame(frame);
  }, []);

  const close = () => {
    setVisible(false);
    window.setTimeout(() => onDismiss(item.id), 150);
  };

  const Icon = item.variant === "success" ? CircleCheck : CircleX;
  const iconClass =
    item.variant === "success" ? "text-emerald-500" : "text-red-500";

  return (
    <div
      className={cn(
        "dashboard-notification-panel pointer-events-auto w-full max-w-sm rounded-lg bg-white shadow-lg outline outline-black/5 transition duration-300 ease-out dark:bg-neutral-900 dark:outline-white/10",
        visible
          ? "translate-x-0 translate-y-0 opacity-100"
          : "translate-y-2 opacity-0 sm:translate-x-2 sm:translate-y-0",
      )}
      role="status"
    >
      <div className="p-4">
        <div className="flex items-start gap-3">
          <Icon aria-hidden className={cn("size-6 shrink-0", iconClass)} />
          <div className="min-w-0 flex-1 pt-0.5">
            <p className="text-sm font-medium text-neutral-900 dark:text-white">
              {item.title}
            </p>
            {item.description ? (
              <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
                {item.description}
              </p>
            ) : null}
          </div>
          <button
            type="button"
            className="inline-flex shrink-0 rounded-md text-neutral-400 hover:text-neutral-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-brand)] dark:hover:text-white"
            onClick={close}
          >
            <span className="sr-only">Cerrar</span>
            <X aria-hidden className="size-5" />
          </button>
        </div>
      </div>
    </div>
  );
}

export function NotificationViewport() {
  const [items, setItems] = useState<NotificationItem[]>([]);

  useEffect(() => {
    return subscribeNotifications(setItems);
  }, []);

  if (!items.length) return null;

  return (
    <div
      aria-live="assertive"
      className="pointer-events-none fixed inset-0 z-[100] flex items-end px-4 py-6 sm:items-start sm:p-6"
    >
      <div className="flex w-full flex-col items-center gap-4 sm:items-end">
        {items.map((item) => (
          <NotificationPanel
            key={item.id}
            item={item}
            onDismiss={dismissNotification}
          />
        ))}
      </div>
    </div>
  );
}
