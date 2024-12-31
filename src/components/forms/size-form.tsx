"use client";
import { useFormContext } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DocumentFormReturn } from "@/lib/document-form-types";

const ASPECT_RATIOS = {
  story: { name: "Story (9:16)", width: 360, height: 640 },
  square: { name: "Square (1:1)", width: 500, height: 500 },
  portrait34: { name: "Portrait (3:4)", width: 450, height: 600 },
  portrait45: { name: "Portrait (4:5)", width: 480, height: 600 },
  landscape43: { name: "Landscape (4:3)", width: 800, height: 600 },
  landscape169: { name: "Landscape (16:9)", width: 960, height: 540 },
};

export function SizeForm() {
  const form: DocumentFormReturn = useFormContext();

  return (
    <Form {...form}>
      <form className="space-y-6 w-full">
        <FormField
          control={form.control}
          name="config.size.aspectRatio"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Size Format</FormLabel>
              <Select
                onValueChange={(value) => {
                  field.onChange(value);
                  // Update width and height when aspect ratio changes
                  const selectedSize = ASPECT_RATIOS[value as keyof typeof ASPECT_RATIOS];
                  if (selectedSize) {
                    form.setValue("config.size.width", selectedSize.width);
                    form.setValue("config.size.height", selectedSize.height);
                  }
                }}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select size format" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {Object.entries(ASPECT_RATIOS).map(([key, value]) => (
                    <SelectItem key={key} value={key}>
                      {value.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
} 