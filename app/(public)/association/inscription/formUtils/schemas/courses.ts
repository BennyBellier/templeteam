import z from "zod";

export const CoursesSchema = z.object({
  courses: z
    .boolean()
    .array()
    .refine((courses) => courses.some((checked) => checked), {
        error: "Veuillez sélectionner au moins un cours."
    }),
});