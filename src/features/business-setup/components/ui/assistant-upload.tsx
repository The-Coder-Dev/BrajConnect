import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { UploadCloud, Image as ImageIcon, X } from "lucide-react";
import { cn } from "@/lib/utils";
import React from "react";

interface AssistantUploadProps {
  label: string;
  description: string;
  onUpload?: () => void;
  className?: string;
  icon?: React.ReactNode;
}

export function AssistantUpload({ label, description, onUpload, className, icon }: AssistantUploadProps) {
  return (
    <Card 
      className={cn(
        "border-dashed border-2 border-slate-200 hover:border-blue-400 hover:bg-blue-50/30 hover:shadow-[0_8px_30px_rgb(37,99,235,0.06)] transition-all duration-300 cursor-pointer rounded-2xl group overflow-hidden bg-slate-50/50",
        className
      )}
      onClick={onUpload}
    >
      <CardContent className="flex flex-col items-center justify-center p-6 text-center h-full relative z-10">
        <div className="h-12 w-12 rounded-full bg-white shadow-sm text-blue-600 flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-blue-100 transition-all duration-300">
          {icon || <UploadCloud className="h-6 w-6" />}
        </div>
        <h4 className="font-semibold text-slate-900 mb-1">{label}</h4>
        <p className="text-sm text-slate-500">{description}</p>
        
        <Button variant="outline" size="sm" className="mt-5 rounded-xl border-slate-200 bg-white text-slate-700 pointer-events-none group-hover:border-blue-200 group-hover:text-blue-700 transition-colors">
          Choose File
        </Button>
      </CardContent>
    </Card>
  );
}
