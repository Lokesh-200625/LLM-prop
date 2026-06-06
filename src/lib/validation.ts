import { z } from "zod";

export const modelSchema = z.enum(["bandgap"]);

export const predictionRequestSchema = z.object({
  model: modelSchema.default("bandgap"),
  input: z.string().trim().min(1, "Material input is required.").max(5000, "Material input is too long."),
});

export const shareCreateSchema = z.object({
  predictionId: z.string().min(1, "Prediction id is required."),
  title: z.string().trim().min(1).max(120).optional(),
});

export const historyQuerySchema = z.object({
  q: z.string().trim().max(200).optional(),
  model: z.string().trim().max(50).optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(20),
});

export function zodErrorMessage(error: z.ZodError) {
  return error.issues[0]?.message ?? "Invalid request.";
}
