import { put } from "@vercel/blob";
import { BlobStore, PutResult } from "./blob";

export class VercelBlobStore implements BlobStore {
  get<T>(key: string): Promise<T> {
    console.log(key);
    throw new Error("Method not implemented.");
  }

  put(key: string, body: ArrayBuffer): Promise<PutResult> {
    return put(key, body, {
      access: "public",
    });
  }
}
