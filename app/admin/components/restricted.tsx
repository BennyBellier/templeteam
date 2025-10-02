"use client";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Typography } from "@/components/ui/typography";
import { ShieldX } from "lucide-react";
import { useRouter } from "next/router";
import { Button } from "react-day-picker";

export default function RestrictedAccess() {
  const router = useRouter();

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <ShieldX />
          <Typography>Accès interdit</Typography>
        </CardTitle>
      </CardHeader>
      <Typography as={CardContent}>
        Vous n&apos;avez pas la permission d&apos;accéder à cette page.
      </Typography>
      <CardFooter>
        <Button onClick={() => router.push("/")}>Retour</Button>
      </CardFooter>
    </Card>
  );
}
