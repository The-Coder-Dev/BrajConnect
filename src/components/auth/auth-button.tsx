import * as React from "react";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface AuthButtonProps extends React.ComponentProps<typeof Button> {
  isLoading?: boolean;
}

export const AuthButton = React.forwardRef<HTMLButtonElement, AuthButtonProps>(
  ({ className, isLoading, children, disabled, ...props }, ref) => {
    return (
      <Button
        ref={ref}
        disabled={isLoading || disabled}
        className={cn(
          "w-full h-11 relative overflow-hidden transition-all duration-300 shadow-md",
          className
        )}
        {...props}
      >
        {/* Gradient overlay for premium feel */}
        <div className="absolute inset-0 bg-linear-to-r from-primary/0 via-white/10 to-primary/0 opacity-0 hover:opacity-100 transition-opacity duration-500" />
        
        {isLoading ? (
          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
        ) : null}
        <span className="relative z-10">{children}</span>
      </Button>
    );
  }
);
AuthButton.displayName = "AuthButton";
