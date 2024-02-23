import { VercelBlobStore } from "./vercel";
import { BlobStore } from "./blob";

export function getBlobStore(): BlobStore {
  return new VercelBlobStore();
}
