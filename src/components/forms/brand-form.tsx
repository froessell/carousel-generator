"use client";
import { useFormContext } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { Toggle } from "@/components/ui/toggle";
import { Input } from "@/components/ui/input";
import { ImageFormField } from "@/components/forms/fields/image-form-field";
import { DocumentFormReturn } from "@/lib/document-form-types";
import { DocumentSchema } from "@/lib/validation/document-schema";
import * as z from "zod";
import { useEffect, useState } from "react";

type FormData = z.infer<typeof DocumentSchema>;

export function BrandForm() {
  const form = useFormContext<FormData>();
  const [showBrand, setShowBrand] = useState(true);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const value = form.getValues("config.brand.showBrand") ?? true;
    setShowBrand(value);
  }, [form]);

  useEffect(() => {
    const subscription = form.watch((value) => {
      const showBrandValue = value?.config?.brand?.showBrand;
      if (showBrandValue !== undefined) {
        setShowBrand(showBrandValue);
      }
    });
    return () => subscription.unsubscribe();
  }, [form]);

  if (!isClient) {
    return null;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <Toggle
          id="show-brand"
          pressed={showBrand}
          onPressedChange={(pressed: boolean) => {
            form.setValue("config.brand.showBrand", pressed);
            setShowBrand(pressed);
          }}
          aria-label="Toggle brand elements"
        >
          <Label htmlFor="show-brand">Show brand elements</Label>
        </Toggle>
      </div>

      {showBrand && (
        <>
          <div className="space-y-2">
            <Label>Name</Label>
            <Input {...form.register("config.brand.name")} />
          </div>
          <div className="space-y-2">
            <Label>Handle</Label>
            <Input {...form.register("config.brand.handle")} />
          </div>
          <div className="space-y-2">
            <Label>Avatar</Label>
            <ImageFormField
              fieldName="config.brand.avatar"
              form={form as DocumentFormReturn}
              label=""
            />
          </div>
        </>
      )}
    </div>
  );
}
