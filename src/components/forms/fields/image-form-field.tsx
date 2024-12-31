import {
  DocumentFormReturn,
  ImageFieldPath,
  ImageStyleOpacityFieldPath,
} from "@/lib/document-form-types";
import { ImageSourceFormField } from "@/components/forms/fields/image-source-form-field";
import { OpacityFormField } from "@/components/forms/fields/opacity-form-field";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { ImageSizeOption } from "@/lib/validation/image-schema";
import { useFormContext } from "react-hook-form";

export function ImageFormField({
  fieldName,
  form,
  label,
}: {
  fieldName: ImageFieldPath;
  form: DocumentFormReturn;
  label: string;
}) {
  const { watch, setValue } = useFormContext();
  const size = watch(`${fieldName}.size`) || "Default";

  return (
    <div className="space-y-4">
      <h3 className="text-base">{label}</h3>
      <ImageSourceFormField fieldName={`${fieldName}.source`} form={form} />
      <div className="space-y-2">
        <Label>Image Size</Label>
        <Select
          defaultValue="Default"
          value={size}
          onValueChange={(value) => setValue(`${fieldName}.size`, value)}
        >
          <SelectTrigger>
            <SelectValue>
              {size === "Default" ? "Default" :
               size === "FullWidth" ? "Full Width" :
               size === "AlmostFullWidth" ? "Almost Full Width" : "Default"}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Default">Default</SelectItem>
            <SelectItem value="FullWidth">Full Width</SelectItem>
            <SelectItem value="AlmostFullWidth">Almost Full Width</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <OpacityFormField
        fieldName={`${fieldName}.style.opacity` as ImageStyleOpacityFieldPath}
        form={form}
        label={"Opacity"}
        disabled={form.getValues(`${fieldName}.source.src`) == ""}
      />
    </div>
  );
}
