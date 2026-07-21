"use client";

import React from "react";
import { FileText, ExternalLink, Download, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";

interface DocumentItem {
  id: string;
  documentType: string;
  fileName: string;
  storagePath: string;
  uploadedAt: string | Date;
  verificationStatus: string;
  signedUrl?: string | null;
}

export function AdminDocumentViewer({ documents }: { documents: DocumentItem[] }) {
  if (!documents || documents.length === 0) {
    return (
      <div className="py-6 text-center text-xs text-muted-foreground border border-dashed rounded-xl bg-muted/5">
        No verification documents uploaded for this business.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {documents.map((doc) => {
        const url = doc.signedUrl;
        const isPdf = doc.fileName?.toLowerCase().endsWith(".pdf") || doc.storagePath?.toLowerCase().endsWith(".pdf");

        return (
          <div key={doc.id} className="p-4 border rounded-2xl bg-card border-border/40 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-border/30">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl shrink-0">
                  {isPdf ? <FileText className="h-5 w-5" /> : <ImageIcon className="h-5 w-5" />}
                </div>
                <div>
                  <p className="text-xs font-bold text-foreground truncate max-w-[200px]">{doc.fileName}</p>
                  <p className="text-[10px] text-muted-foreground uppercase font-semibold">
                    {doc.documentType} · Uploaded {new Date(doc.uploadedAt).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Badge
                  variant="outline"
                  className={`text-[10px] capitalize px-2 py-0.5 rounded-full font-semibold ${
                    doc.verificationStatus === "verified"
                      ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                      : "bg-amber-500/10 text-amber-600 border-amber-500/20"
                  }`}
                >
                  {doc.verificationStatus}
                </Badge>

                {url && (
                  <>
                    <Button size="sm" variant="outline" className="h-8 rounded-lg text-xs" render={<a href={url} target="_blank" rel="noopener noreferrer" />}>
                      <ExternalLink className="h-3.5 w-3.5 mr-1" /> Open
                    </Button>
                    <Button size="sm" variant="outline" className="h-8 rounded-lg text-xs" render={<a href={url} download={doc.fileName} />}>
                      <Download className="h-3.5 w-3.5 mr-1" /> Download
                    </Button>
                  </>
                )}
              </div>
            </div>

            {/* Document Preview Box */}
            {url ? (
              isPdf ? (
                <div className="w-full h-80 rounded-xl overflow-hidden border border-border/40 bg-slate-900/5">
                  <iframe src={url} className="w-full h-full border-0" title={doc.fileName} />
                </div>
              ) : (
                <div className="relative aspect-video max-h-72 w-full rounded-xl overflow-hidden border border-border/40 bg-slate-100">
                  <Image src={url} alt={doc.fileName} fill className="object-contain" sizes="100vw" />
                </div>
              )
            ) : (
              <p className="text-xs text-red-500 italic">Could not load preview signed URL.</p>
            )}
          </div>
        );
      })}
    </div>
  );
}
