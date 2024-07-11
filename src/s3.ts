import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';

const bucketName = (import.meta as any).env.VITE_APP_BUCKET;

const s3 = new S3Client({
  region: 'us-east-1',
  credentials: {
    accessKeyId: (import.meta as any).env.VITE_APP_S3_KEY,
    secretAccessKey: (import.meta as any).env.VITE_APP_S3_SECRET,
  },
});

export const loadS3Data = async () => {
  const command = new GetObjectCommand({
    Bucket: bucketName,
    Key: 'data.json',
  });

  try {
    const { Body } = await s3.send(command);
    const bodyContents = await new Response(Body as any).json();
    return bodyContents;
  } catch (err) {
    console.error('Error', err);
  }
};
