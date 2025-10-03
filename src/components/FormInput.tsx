import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  required?: boolean;
}

export const FormInput = ({ label, error, required, className, ...props }: FormInputProps) => {
  return (
    <div className="space-y-2">
      {label && (
        <Label htmlFor={props.id} className="text-foreground">
          {label}
          {required && <span className="text-destructive ml-1">*</span>}
        </Label>
      )}
      <Input
        className={cn(
          "bg-secondary border-border focus:border-primary transition-colors",
          error && "border-destructive",
          className
        )}
        {...props}
      />
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
};
