import { getEnvVarOrThrow } from "@donera/core";
import { BlobStore, PutResult } from "./blob";

export class ChainsafeBlobStore implements BlobStore {
  private readonly apiUrl: string;
  private readonly bucketId: string;

  constructor() {
    this.apiUrl = getEnvVarOrThrow("CHAINSAFE_API_URL");
    this.bucketId = getEnvVarOrThrow("CHAINSAFE_BUCKET_ID");
  }

  get<T>(): Promise<T> {
    throw new Error("Method not implemented.");
  }

  async put(key: string, buffer: ArrayBuffer): Promise<PutResult> {
    const formData = new FormData();

    formData.append("file", new Blob([buffer]), key);
    formData.append("path", "/");

    const response = await fetch(`${this.apiUrl}/api/v1/bucket/${this.bucketId}/upload`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.CHAINSAFE_STORAGE_API_KEY}`,
      },
      body: formData,
    });
    const json = await response.json();
    const data = json.files_details[0]!;

    return { id: data.cid };
  }
}
