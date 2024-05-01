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
import { Textarea } from "@/components/ui/textarea";
import { Typography } from "@/components/ui/typography";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  AtSign,
  MailQuestion,
  MessageCircle,
  SendHorizonal,
  User,
} from "lucide-react";
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

export type InputType = z.infer<typeof formSchema>;

export const ContactForm = () => {
  const form = useForm<InputType>({
    resolver: zodResolver(formSchema),
    resetOptions: {
      keepDirtyValues: true,
    },
    shouldFocusError: true,
  });

  async function onSubmit(values: InputType) {
    let toastId = undefined;
    try {
      toastId = toast.loading("Envoie du message en cours...");
      const response = await send(values);

      if (response.rejected.length > 0) {
        toast.error("une erreur s'est produite. Veuillez réessayer.", {
          id: toastId,
          duration: 3000,
        });
      } else {
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
      }
    } catch (error) {
      toast.error("Un problème est survenue. Veuillez réessayer.", {
        id: toastId,
      });
    }
  }

  return (
    <Card className="flex h-full flex-col border border-primary lg:rounded-l-none lg:border-none">
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
                        "absolute translate-x-3 translate-y-2 px-0.5 text-muted-foreground transition-transform  ",
                      )}
                    >
                      Nom
                    </div>
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      className="h-14 bg-background object-bottom pl-9 pr-2 pt-5 text-base group-has-[:focus-visible,_:valid]:bg-indigo-50/30 dark:group-has-[:focus-visible,_:valid]:bg-indigo-50/5"
                      aria-required
                      {...field}
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
                      className="h-14 bg-background object-bottom pl-9 pr-2 pt-5 text-base group-has-[:focus-visible,_:valid]:bg-indigo-50/30 dark:group-has-[:focus-visible,_:valid]:bg-indigo-50/5"
                      aria-required
                      {...field}
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
                      className="h-14 bg-background object-bottom pl-9 pr-2 pt-5 text-base group-has-[:focus-visible,_:valid]:bg-indigo-50/30 dark:group-has-[:focus-visible,_:valid]:bg-indigo-50/5"
                      aria-required
                      {...field}
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
                      className="h-52 resize-none bg-background object-bottom pl-9 pr-2 pt-5 text-base group-has-[:focus-visible,_:valid]:bg-indigo-50/30 dark:group-has-[:focus-visible,_:valid]:bg-indigo-50/5 lg:h-full "
                      aria-required
                      {...field}
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
        <Button
          type="submit"
          form="contactForm"
          className="text-md group flex h-full w-full flex-row items-center gap-2 rounded-b-lg rounded-t-none hover:scale-100 lg:rounded-l-none"
          accessKey="Enter"
          aria-keyshortcuts="Enter"
        >
          <SendHorizonal />
          <span className="text translate-y-0.5">Envoyer</span>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ContactForm;
