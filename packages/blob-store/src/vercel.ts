import { put } from "@vercel/blob";
import { BlobStore, PutBody, PutResult } from "./blob";

export class VercelBlobStore implements BlobStore {
  get<T>(key: string): Promise<T> {
    throw new Error("Method not implemented.");
    console.log(key);
  }

  put(key: string, body: PutBody): Promise<PutResult> {
    return put(key, body);
  }
}
