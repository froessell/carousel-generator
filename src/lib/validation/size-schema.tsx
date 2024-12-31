import * as z from "zod";

export const SizeSchema = z.object({
  aspectRatio: z.string(),
  width: z.number(),
  height: z.number(),
}); 