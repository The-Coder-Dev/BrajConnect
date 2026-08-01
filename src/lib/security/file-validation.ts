/**
 * File Security & Magic Byte Validation Utility
 *
 * Task 4: Strict rejection of SVG files (preventing Stored XSS).
 * Task 5: Magic byte header inspection, buffer integrity, empty file checks, and signature verification.
 */

export const ALLOWED_IMAGE_MIME_TYPES: Set<string> = new Set([
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
]);

export const ALLOWED_DOCUMENT_MIME_TYPES: Set<string> = new Set([
  "application/pdf",
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
]);

export const MAX_IMAGE_SIZE_BYTES = 5 * 1024 * 1024; // 5MB
export const MAX_DOCUMENT_SIZE_BYTES = 10 * 1024 * 1024; // 10MB

/**
 * Checks if a buffer matches JPEG magic bytes (0xFF, 0xD8, 0xFF)
 */
function isJpeg(buffer: Buffer): boolean {
  if (buffer.length < 3) return false;
  return buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff;
}

/**
 * Checks if a buffer matches PNG magic bytes (0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A)
 */
function isPng(buffer: Buffer): boolean {
  if (buffer.length < 8) return false;
  return (
    buffer[0] === 0x89 &&
    buffer[1] === 0x50 &&
    buffer[2] === 0x4e &&
    buffer[3] === 0x47 &&
    buffer[4] === 0x0d &&
    buffer[5] === 0x0a &&
    buffer[6] === 0x1a &&
    buffer[7] === 0x0a
  );
}

/**
 * Checks if a buffer matches WebP magic bytes:
 * Bytes 0..3: "RIFF", Bytes 8..11: "WEBP"
 */
function isWebp(buffer: Buffer): boolean {
  if (buffer.length < 12) return false;
  const isRiff =
    buffer[0] === 0x52 &&
    buffer[1] === 0x49 &&
    buffer[2] === 0x46 &&
    buffer[3] === 0x46;
  const isWebpSignature =
    buffer[8] === 0x57 &&
    buffer[9] === 0x45 &&
    buffer[10] === 0x42 &&
    buffer[11] === 0x50;
  return isRiff && isWebpSignature;
}

/**
 * Checks if a buffer matches PDF magic bytes (%PDF- -> 0x25, 0x50, 0x44, 0x46, 0x2D)
 */
function isPdf(buffer: Buffer): boolean {
  if (buffer.length < 5) return false;
  return (
    buffer[0] === 0x25 &&
    buffer[1] === 0x50 &&
    buffer[2] === 0x44 &&
    buffer[3] === 0x46 &&
    buffer[4] === 0x2d
  );
}

/**
 * Detects if the buffer contains SVG or XML markers
 */
function isSvgOrXml(buffer: Buffer): boolean {
  const sample = buffer.slice(0, 1000).toString("utf8").toLowerCase();
  return sample.includes("<svg") || sample.includes("<?xml");
}

export interface FileValidationOptions {
  maxSizeBytes?: number;
  category?: "image" | "document";
}

export interface FileValidationResult {
  valid: boolean;
  detectedType: string | null;
  error?: string;
}

/**
 * Task 5: Validates buffer integrity, non-emptiness, maximum file size, SVG rejection, and magic byte signatures.
 */
export function validateFileMagicBytes(
  buffer: Buffer,
  declaredMimeType: string,
  options: FileValidationOptions = {}
): FileValidationResult {
  // 1. Empty or null buffer check
  if (!buffer || !(buffer instanceof Buffer) || buffer.length === 0) {
    return { valid: false, detectedType: null, error: "Uploaded file is empty or corrupted." };
  }

  // 2. Minimum header length check (at least 3 bytes for basic signature)
  if (buffer.length < 3) {
    return { valid: false, detectedType: null, error: "File buffer is corrupted or truncated." };
  }

  // 3. Maximum size check
  const defaultMaxSize = options.category === "document" ? MAX_DOCUMENT_SIZE_BYTES : MAX_IMAGE_SIZE_BYTES;
  const maxAllowed = options.maxSizeBytes || defaultMaxSize;

  if (buffer.length > maxAllowed) {
    const sizeInMB = Math.round(maxAllowed / (1024 * 1024));
    return { valid: false, detectedType: null, error: `File size exceeds maximum allowed limit of ${sizeInMB}MB.` };
  }

  // 4. SVG/XML rejection check
  if (isSvgOrXml(buffer)) {
    return {
      valid: false,
      detectedType: "image/svg+xml",
      error: "SVG file format is strictly prohibited for security reasons.",
    };
  }

  // 5. Binary magic byte inspection
  let detectedType: string | null = null;

  if (isJpeg(buffer)) {
    detectedType = "image/jpeg";
  } else if (isPng(buffer)) {
    detectedType = "image/png";
  } else if (isWebp(buffer)) {
    detectedType = "image/webp";
  } else if (isPdf(buffer)) {
    detectedType = "application/pdf";
  }

  if (!detectedType) {
    return {
      valid: false,
      detectedType: null,
      error: "Unsupported file signature or untrusted binary content.",
    };
  }

  const normalizedDeclared = declaredMimeType.toLowerCase().trim();
  const isDeclaredJpeg = normalizedDeclared === "image/jpeg" || normalizedDeclared === "image/jpg";

  if (detectedType === "image/jpeg" && isDeclaredJpeg) {
    return { valid: true, detectedType: "image/jpeg" };
  }

  if (detectedType === normalizedDeclared) {
    return { valid: true, detectedType };
  }

  return {
    valid: false,
    detectedType,
    error: `File content mismatch. Signature detected ${detectedType} but declared ${declaredMimeType}.`,
  };
}
