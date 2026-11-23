"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { notify } from "@/lib/notify";
import {
  deleteContactMessageAction,
  markContactReadAction,
} from "@/actions/dashboard-contact";
import {
  AlertDialog,
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
  const [readPending, startReadTransition] = useTransition();
  const [deletePending, startDeleteTransition] = useTransition();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const pending = readPending || deletePending;
  const isNew = message.status === "new";
  const contactHref = message.contact.includes("@")
    ? `mailto:${message.contact}`
    : `tel:${message.contact}`;

  const markRead = () =>
    startReadTransition(() => {
      void (async () => {
        try {
          const result = await markContactReadAction(message.id);
          if (result.error) notify.error(result.error);
          else router.refresh();
        } catch {
          notify.error(t("dashboard.messageMarkReadFailed"));
        }
      })();
    });

  const remove = () =>
    startDeleteTransition(() => {
      void (async () => {
        try {
          const result = await deleteContactMessageAction(message.id);
          if (result.error) {
            notify.error(result.error);
            return;
          }
          setConfirmOpen(false);
          notify.success(t("dashboard.messageDeleted"), {
            id: `message-deleted-${message.id}`,
          });
          router.refresh();
        } catch {
          notify.error(t("dashboard.messageDeleteFailed"));
        }
      })();
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
            <Button disabled={pending} onClick={markRead} type="button">
              {t("dashboard.markRead")}
            </Button>
          ) : null}
          <Button
            variant="destructive"
            disabled={pending}
            onClick={() => setConfirmOpen(true)}
            type="button"
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
            <AlertDialogCancel type="button">{t("common.cancel")}</AlertDialogCancel>
            <Button
              variant="destructive"
              disabled={deletePending}
              onClick={remove}
              type="button"
            >
              {t("dashboard.deleteMessage")}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}