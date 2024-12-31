import { AIInputForm } from "./ai-input-form";
import { AITextAreaForm } from "./ai-textarea-form";

export function AIPanel() {
  return (
    <div className="flex flex-col gap-4 w-full">
      <AIInputForm />
      <AITextAreaForm />
    </div>
  );
}
