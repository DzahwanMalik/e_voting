import { z } from "zod";

const candidatePairFormSchema = z.object({
  candidateName: z
    .string()
    .min(1, "Nama calon utama wajib diisi")
    .refine((val) => val.trim().length > 0, {
      message: "Nama calon utama wajib diisi",
    }),
  candidateDescription: z
    .string()
    .optional()
    .nullable(),
  candidateBirthday: z
    .string()
    .min(1, "Tanggal lahir calon utama wajib diisi")
    .refine((val) => !isNaN(Date.parse(val)), {
      message: "Tanggal lahir calon utama harus berupa tanggal yang valid.",
    }),
  viceName: z
    .string()
    .min(1, "Nama wakil calon wajib diisi")
    .refine((val) => val.trim().length > 0, {
      message: "Nama wakil calon wajib diisi",
    }),
  viceDescription: z
    .string()
    .optional()
    .nullable(),
  viceBirthday: z
    .string()
    .min(1, "Tanggal lahir wakil calon wajib diisi")
    .refine((val) => !isNaN(Date.parse(val)), {
      message: "Tanggal lahir wakil calon harus berupa tanggal yang valid.",
    }),
  vision: z
    .string()
    .min(1, "Visi paslon wajib diisi")
    .refine((val) => val.trim().length > 0, {
      message: "Visi paslon wajib diisi",
    }),
  mission: z
    .string()
    .min(1, "Misi paslon wajib diisi")
    .refine((val) => val.trim().length > 0, {
      message: "Misi paslon wajib diisi",
    }),
});

type CandidatePairFormData = z.infer<typeof candidatePairFormSchema>;

export type { CandidatePairFormData };
export { candidatePairFormSchema };
