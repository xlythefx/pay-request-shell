import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface FormSelectProps {
  label?: string;
  error?: string;
  required?: boolean;
  placeholder?: string;
  options: { value: string; label: string }[];
  value?: string;
  onValueChange?: (value: string) => void;
  className?: string;
}

export const FormSelect = ({
  label,
  error,
  required,
  placeholder = "Select...",
  options,
  value,
  onValueChange,
  className,
}: FormSelectProps) => {
  return (
    <div className="space-y-2">
      {label && (
        <Label className="text-foreground">
          {label}
          {required && <span className="text-destructive ml-1">*</span>}
        </Label>
      )}
      <Select value={value} onValueChange={onValueChange}>
        <SelectTrigger className={cn("bg-secondary border-border", error && "border-destructive", className)}>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent className="bg-card border-border">
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value} className="focus:bg-primary/20 focus:text-primary">
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
};
