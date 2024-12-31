import { useFormContext } from "react-hook-form";
import { DocumentFormReturn } from "./document-form-types";

export const DEFAULT_SIZE = {
  width: 400,
  height: 500,
};

export function usePageSize() {
  const form: DocumentFormReturn = useFormContext();
  const size = form.watch("config.size");
  
  return {
    width: size?.width || DEFAULT_SIZE.width,
    height: size?.height || DEFAULT_SIZE.height,
  };
}

export const SIZE = DEFAULT_SIZE;
