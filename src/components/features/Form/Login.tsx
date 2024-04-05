"use client";

import LoginErrors from "@/lib/loginErrors";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { Ban } from "lucide-react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "../../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../ui/form";
import { Input } from "../../ui/input";
import { Loader } from "../../ui/loader";
import { useToast } from "../../ui/use-toast";
import { ShowHide } from "./ShowHide";

// Schema definition for form validation using Zod
const formSchema = z.object({
  password: z.string({ required_error: "Veuillez saisir le mot de passe" }),
});

// Type inference for form inputs based on the Zod schema
type InputType = z.infer<typeof formSchema>;

// Props definition, optionally including a callback URL
interface Props {
  callbackUrl?: string;
  error?: string;
}

export function Login({ callbackUrl, error }: Props) {
  const { toast } = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

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
    try {
      form.resetField("password");
      // Attempt to sign in using the 'credentials' provider
      const response = await signIn("credentials", {
        redirect: false,
        callbackUrl: callbackUrl ?? "/",
        password: values.password,
      });

      if (response) {
        if (!response.ok) {
          form.resetField("password");
          switch (response.error) {
            case LoginErrors.USER_PASSWORD_MISSMATCH:
              form.setError("password", {
                type: "custom",
                message: "Le mot de passe est incorrecte.",
              });
              break;

            case LoginErrors.MISSING_PASSWORD:
              form.setError("password", {
                type: "custom",
                message: "Veuillez entrez un mot de passe.",
              });
              break;

            default:
              toast({
                variant: "destructive",
                title: "Une erreur s'est produite.",
                description: "Veuillez réessayer.",
              });
              break;
          }
        } else {
          toast({
            variant: "default",
            title: "Connecté",
            description: "Vous allez être redirigé.",
          });
          setTimeout(() => router.push(callbackUrl ?? "/"), 1000);
        }
      }
    } catch (error) {
      toast({
        title: "Un problème est survenue.",
        description: "Veuillez réessayer.",
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
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="grid gap-4">
              <div className="relative grid gap-1">
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem className={cn("group")}>
                      <FormLabel
                        className={cn(
                          "absolute translate-x-3 translate-y-6 px-0.5 text-muted-foreground transition-transform group-has-[:focus-visible,_:valid]:translate-x-2 group-has-[:focus-visible,_:valid]:translate-y-3 group-has-[:focus-visible,_:valid]:text-xs",
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
                            {...field}
                          />
                          <ShowHide
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute justify-self-end hover:bg-transparent"
                          />
                        </div>
                      </FormControl>
                      <FormMessage>{error}</FormMessage>
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
