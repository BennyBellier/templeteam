import z from "zod";

export const AuthorizationSchema = z.object({
  undersigner: z.string({
      error: (issue) => issue.input === undefined ? "Ce champs est obligatoire." : undefined
}),
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
  signature: z.string({
      error: (issue) => issue.input === undefined ? "La signature est obligatoire." : undefined
}),
});