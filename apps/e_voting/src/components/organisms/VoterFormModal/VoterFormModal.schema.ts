import { z } from "zod";

const voterFormSchema = z.object({
  username: z
    .string()
    .min(1, "Username wajib diisi")
    .refine((val) => val.trim().length > 0, {
      message: "Username wajib diisi",
    }),
  name: z
    .string()
    .min(1, "Nama wajib diisi")
    .refine((val) => val.trim().length > 0, {
      message: "Nama wajib diisi",
    }),
  password: z
    .string()
    .refine((val) => val === "" || val.length >= 1, {
      message: "Password minimal 1 karakter",
    })
    .optional(),
  electionIds: z.array(z.number()).optional(),
});

type VoterFormData = z.infer<typeof voterFormSchema>;

export type { VoterFormData };
export { voterFormSchema };
