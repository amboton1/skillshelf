import { put } from "@vercel/blob";

const DEFAULT_ALLOWED_DOCUMENT_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-powerpoint",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "text/plain",
  "text/csv",
  "application/rtf",
  "application/zip",
] as const;

const DEFAULT_MAX_FILE_SIZE = 25 * 1024 * 1024;

export type AllowedDocumentType =
  (typeof DEFAULT_ALLOWED_DOCUMENT_TYPES)[number];

export type UploadDocumentOptions = {
  folder?: string;
  addRandomSuffix?: boolean;
  access?: "public";
  allowedTypes?: readonly string[];
  maxFileSize?: number;
  cacheControlMaxAge?: number;
  token?: string;
};

export type UploadDocumentResult = {
  url: string;
  downloadUrl: string;
  pathname: string;
  contentType: string;
  contentDisposition: string;
  size: number;
  uploadedAt: string;
  originalFilename: string;
};

export function sanitizeFilename(filename: string) {
  return filename
    .normalize("NFKD")
    .replace(/[^a-zA-Z0-9._-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .toLowerCase();
}

export function ensureValidFile(file: File, options?: UploadDocumentOptions) {
  const allowedTypes = options?.allowedTypes ?? DEFAULT_ALLOWED_DOCUMENT_TYPES;
  const maxFileSize = options?.maxFileSize ?? DEFAULT_MAX_FILE_SIZE;

  if (!(file instanceof File)) {
    throw new Error("A valid File instance is required.");
  }

  if (!file.size) {
    throw new Error("Cannot upload an empty file.");
  }

  if (file.size > maxFileSize) {
    throw new Error(
      `File is too large. Maximum size is ${Math.round(maxFileSize / (1024 * 1024))}MB.`,
    );
  }

  if (!file.type || !allowedTypes.includes(file.type)) {
    throw new Error(
      `Unsupported file type${file.type ? `: ${file.type}` : ""}.`,
    );
  }
}

export function createUploadPath(file: File, folder = "documents") {
  const originalName = file.name || "upload";
  const safeName = sanitizeFilename(originalName) || "upload";
  const normalizedFolder = folder.replace(/^\/+|\/+$/g, "") || "documents";

  return `${normalizedFolder}/${Date.now()}-${safeName}`;
}

export async function uploadDocument(
  file: File,
  options?: UploadDocumentOptions,
): Promise<UploadDocumentResult> {
  ensureValidFile(file, options);

  const pathname = createUploadPath(file, options?.folder);
  try {
    const uploaded = await put(pathname, file, {
      access: options?.access ?? "public",
      addRandomSuffix: options?.addRandomSuffix ?? true,
      contentType: file.type,
      cacheControlMaxAge: options?.cacheControlMaxAge,
      token: options?.token,
    });

    return {
      url: uploaded.url,
      downloadUrl: uploaded.downloadUrl,
      pathname: uploaded.pathname,
      contentType: file.type,
      contentDisposition: "inline",
      size: file.size,
      uploadedAt: new Date().toISOString(),
      originalFilename: file.name,
    };
  } catch (error) {
    console.error("Upload failed:", error);
    throw new Error("Failed to upload document. Please try again.");
  }
}

export async function uploadDocuments(
  files: File[],
  options?: UploadDocumentOptions,
) {
  return Promise.all(files.map((file) => uploadDocument(file, options)));
}

export const uploadFile = uploadDocument;
export const uploadFiles = uploadDocuments;
export const ALLOWED_DOCUMENT_TYPES = DEFAULT_ALLOWED_DOCUMENT_TYPES;
export const MAX_DOCUMENT_FILE_SIZE = DEFAULT_MAX_FILE_SIZE;
