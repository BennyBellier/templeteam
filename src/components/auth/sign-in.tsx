"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signIn } from "@/server/auth-client";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  return (
    <Card className="max-w-md">
      <CardHeader>
        <CardTitle className="text-lg md:text-xl">Se connecter</CardTitle>
        <CardDescription className="text-xs md:text-sm">
          Entrez votre adresse e-mail ci-dessous pour vous connecter à votre
          compte.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="m@exemple.com"
              required
              onChange={(e) => {
                setEmail(e.target.value);
              }}
              value={email}
            />
          </div>

          <div className="grid gap-2">
            <div className="flex items-center">
              <Label htmlFor="password">Mot de passe</Label>
            </div>

            <Input
              id="password"
              type="password"
              placeholder="Mot de passe"
              autoComplete="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-2">
            <Checkbox
              id="remember"
              onClick={() => {
                setRememberMe(!rememberMe);
              }}
            />
            <Label htmlFor="remember">Se souvenir de moi</Label>
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={loading}
            onClick={async () => {
              await signIn.email(
                {
                  email,
                  password,
                  rememberMe,
                  callbackURL: "/admin/dashboard",
                },
                {
                  onRequest: () => {
                    setLoading(true);
                  },
                  onResponse: () => {
                    setLoading(false);
                    
                  },
                  onSuccess: () => {
                    toast.success("Connecté");
                  },
                  onError: () => {
                    toast.error("Mail ou mot de passe incorrecte.", {
                      duration: 5000,
                    });
                  },
                },
              );
            }}
          >
            {loading ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <p> Se connecter </p>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
