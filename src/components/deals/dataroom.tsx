"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getFileDownloadUrl } from "@/app/(dashboard)/deals/[id]/actions";

interface DataroomFile {
  id: string;
  file_name: string;
  file_path: string;
  file_size: number | null;
  mime_type: string | null;
  created_at: string;
}

interface DataroomProps {
  files: DataroomFile[];
}

function formatFileSize(bytes: number | null): string {
  if (!bytes) return "—";
  if (bytes < 1024) return `${bytes} o`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} Ko`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} Mo`;
}

function getFileIcon(mimeType: string | null, fileName: string): string {
  if (mimeType?.includes("pdf") || fileName.endsWith(".pdf")) return "PDF";
  if (mimeType?.includes("spreadsheet") || mimeType?.includes("excel") || fileName.match(/\.xlsx?$/)) return "XLS";
  if (mimeType?.includes("word") || mimeType?.includes("document") || fileName.match(/\.docx?$/)) return "DOC";
  if (mimeType?.includes("presentation") || fileName.match(/\.pptx?$/)) return "PPT";
  if (mimeType?.includes("image")) return "IMG";
  return "FILE";
}

const iconColors: Record<string, string> = {
  PDF: "bg-error/10 text-error",
  XLS: "bg-success/10 text-success",
  DOC: "bg-midnight/10 text-midnight",
  PPT: "bg-terracotta/10 text-terracotta",
  IMG: "bg-warning/10 text-warning",
  FILE: "bg-gray-100 text-gray-500",
};

export function Dataroom({ files }: DataroomProps) {
  const [downloading, setDownloading] = useState<string | null>(null);

  async function handleDownload(file: DataroomFile) {
    setDownloading(file.id);
    try {
      const { url } = await getFileDownloadUrl(file.file_path);
      window.open(url, "_blank");
    } catch (err) {
      console.error("Download error:", err);
    }
    setDownloading(null);
  }

  if (files.length === 0) {
    return (
      <Card className="text-center py-8">
        <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
          <svg className="w-6 h-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
          </svg>
        </div>
        <p className="text-text-soft">Aucun document dans la dataroom pour le moment.</p>
        <p className="text-xs text-gray-400 mt-1">Les documents seront ajoutés par l&apos;équipe WINVA.</p>
      </Card>
    );
  }

  return (
    <Card>
      <h2 className="font-display text-lg font-semibold text-midnight mb-4">
        Dataroom — {files.length} document{files.length > 1 ? "s" : ""}
      </h2>
      <div className="divide-y divide-gray-50">
        {files.map((file) => {
          const icon = getFileIcon(file.mime_type, file.file_name);
          const colorClass = iconColors[icon];
          return (
            <div
              key={file.id}
              className="flex items-center gap-4 py-3 first:pt-0 last:pb-0"
            >
              {/* Icon */}
              <div className={`w-10 h-10 rounded-[var(--radius-md)] flex items-center justify-center text-xs font-bold ${colorClass}`}>
                {icon}
              </div>

              {/* File info */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-text truncate">
                  {file.file_name}
                </p>
                <p className="text-xs text-gray-400">
                  {formatFileSize(file.file_size)}
                  {" · "}
                  {new Date(file.created_at).toLocaleDateString("fr-FR", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </p>
              </div>

              {/* Download */}
              <Button
                variant="ghost"
                size="sm"
                loading={downloading === file.id}
                onClick={() => handleDownload(file)}
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </Button>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
