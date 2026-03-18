"use client";

import type { Category } from "@/db/schema";
import { HardDriveUpload, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { type ChangeEvent, type DragEvent, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ALLOWED_DOCUMENT_TYPES, MAX_DOCUMENT_FILE_SIZE } from "@/lib/upload";

type Props = {
  categories: Category[];
};

export function UploadResourceCard({ categories }: Props) {
  const router = useRouter();

  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [categoryId, setCategoryId] = useState<string>("");

  const maxSizeInMb = Math.round(MAX_DOCUMENT_FILE_SIZE / (1024 * 1024));
  const acceptedTypes = Array.from(ALLOWED_DOCUMENT_TYPES).join(",");

  const handleUpload = async (file: File | undefined) => {
    if (!file) return;

    setError(null);
    setUploadedFileName(null);
    setUploadedUrl(null);
    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);
      if (categoryId) formData.append("categoryId", categoryId);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const { error } = await response.json();
        throw new Error(
          error || `Upload failed with status ${response.status}`,
        );
      }

      const uploaded = await response.json();
      setUploadedFileName(file.name);
      setUploadedUrl(uploaded.url);
      router.refresh();
    } catch (uploadError) {
      setError(
        uploadError instanceof Error
          ? uploadError.message
          : "Failed to upload file.",
      );
    } finally {
      setIsUploading(false);
    }
  };

  const onFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    await handleUpload(file);

    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  const onDrop = async (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
    const file = event.dataTransfer.files?.[0];
    await handleUpload(file);
  };

  return (
    <CardContent className="px-6">
      <input
        accept={acceptedTypes}
        className="hidden"
        id="dashboard-upload-input"
        onChange={onFileChange}
        ref={inputRef}
        type="file"
      />

      <div className="mb-4">
        <Select onValueChange={setCategoryId} value={categoryId}>
          <SelectTrigger className="w-full border-white/20 bg-white/5 text-white data-[placeholder]:text-slate-400">
            <SelectValue placeholder="Select a category (optional)" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((cat) => (
              <SelectItem key={cat.id} value={cat.id}>
                {cat.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <label
        className={`block rounded-[24px] border border-dashed bg-white/5 p-6 text-center transition ${
          isDragging ? "border-fuchsia-300 bg-white/10" : "border-white/20"
        }`}
        htmlFor="dashboard-upload-input"
        onDragEnter={(event) => {
          event.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={(event) => {
          event.preventDefault();
          setIsDragging(false);
        }}
        onDragOver={(event) => {
          event.preventDefault();
        }}
        onDrop={onDrop}
      >
        <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-white/10">
          {isUploading ? (
            <Loader2 className="size-5 animate-spin text-fuchsia-200" />
          ) : (
            <HardDriveUpload className="size-5 text-fuchsia-200" />
          )}
        </div>
        <p className="mt-4 text-base font-medium text-white">
          Drag and drop your file here
        </p>
        <p className="mt-2 text-sm text-slate-400">
          Supports PDF, ZIP, DOCX, CSV and more up to {maxSizeInMb} MB.
        </p>
        <Button
          className="mt-5 rounded-xl bg-white text-slate-950 hover:bg-white/90"
          disabled={isUploading}
          onClick={() => inputRef.current?.click()}
          type="button"
        >
          {isUploading ? "Uploading..." : "Choose file"}
        </Button>

        {uploadedFileName ? (
          <p className="mt-4 text-sm text-emerald-300">
            Uploaded {uploadedFileName}
            {uploadedUrl ? (
              <a
                className="ml-2 underline underline-offset-4"
                href={uploadedUrl}
                rel="noreferrer"
                target="_blank"
              >
                View file
              </a>
            ) : null}
          </p>
        ) : null}

        {error ? <p className="mt-4 text-sm text-rose-300">{error}</p> : null}
      </label>
    </CardContent>
  );
}
