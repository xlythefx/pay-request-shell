import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface FormTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  required?: boolean;
}

export const FormTextarea = ({ label, error, required, className, ...props }: FormTextareaProps) => {
  return (
    <div className="space-y-2">
      {label && (
        <Label htmlFor={props.id} className="text-foreground">
          {label}
          {required && <span className="text-destructive ml-1">*</span>}
        </Label>
      )}
      <Textarea
        className={cn(
          "bg-secondary border-border focus:border-primary transition-colors min-h-[100px]",
          error && "border-destructive",
          className
        )}
        {...props}
      />
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
};
