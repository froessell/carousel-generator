import * as z from "zod";
import { ImageSchema } from "./image-schema";

export const BrandSchema = z.object({
  showBrand: z.boolean().default(true),
  name: z.string().default(""),
  handle: z.string().default(""),
  avatar: ImageSchema.optional(),
});
