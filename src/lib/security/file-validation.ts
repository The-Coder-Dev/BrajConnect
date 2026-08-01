/**
 * File Security & Magic Byte Validation Utility
 *
 * Enforces Task 4 (Strict rejection of SVG files to prevent Stored XSS)
 * and Task 5 (Verifying file signatures via magic bytes for raster images & PDFs).
 */

export type AllowedRasterImageType = "image/jpeg" | "image/png" | "image/webp";
export type AllowedDocumentType = "application/pdf" | AllowedRasterImageType;

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
 * Bytes 0..3: "RIFF" (0x52, 0x49, 0x46, 0x46)
 * Bytes 8..11: "WEBP" (0x57, 0x45, 0x42, 0x50)
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
 * Detects if the buffer contains SVG or XML markers (e.g. <svg, <?xml)
 */
function isSvgOrXml(buffer: Buffer): boolean {
  const sample = buffer.slice(0, 1000).toString("utf8").toLowerCase();
  return sample.includes("<svg") || sample.includes("<?xml");
}

export interface FileValidationResult {
  valid: boolean;
  detectedType: string | null;
  error?: string;
}

/**
 * Validates the file buffer magic bytes against expected MIME types.
 * Strictly rejects SVG, HTML, and unrecognized formats.
 */
export function validateFileMagicBytes(
  buffer: Buffer,
  declaredMimeType: string
): FileValidationResult {
  // Reject empty or corrupt buffers
  if (!buffer || buffer.length === 0) {
    return { valid: false, detectedType: null, error: "Empty file content." };
  }

  // Reject SVG/XML immediately regardless of claimed MIME type or extension
  if (isSvgOrXml(buffer)) {
    return {
      valid: false,
      detectedType: "image/svg+xml",
      error: "SVG file format is not allowed for security reasons.",
    };
  }

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
      error: "Unsupported file content or unrecognized file signature.",
    };
  }

  const normalizedDeclared = declaredMimeType.toLowerCase().trim();
  const isDeclaredJpeg =
    normalizedDeclared === "image/jpeg" || normalizedDeclared === "image/jpg";

  // Match check
  if (detectedType === "image/jpeg" && isDeclaredJpeg) {
    return { valid: true, detectedType: "image/jpeg" };
  }

  if (detectedType === normalizedDeclared) {
    return { valid: true, detectedType };
  }

  return {
    valid: false,
    detectedType,
    error: `File signature mismatch. Detected ${detectedType} but declared ${declaredMimeType}.`,
  };
}
