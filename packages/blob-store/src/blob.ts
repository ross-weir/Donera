import { Readable } from "stream";

export type PutBody = string | Readable | Buffer | Blob | ArrayBuffer | ReadableStream | File;
export type PutResult = {
  url: string;
  contentType: string;
};

export interface BlobStore {
  get<T>(key: string): Promise<T>;
  put(key: string, body: PutBody): Promise<PutResult>;
}
