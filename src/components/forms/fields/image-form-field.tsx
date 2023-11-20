import { DocumentFormReturn } from "@/lib/document-form-types";
import {
  ImageContentFormField,
  ImageFormType,
} from "@/components/forms/fields/image-content-form-field";
import { ObjectFitType } from "@/lib/validation/image-schema";
import { Maximize, Maximize2, Minimize2 } from "lucide-react";
import { EnumRadioGroupField } from "@/components/forms/fields/enum-radio-group-field";

const objectFitMap: Record<ObjectFitType, React.ReactElement> = {
  [ObjectFitType.enum.Contain]: <Minimize2 className="h-4 w-4" />,
  [ObjectFitType.enum.Cover]: <Maximize2 className="h-4 w-4" />,
};

export function ImageFormField({
  fieldName,
  form,
  formType,
}: {
  fieldName:
    | `slides.${number}.image`
    | `slides.${number}.backgroundImage`
    | "config.brand.avatar";
  form: DocumentFormReturn;
  formType: ImageFormType;
}) {
  return (
    <>
      <ImageContentFormField
        fieldName={`${fieldName}.source`}
        form={form}
        formType={formType}
      />
      <EnumRadioGroupField
        fieldName={`${fieldName}.style.objectFit`}
        form={form}
        enumValueElements={objectFitMap}
        groupClassName="gap-0"
        itemClassName=""
      />
    </>
  );
}