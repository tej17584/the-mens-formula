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
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
        toast.success(t("dashboard.messageDeleted"));
        router.refresh();
      }
    });

  return (
    <>
      <Card className={isNew ? "dashboard-message-card is-new" : "dashboard-message-card"}>
        <CardHeader className="flex-row items-start justify-between gap-3">
          <div>
            <CardTitle>{message.name}</CardTitle>
            <a className="dashboard-message-contact" href={`mailto:${message.contact}`}>
              {message.contact}
            </a>
          </div>
          <Badge variant={isNew ? "default" : "secondary"}>
            {isNew ? t("dashboard.new") : t("dashboard.read")}
          </Badge>
        </CardHeader>
        <CardContent>
          <p className="dashboard-message-body">{message.message}</p>
          {message.product ? (
            <Link
              className="text-link"
              href={`/catalogo/${message.product.slug}`}
            >
              {message.product.name}
            </Link>
          ) : null}
        </CardContent>
        <CardFooter className="dashboard-message-footer">
          <time dateTime={message.created_at}>
            {new Intl.DateTimeFormat("es-GT", {
              dateStyle: "medium",
              timeStyle: "short",
            }).format(new Date(message.created_at))}
          </time>
          <div className="dashboard-message-actions">
            {isNew ? (
              <Button
                variant="outline"
                size="sm"
                disabled={pending}
                onClick={markRead}
              >
                {t("dashboard.markRead")}
              </Button>
            ) : null}
            <Button
              variant="destructive"
              size="sm"
              disabled={pending}
              onClick={() => setConfirmOpen(true)}
            >
              {t("dashboard.deleteMessage")}
            </Button>
          </div>
        </CardFooter>
      </Card>
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
