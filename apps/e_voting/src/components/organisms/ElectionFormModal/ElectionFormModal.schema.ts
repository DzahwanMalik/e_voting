import { z } from "zod";

const electionFormSchema = z.object({
  title: z
    .string()
    .min(1, "Judul pemilihan wajib diisi")
    .refine((val) => val.trim().length > 0, {
      message: "Judul pemilihan wajib diisi",
    }),
  description: z
    .string()
    .optional()
    .nullable()
    .refine(
      (val) => val === undefined || val === null || val.trim().length > 0,
      {
        message: "Deskripsi tidak boleh hanya berisi spasi",
      },
    ),
});

type ElectionFormData = z.infer<typeof electionFormSchema>;

export type { ElectionFormData };
export { electionFormSchema };
