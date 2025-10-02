import z from "zod";

export const AuthorizationSchema = z.object({
  undersigner: z.string({ required_error: "Ce champs est obligatoire." }),
  emergencyAuthorization: z
    .boolean()
    .refine((value) => value, "Ce champs est obligatoire."),
  travelAuthorization: z
    .boolean()
    .refine((value) => value, "Ce champs est obligatoire."),
  imageRights: z
    .boolean()
    .refine((value) => value, "Ce champs est obligatoire."),
  theftLossLiability: z
    .boolean()
    .refine((value) => value, "Ce champs est obligatoire."),
  refund: z.boolean().refine((value) => value, "Ce champs est obligatoire."),
  internalRules: z
    .boolean()
    .refine((value) => value, "Ce champs est obligatoire."),
  signature: z.string({ required_error: "La signature est obligatoire." }),
});