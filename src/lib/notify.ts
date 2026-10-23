export type NotificationVariant = "success" | "error";

export type NotificationItem = {
  id: string;
  title: string;
  description?: string;
  variant: NotificationVariant;
};

type NotifyOptions = {
  id?: string;
  description?: string;
};

type Listener = (items: NotificationItem[]) => void;

const AUTO_DISMISS_MS = 5000;

let items: NotificationItem[] = [];
const listeners = new Set<Listener>();
const dismissTimers = new Map<string, ReturnType<typeof setTimeout>>();

function emit() {
  listeners.forEach((listener) => listener(items));
}

function scheduleDismiss(id: string) {
  const existing = dismissTimers.get(id);
  if (existing) clearTimeout(existing);
  dismissTimers.set(
    id,
    setTimeout(() => {
      dismiss(id);
    }, AUTO_DISMISS_MS),
  );
}

export function subscribeNotifications(listener: Listener) {
  listeners.add(listener);
  listener(items);
  return () => {
    listeners.delete(listener);
  };
}

export function dismissNotification(id: string) {
  dismiss(id);
}

function dismiss(id: string) {
  const timer = dismissTimers.get(id);
  if (timer) {
    clearTimeout(timer);
    dismissTimers.delete(id);
  }
  const next = items.filter((item) => item.id !== id);
  if (next.length === items.length) return;
  items = next;
  emit();
}

function push(variant: NotificationVariant, title: string, options?: NotifyOptions) {
  const id = options?.id ?? crypto.randomUUID();
  items = [
    ...items.filter((item) => item.id !== id),
    {
      id,
      title,
      description: options?.description,
      variant,
    },
  ];
  emit();
  scheduleDismiss(id);
}

export const notify = {
  success(title: string, options?: NotifyOptions) {
    push("success", title, options);
  },
  error(title: string, options?: NotifyOptions) {
    push("error", title, options);
  },
};
