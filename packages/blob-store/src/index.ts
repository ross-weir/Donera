import { BlobStore } from "./blob";
import { S3BlobStore } from "./s3";

export function getBlobStore(): BlobStore {
  console.log("Using s3 backend for blob store");
  return new S3BlobStore();
}
