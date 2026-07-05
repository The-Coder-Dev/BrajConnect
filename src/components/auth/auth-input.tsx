import * as React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export interface AuthInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  icon: LucideIcon;
  error?: string;
}

export const AuthInput = React.forwardRef<HTMLInputElement, AuthInputProps>(
  ({ className, label, icon: Icon, error, id, ...props }, ref) => {
    const inputId = id || props.name;

    return (
      <div className="space-y-2">
        <Label htmlFor={inputId} className="text-sm font-medium">
          {label}
        </Label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-muted-foreground">
            <Icon className="h-5 w-5" />
          </div>
          <Input
            id={inputId}
            ref={ref}
            className={cn("pl-10 h-11 bg-background", className)}
            {...props}
          />
        </div>
        {error && <p className="text-sm text-destructive">{error}</p>}
      </div>
    );
  }
);
AuthInput.displayName = "AuthInput";
