import { z } from "zod";

export const closeShiftSchema = z.object({
  shiftId: z.string().trim().min(1),
  clockOut: z.string().trim(),
  reason: z.string().trim().min(1, "A reason is required."),
});
