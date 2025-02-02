"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Loader } from "@/components/ui/loader";
import { Textarea } from "@/components/ui/textarea";
import { Typography } from "@/components/ui/typography";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  AtSign,
  Check,
  MailQuestion,
  MessageCircle,
  SendHorizonal,
  User,
} from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";
import { send } from "./sendContact";

const formSchema = z.object({
  name: z.string({ required_error: "Veuillez renseigner votre nom." }),
  mail: z
    .string({ required_error: "Veuillez renseigner votre email." })
    .email("Adresse email invalide."),
  subject: z.string({ required_error: "Veuillez renseigner le sujet." }),
  message: z.string({ required_error: "Veuillez renseigner un message." }),
});

const inputClass = cn(
  " h-14 bg-background object-bottom pl-9 pr-2 pt-5 text-base",
);

const buttonClass = cn(
  "group text-md group h-full w-full rounded-b-lg rounded-t-none hover:scale-100 focus-visible:scale-100 disabled:opacity-100 lg:rounded-l-none",
);

const buttonContentClass = cn(
  "flex flex-row items-center gap-2 group-hover:scale-90 group-focus-visible:scale-90 transition-transform",
);

export type InputType = z.infer<typeof formSchema>;

export const ContactForm = () => {
  const form = useForm<InputType>({
    resolver: zodResolver(formSchema),
    resetOptions: {
      keepDirtyValues: true,
    },
    shouldFocusError: true,
  });
  const [isSending, setIsSending] = useState(false);
  const [isSent, setIsSent] = useState(false);

  async function onSubmit(values: InputType) {
    setIsSending(true);
    let toastId = undefined;
    try {
      toastId = toast.loading("Envoie du message en cours...");
      await send(values);

      toast.success("Nous avons bien reçu votre message !", {
        id: toastId,
        duration: 5000,
      });

      form.reset({
        mail: "",
        message: "",
        name: "",
        subject: "",
      });

      setIsSent(true);
      
    } catch (e) {
      if (e instanceof Error) {
        toast.error(e.message, {
          id: toastId,
          duration: 3000,
        });
      } else {
        toast.error("Un problème est survenu. Veuillez réessayer.", {
          id: toastId,
          duration: 3000,
        });
      }
    }
    setIsSending(false);
  }

  return (
    <>
      <Card
        className={cn(
          "ease flex h-full flex-col border border-primary transition-transform duration-500 lg:rounded-l-none lg:border-none",
          // isSending || isSent ? "translate-y-full" : "",
        )}
      >
        <CardHeader className="flex-none pb-2 pt-4">
          <Typography
            as={CardTitle}
            variant="h1"
            className="text-center lg:text-4xl"
          >
            Formulaire de contact
          </Typography>
        </CardHeader>
        <CardContent className="h-full grid-rows-subgrid">
          <Form {...form}>
            <form
              id="contactForm"
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex h-[98%] flex-col gap-4"
            >
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className={cn("group space-y-0.5")}>
                    <FormLabel>
                      <User className="absolute translate-x-2 translate-y-7 text-muted-foreground" />
                      <div
                        className={cn(
                          "absolute translate-x-3 translate-y-2 px-0.5 text-muted-foreground transition-transform",
                        )}
                      >
                        Nom
                      </div>
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        className={inputClass}
                        aria-required
                        {...field}
                        disabled={isSent || isSending}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="mail"
                render={({ field }) => (
                  <FormItem className={cn("group space-y-0.5")}>
                    <FormLabel>
                      <AtSign
                        size={23}
                        className="absolute translate-x-2 translate-y-7 text-muted-foreground"
                      />
                      <div
                        className={cn(
                          "absolute translate-x-3 translate-y-2 px-0.5 text-muted-foreground transition-transform  ",
                        )}
                      >
                        Adresse email
                      </div>
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        className={inputClass}
                        aria-required
                        {...field}
                        disabled={isSent || isSending}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="subject"
                render={({ field }) => (
                  <FormItem className={cn("group space-y-0.5")}>
                    <FormLabel>
                      <MailQuestion
                        size={23}
                        className="absolute translate-x-2 translate-y-7 text-muted-foreground"
                      />
                      <div
                        className={cn(
                          "absolute translate-x-3 translate-y-2 px-0.5 text-muted-foreground transition-transform ",
                        )}
                      >
                        Sujet
                      </div>
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        className={inputClass}
                        aria-required
                        {...field}
                        disabled={isSent || isSending}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="message"
                render={({ field }) => (
                  <FormItem className={cn("group grow space-y-0.5")}>
                    <FormLabel>
                      <MessageCircle
                        size={23}
                        className="absolute translate-x-2 translate-y-6 text-muted-foreground"
                      />
                      <div
                        className={cn(
                          "absolute translate-x-3 translate-y-2 px-0.5 text-muted-foreground transition-transform",
                        )}
                      >
                        Message
                      </div>
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        className={cn(
                          inputClass,
                          "h-52 resize-none object-bottom pl-9 pr-2 pt-5 text-base lg:h-full",
                        )}
                        aria-required
                        {...field}
                        disabled={isSent || isSending}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </form>
          </Form>
        </CardContent>
        <CardFooter className="h-12 w-full rounded-none p-0">
          {!isSending && !isSent && (
            <Button
              type="submit"
              form="contactForm"
              className={buttonClass}
              disabled={isSending || isSent}
              accessKey="Enter"
              aria-keyshortcuts="Enter"
              aria-disabled={isSending || isSent}
            >
              <div className={buttonContentClass}>
                <SendHorizonal />
                <span
                  className={cn(
                    "text origin-center translate-y-0.5 select-none overflow-x-hidden transition-size",
                  )}
                >
                  Envoyer
                </span>
              </div>
            </Button>
          )}
          {isSending && (
            <div
              className={cn(
                "flex items-center justify-center bg-primary text-primary-foreground shadow hover:bg-primary/90 focus-visible:bg-primary/90",
                buttonClass,
              )}
            >
              <Loader />
            </div>
          )}
          {isSent && (
            <Button
              className={cn(buttonClass, "gap-2.5")}
              accessKey="Enter"
              aria-keyshortcuts="Enter"
              onClick={() => {
                setIsSent(false);
              }}
            >
              <div className={buttonContentClass}>
                <Check />
                <span
                  className={cn(
                    "text origin-center translate-y-0.5 select-none overflow-x-hidden transition-size",
                    isSending ? "animate-width-reduction" : "",
                  )}
                >
                  Envoyé
                </span>
              </div>
            </Button>
          )}
        </CardFooter>
      </Card>
    </>
  );
};

export default ContactForm;
