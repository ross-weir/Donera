import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { BlobStore, PutResult } from "./blob";

// this is rushed as its only meant for use during hackathon
// after hackathon i will have time to move to a IPFS based solution
export class S3BlobStore implements BlobStore {
  private readonly s3: S3Client;
  private readonly bucket: string;
  private readonly cdn: string;

  constructor() {
    const bucket = process.env.DONERA_S3_BUCKET;

    if (!bucket) {
      throw new Error(`Missing env var DONERA_S3_BUCKET`);
    }

    const cdn = process.env.DONERA_CDN;

    if (!cdn) {
      throw new Error(`missing env var DONERA_CDN`);
    }

    this.cdn = cdn;
    this.bucket = bucket;
    this.s3 = new S3Client({
      region: process.env.DONERA_S3_REGION,
    });
  }

  getKey(key: string): string {
    return `${process.env.NEXT_PUBLIC_DONERA_NETWORK}/${key}`;
  }

  get<T>(key: string): Promise<T> {
    console.log(key);
    throw new Error("Method not implemented.");
  }

  async put(key: string, body: ArrayBuffer): Promise<PutResult> {
    const uploadKey = this.getKey(key);
    await this.s3.send(
      new PutObjectCommand({
        Bucket: this.bucket,
        Key: uploadKey,
        Body: Buffer.from(body),
      })
    );

    return {
      url: `${this.cdn}/${uploadKey}`,
    };
  }
}
