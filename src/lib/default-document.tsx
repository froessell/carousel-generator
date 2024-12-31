import * as z from "zod";
import { MultiSlideSchema } from "@/lib/validation/slide-schema";
import { SlideType } from "@/lib/validation/slide-schema";

import { getDefaultSlideOfType } from "@/lib/default-slides";
import { DEFAULT_IMAGE_INPUT } from "@/lib/validation/image-schema";

const defaultSlideValues: z.infer<typeof MultiSlideSchema> = [
  getDefaultSlideOfType(SlideType.enum.Intro),
  getDefaultSlideOfType(SlideType.enum.Common),
  getDefaultSlideOfType(SlideType.enum.Content),
  getDefaultSlideOfType(SlideType.enum.Content),
  getDefaultSlideOfType(SlideType.enum.Outro),
];

export const defaultValues = {
  slides: defaultSlideValues,
  config: {
    brand: {
      avatar: DEFAULT_IMAGE_INPUT,

      name: "My name",
      handle: "@name",
    },
    theme: {
      isCustom: false,
      pallette: "black",
      primary: "#0d0d0d",
      secondary: "#161616",
      background: "#ffffff",
      layout: {
        alignment: "Center",
      },
    },
    fonts: {
      font1: "DM_Serif_Display",
      font2: "DM_Sans",
    },
    pageNumber: {
      showNumbers: true,
    },
    size: {
      aspectRatio: "landscape43",
      width: 800,
      height: 600,
    },
  },
  filename: "My Carousel File",
};
