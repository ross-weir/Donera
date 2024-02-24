export type PutResult = {
  url: string;
};

export interface BlobStore {
  get<T>(key: string): Promise<T>;
  put(key: string, buffer: ArrayBuffer): Promise<PutResult>;
}
