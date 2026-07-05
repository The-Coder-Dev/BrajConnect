"use client";

import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { FaGoogle } from "react-icons/fa";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export function SocialLoginButtons() {
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await authClient.signIn.social({
        provider: "google",
      });
      
      if (error) {
        toast.error(error.message || "Failed to sign in with Google.");
        setIsLoading(false);
      }
    } catch (err) {
      toast.error("An unexpected error occurred.");
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-3">
      <Button 
        variant="outline" 
        className="w-full h-11 bg-background" 
        onClick={handleGoogleSignIn}
        disabled={isLoading}
      >
        {isLoading ? (
          <Loader2 className="mr-2 h-5 w-5 animate-spin text-muted-foreground" />
        ) : (
          <FaGoogle className="mr-2 h-5 w-5 text-muted-foreground" />
        )}
        Continue with Google
      </Button>
    </div>
  );
}