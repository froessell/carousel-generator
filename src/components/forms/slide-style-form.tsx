import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { LayoutAlignment } from "@/lib/validation/theme-schema";
import { useFormContext } from "react-hook-form";

export function SlideStyleForm() {
  const { register, watch, setValue } = useFormContext();
  const alignment = watch("theme.layout.alignment");

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Layout Alignment</Label>
        <Select
          value={alignment}
          onValueChange={(value) => setValue("theme.layout.alignment", value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select alignment" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Top">Top</SelectItem>
            <SelectItem value="Center">Center</SelectItem>
            <SelectItem value="Bottom">Bottom</SelectItem>
          </SelectContent>
        </Select>
      </div>
      {/* ... other style options ... */}
    </div>
  );
} 