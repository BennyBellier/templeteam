"use client";

import { Button } from "@/components/ui/button";
import { generateRegistrationPDF } from "pdfs/RegistrationTemplate";

export default function Playground() {

  function handleClick(_event: React.MouseEvent<HTMLButtonElement>) {
    void generateRegistrationPDF('983a4503-cdbc-47f1-958e-dd2fb446719c');
  }

  return (
    <Button onClick={handleClick}>generate PDF</Button>
  );
}
