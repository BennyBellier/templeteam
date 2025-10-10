"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import LoginErrors from "@/lib/loginErrors";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { throttle } from "lodash";
import { Ban } from "lucide-react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";
import { ShowHide } from "./ShowHide";

// Schema definition for form validation using Zod
const formSchema = z.object({
  identifier: z.string({
      error: (issue) => issue.input === undefined ? "Veuillez saisir une adresse mail ou un nom d'utilisateur." : undefined
}),
  password: z.string({
      error: (issue) => issue.input === undefined ? "Veuillez saisir le mot de passe." : undefined
}),
});

// Type inference for form inputs based on the Zod schema
type InputType = z.infer<typeof formSchema>;

// Props definition, optionally including a callback URL
interface Props {
  callbackUrl?: string;
  errorProps?: string;
}

export function Login({ callbackUrl }: Props) {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<InputType>({
    resolver: zodResolver(formSchema), // Set up Zod as the form validation resolver
    defaultValues: {
      password: "",
    },
    resetOptions: {
      keepDirtyValues: false,
    },
    shouldFocusError: true,
  });

  // Function to handle form submission
  async function onSubmit(values: InputType) {
    let toastId = undefined;
    try {
      form.resetField("password");
      toastId = toast.loading("Connexion en cours");

      const response = await signIn("credentials", {
        ...values,
        redirect: false,
        callback: "/admin",
      });

      if (response) {
        if (!response.ok) {
          switch (response.error) {
            case LoginErrors.USER_PASSWORD_MISSMATCH:
              form.setError("password", {
                type: "custom",
                message: "Le mot de passe est incorrecte.",
              });
              toast.error("Mot de passe incorrecte.", {
                id: toastId,
                duration: 3000,
              });
              break;

            case LoginErrors.USER_NOT_FOUND:
              form.setError("identifier", {
                type: "custom",
                message: "Utilisateur introuvable.",
              });
              toast.error("Utilisateur introuvable.", {
                id: toastId,
                duration: 3000,
              });
              break;

            default:
              toast.error("une erreur s'est produite. Veuillez réessayer.", {
                id: toastId,
                duration: 3000,
              });
              break;
          }
        } else {
          toast.success("Connecté, vous allez être redirigé.", {
            id: toastId,
            duration: 3000,
          });
          router.push(callbackUrl ?? "/admin/dashboard");
        }
      }
    } catch (error) {
      toast.error("Un problème est survenue. Veuillez réessayer.", {
        id: toastId,
      });
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex w-full items-end gap-4 text-xl">
          <Ban strokeWidth="3" size={28} className="text-primary" /> Accès
          restreint
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={throttle(async (e: React.FormEvent) => {
              e.preventDefault();
              await onSubmit(form.getValues());
            }, 3000)}
          >
            <div className="grid gap-4">
              <div className="relative grid gap-1">
                <FormField
                  control={form.control}
                  name="identifier"
                  render={({ field }) => (
                    <FormItem className={cn("group")}>
                      <FormLabel
                        className={cn(
                          "pointer-events-none absolute translate-x-3 translate-y-6 px-0.5 text-muted-foreground transition-transform group-has-[:focus-visible,_:valid]:translate-x-2 group-has-[:focus-visible,_:valid]:translate-y-3 group-has-[:focus-visible,_:valid]:text-xs",
                        )}
                      >
                        Email ou nom d&apos;utilisateur
                      </FormLabel>
                      <FormControl>
                        <div className="grid items-center gap-2">
                          <Input
                            type="text"
                            autoComplete="email username webauthn"
                            className="h-12 bg-background object-bottom pr-12 pt-5 text-base group-has-[:focus-visible,_:valid]:bg-indigo-50/30 dark:group-has-[:focus-visible,_:valid]:bg-indigo-50/5"
                            aria-required
                            required
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage>
                        {form.formState.errors.identifier?.message}
                      </FormMessage>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem className={cn("group")}>
                      <FormLabel
                        className={cn(
                          "pointer-events-none absolute translate-x-3 translate-y-6 px-0.5 text-muted-foreground transition-transform group-has-[:focus-visible,_:valid]:translate-x-2 group-has-[:focus-visible,_:valid]:translate-y-3 group-has-[:focus-visible,_:valid]:text-xs",
                        )}
                      >
                        Mot de passe
                      </FormLabel>
                      <FormControl>
                        <div className="grid items-center gap-2">
                          <Input
                            type={showPassword ? "text" : "password"}
                            autoComplete="peer current-password webauthn"
                            className="h-12 bg-background object-bottom pr-12 pt-5 text-base group-has-[:focus-visible,_:valid]:bg-indigo-50/30 dark:group-has-[:focus-visible,_:valid]:bg-indigo-50/5"
                            required
                            ia-required
                            {...field}
                          />
                          <ShowHide
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute justify-self-end hover:bg-transparent"
                          />
                        </div>
                      </FormControl>
                      <FormMessage>
                        {form.formState.errors.password?.message}
                      </FormMessage>
                    </FormItem>
                  )}
                />
              </div>
              <Button
                type="submit"
                aria-disabled={form.formState.isSubmitting}
                className={cn("w-fill relative text-lg")}
                disabled={form.formState.isSubmitting}
              >
                <span
                  className={cn(
                    "absolute",
                    form.formState.isSubmitting ? "opacity-0" : "",
                  )}
                >
                  Se connecter
                </span>
                <Loader
                  className={cn(
                    "absolute",
                    form.formState.isSubmitting ? "" : "opacity-0",
                  )}
                />
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
