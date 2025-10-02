import z from "zod";

export const ContactFormSchema = z.object({
  name: z.string({ required_error: "Veuillez renseigner votre nom." }),
  mail: z
    .string({ required_error: "Veuillez renseigner votre email." })
    .email("Adresse email invalide."),
  subject: z.string({ required_error: "Veuillez renseigner le sujet." }),
  message: z.string({ required_error: "Veuillez renseigner un message." }),
});

export type ContactFormInput = z.infer<typeof ContactFormSchema>;
