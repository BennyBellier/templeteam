"use client";

import { Button } from "@/components/ui/button";
import { Loader2, Send } from "lucide-react";
import { useTransition } from "react";
import toast from "react-hot-toast";
import { sendEmailsToAllMembers } from "./actions";

interface Member {
  id: string;
  name: string;
  mail: string | null;
  courses: string[];
}

interface SendEmailButtonProps {
  members: Member[];
}

export function SendEmailButton({ members }: SendEmailButtonProps) {
  const [isPending, startTransition] = useTransition();

  const handleSendEmails = () => {
    startTransition(async () => {
      try {
        await sendEmailsToAllMembers(members);
      } catch (error) {
        toast.error("Une erreur est survenue lors de l'envoi des emails");
      }
    });
  };

  return (
    <Button
      onClick={handleSendEmails}
      disabled={isPending || members.length === 0}
      size="lg"
      className="gap-2 bg-neutral-900"
    >
      {isPending ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          Envoi en cours...
        </>
      ) : (
        <>
          <Send className="h-4 w-4" />
          Envoyer à tous les membres
        </>
      )}
    </Button>
  );
}
