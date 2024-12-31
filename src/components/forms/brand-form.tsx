"use client";
import { useFormContext } from "react-hook-form";
import { useState } from "react";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { DocumentFormReturn } from "@/lib/document-form-types";
import { ImageFormField } from "@/components/forms/fields/image-form-field";
import { DocumentSchema } from "@/lib/validation/document-schema";
import { BrandLayoutAlignment } from "@/lib/validation/brand-schema";
import { z } from "zod";
import { ArrowUpToLine, ArrowDownToLine, MoveVertical } from "lucide-react";

const alignmentOptions = [
  { value: "Top", label: "Top", icon: ArrowUpToLine },
  { value: "Center", label: "Center", icon: MoveVertical },
  { value: "Bottom", label: "Bottom", icon: ArrowDownToLine },
] as const;

export function BrandForm() {
  const form = useFormContext<z.infer<typeof DocumentSchema>>();
  const [showBrandElements, setShowBrandElements] = useState(true);

  return (
    <div className="space-y-4">
      <FormField
        control={form.control}
        name="config.brand.layout.alignment"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Layout Alignment</FormLabel>
            <Select
              onValueChange={field.onChange}
              defaultValue={field.value}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select alignment" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {alignmentOptions.map(({ value, label, icon: Icon }) => (
                  <SelectItem key={value} value={value}>
                    <div className="flex items-center gap-2">
                      <Icon className="w-4 h-4" />
                      <span>{label}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="flex items-center space-x-2">
        <Checkbox 
          id="show-brand"
          checked={showBrandElements}
          onCheckedChange={(checked) => {
            setShowBrandElements(checked as boolean);
            // Clear brand fields if unchecked
            if (!checked) {
              form.setValue("config.brand.name", "");
              form.setValue("config.brand.handle", "");
              form.setValue("config.brand.avatar.source.src", "");
            }
          }}
        />
        <label
          htmlFor="show-brand"
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          Show brand elements
        </label>
      </div>

      {showBrandElements && (
        <>
          <FormField
            control={form.control}
            name="config.brand.name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="Your name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="config.brand.handle"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Handle</FormLabel>
                <FormControl>
                  <Input placeholder="Your handle" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="space-y-2">
            <h3 className="text-base">Avatar Image</h3>
            <ImageFormField
              fieldName="config.brand.avatar"
              form={form}
              label={""}
            />
          </div>
        </>
      )}
    </div>
  );
}
