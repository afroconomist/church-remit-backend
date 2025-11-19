import ObsClient from "esdk-obs-nodejs";
import { Readable } from "stream";
import ServiceUnavailableError from "@shared/error/service-unavailable.error";
import appConfig from "@config/app.config";
const pLimit = require("p-limit");
  
const obsClient = new ObsClient({
  access_key_id: appConfig.obs_credential.access_key_id,
  secret_access_key: appConfig.obs_credential.secret_access_key,
  server: appConfig.obs_credential.server,
});

const MAX_CONCURRENT_UPLOADS = appConfig.max_concurrent_uploads;

export async function uploadMultipart(
  bucketName: string,
  objectKey: string,
  fileBuffer: Buffer,
  mimeType: string
): Promise<string> {
  const initiateResult = await obsClient.initiateMultipartUpload({
    Bucket: bucketName,
    Key: objectKey,
    ContentType: mimeType,
  });

  if (initiateResult.CommonMsg.Status !== 200) {
    throw new ServiceUnavailableError("Failed to initiate multipart upload");
  }

  const uploadId = initiateResult.InterfaceResult.UploadId;
  const fileSize = fileBuffer.length;
  const partSize = calculatePartSize(fileSize);
  const partCount = Math.ceil(fileBuffer.length / partSize);
  const uploadPartPromises: Promise<any>[] = [];

  const limit = pLimit(MAX_CONCURRENT_UPLOADS);

  for (let i = 0; i < partCount; i++) {
    const start = i * partSize;
    const end = Math.min(start + partSize, fileBuffer.length);
    const partBuffer = fileBuffer.subarray(start, end);

    const uploadPartPromise = limit(() =>
      obsClient
        .uploadPart({
          Bucket: bucketName,
          Key: objectKey,
          PartNumber: i + 1,
          UploadId: uploadId,
          Body: Readable.from(partBuffer),
        })
        .then((result) => ({
          ETag: result.InterfaceResult.ETag,
          PartNumber: i + 1,
        }))
    );

    uploadPartPromises.push(uploadPartPromise);
  }

  const uploadResults = await Promise.all(uploadPartPromises);

  const completeResult = await obsClient.completeMultipartUpload({
    Bucket: bucketName,
    Key: objectKey,
    UploadId: uploadId,
    Parts: uploadResults,
  });

  if (completeResult.CommonMsg.Status !== 200) {
    throw new ServiceUnavailableError("Failed to complete multipart upload");
  }
  return `https://${bucketName}.${appConfig.obs_credential.server}/${objectKey}`;
}

function calculatePartSize(fileSize: number): number {
  const minPartSize = 5 * 1024 * 1024;
  const maxPartSize = 5 * 1024 * 1024 * 1024;

  let partSize = Math.ceil(fileSize / 10000);

  partSize = Math.max(partSize, minPartSize);

  partSize = Math.min(partSize, maxPartSize);

  return Math.ceil(partSize / (1024 * 1024)) * 1024 * 1024;
}