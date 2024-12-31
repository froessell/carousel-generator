"use client";

import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { convertFileToDataUrl } from "@/lib/convert-file";
import {
  DocumentFormReturn,
  ImageSourceFieldPath,
} from "@/lib/document-form-types";
import imageCompression from "browser-image-compression";
import { ImageInputType } from "@/lib/validation/image-schema";
import { useState } from "react";
import { UnsplashSearch } from "./unsplash-search";
import { AIImageGenerator } from "./ai-image-generator";
import { Link, Upload, Search, Sparkles } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const MAX_IMAGE_SIZE_MB = 0.5;
export const MAX_IMAGE_WIDTH = 800;

const sourceTypes = [
  { value: ImageInputType.Url, label: "URL", icon: Link },
  { value: ImageInputType.Upload, label: "Upload", icon: Upload },
  { value: ImageInputType.Unsplash, label: "Unsplash", icon: Search },
  { value: ImageInputType.Generated, label: "AI", icon: Sparkles },
];

export function ImageSourceFormField({
  fieldName,
  form,
}: {
  fieldName: ImageSourceFieldPath;
  form: DocumentFormReturn;
}) {
  const [selectedType, setSelectedType] = useState<ImageInputType>(ImageInputType.Url);

  const handleImageSelect = (src: string, type: ImageInputType) => {
    form.setValue(fieldName, { type, src });
  };

  const selectedSource = sourceTypes.find(source => source.value === selectedType);

  return (
    <div className="space-y-4">
      <Select
        value={selectedType}
        onValueChange={(value) => {
          setSelectedType(value as ImageInputType);
          form.setValue(fieldName, { type: value as ImageInputType, src: "" });
        }}
      >
        <SelectTrigger>
          <div className="flex items-center gap-2">
            {selectedSource && <selectedSource.icon className="w-4 h-4" />}
            <span>{selectedSource?.label}</span>
          </div>
        </SelectTrigger>
        <SelectContent>
          {sourceTypes.map(({ value, label, icon: Icon }) => (
            <SelectItem key={value} value={value}>
              <div className="flex items-center gap-2">
                <Icon className="w-4 h-4" />
                <span>{label}</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {selectedType === ImageInputType.Url && (
        <FormField
          control={form.control}
          name={`${fieldName}.src`}
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input
                  placeholder="Url to an image"
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      )}

      {selectedType === ImageInputType.Upload && (
        <FormField
          control={form.control}
          name={`${fieldName}.src`}
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input
                  accept=".jpg, .jpeg, .png, .svg, .webp"
                  type="file"
                  onChange={async (e) => {
                    const file = e.target?.files ? e.target?.files[0] : null;

                    if (file) {
                      const compressedFile = await imageCompression(file, {
                        maxSizeMB: MAX_IMAGE_SIZE_MB,
                        maxWidthOrHeight: MAX_IMAGE_WIDTH,
                      });
                      const dataUrl = await convertFileToDataUrl(
                        compressedFile
                      );
                      field.onChange(dataUrl ? dataUrl : "");
                    } else {
                      console.error("No valid image file selected.");
                    }
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      )}

      {selectedType === ImageInputType.Unsplash && (
        <UnsplashSearch
          onSelect={(url) => handleImageSelect(url, ImageInputType.Unsplash)}
        />
      )}

      {selectedType === ImageInputType.Generated && (
        <AIImageGenerator
          onGenerate={(url) => handleImageSelect(url, ImageInputType.Generated)}
        />
      )}
    </div>
  );
}
