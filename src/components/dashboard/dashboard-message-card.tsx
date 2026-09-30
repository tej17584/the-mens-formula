"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  deleteContactMessageAction,
  markContactReadAction,
} from "@/actions/dashboard-contact";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { useTranslations } from "@/i18n";

type Message = {
  id: string;
  name: string;
  contact: string;
  message: string;
  status: string;
  created_at: string;
  product: { name: string; slug: string } | null;
};

export function DashboardMessageCard({ message }: { message: Message }) {
  const t = useTranslations();
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const isNew = message.status === "new";
  const contactHref = message.contact.includes("@")
    ? `mailto:${message.contact}`
    : `tel:${message.contact}`;

  const markRead = () =>
    startTransition(async () => {
      await markContactReadAction(message.id);
      router.refresh();
    });

  const remove = () =>
    startTransition(async () => {
      const result = await deleteContactMessageAction(message.id);
      if (result?.error) toast.error(t("dashboard.messageDeleteFailed"));
      else {
        setConfirmOpen(false);
        toast.success(t("dashboard.messageDeleted"), {
          id: `message-deleted-${message.id}`,
        });
        router.refresh();
      }
    });

  return (
    <>
      <article
        className={
          isNew ? "dashboard-ticket is-new" : "dashboard-ticket"
        }
      >
        <header className="dashboard-ticket-head">
          <div>
            <p className="dashboard-ticket-label">{t("dashboard.fromPerson")}</p>
            <strong>{message.name}</strong>
          </div>
          <span
            className={
              isNew
                ? "dashboard-inbox-status is-new"
                : "dashboard-inbox-status"
            }
          >
            {isNew ? t("dashboard.new") : t("dashboard.read")}
          </span>
        </header>
        <dl className="dashboard-ticket-facts">
          <div>
            <dt>{t("contact.contact")}</dt>
            <dd>
              <a href={contactHref}>{message.contact}</a>
            </dd>
          </div>
          <div>
            <dt>{t("dashboard.received")}</dt>
            <dd>
              <time dateTime={message.created_at}>
                {new Intl.DateTimeFormat("es-GT", {
                  dateStyle: "medium",
                  timeStyle: "short",
                }).format(new Date(message.created_at))}
              </time>
            </dd>
          </div>
          {message.product ? (
            <div>
              <dt>{t("dashboard.relatedProduct")}</dt>
              <dd>
                <Link href={`/catalogo/${message.product.slug}`}>
                  {message.product.name}
                </Link>
              </dd>
            </div>
          ) : null}
        </dl>
        <div className="dashboard-ticket-copy">
          <p className="dashboard-ticket-label">{t("dashboard.messageBody")}</p>
          <p className="dashboard-ticket-message">{message.message}</p>
        </div>
        <footer className="dashboard-ticket-actions">
          {isNew ? (
            <Button disabled={pending} onClick={markRead}>
              {t("dashboard.markRead")}
            </Button>
          ) : null}
          <Button
            variant="destructive"
            disabled={pending}
            onClick={() => setConfirmOpen(true)}
          >
            {t("dashboard.deleteMessage")}
          </Button>
        </footer>
      </article>
      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("dashboard.deleteMessage")}</AlertDialogTitle>
            <AlertDialogDescription>
              {t("dashboard.deleteMessageConfirmation")}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t("common.cancel")}</AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              disabled={pending}
              onClick={remove}
            >
              {t("dashboard.deleteMessage")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
