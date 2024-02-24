export type PutResult = {
  // cid in the case of ipfs
  // could have different meaning depending on the blob storage
  id: string;
};

export interface BlobStore {
  get<T>(key: string): Promise<T>;
  put(key: string, buffer: ArrayBuffer): Promise<PutResult>;
}
