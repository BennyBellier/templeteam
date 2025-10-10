import z from "zod";

export const ContactFormSchema = z.object({
  name: z.string({
      error: (issue) => issue.input === undefined ? "Veuillez renseigner votre nom." : undefined
}),
  mail: z.email("Adresse email invalide."),
  subject: z.string({
      error: (issue) => issue.input === undefined ? "Veuillez renseigner le sujet." : undefined
}),
  message: z.string({
      error: (issue) => issue.input === undefined ? "Veuillez renseigner un message." : undefined
}),
});

export type ContactFormInput = z.infer<typeof ContactFormSchema>;
