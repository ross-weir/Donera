import { BlobStore } from "./blob";
import { ChainsafeBlobStore } from "./chainsafe";

export function newBlobStore(): BlobStore {
  return new ChainsafeBlobStore();
}
