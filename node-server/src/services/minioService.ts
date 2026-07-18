/**
 * MinIO 对象存储服务
 *
 * 配置说明：
 * - MINIO_ENDPOINT: MinIO 服务地址（内部通信用，如 localhost）
 * - MINIO_PUBLIC_ENDPOINT: 外部访问域名（拼接文件 URL 用）
 * - MINIO_PORT: API 端口（默认 9000）
 * - MINIO_ACCESS_KEY / MINIO_SECRET_KEY
 * - MINIO_BUCKET: 存储桶名
 *
 * 文件路径规则：{type}/{subtype}/{filename}
 * type: images / videos / models / attachments
 * 示例路径：images/math/将军饮马示意图.png
 */
import * as Minio from 'minio';
import { config } from '../config.js';

const MINIO_CONFIG = {
  endPoint: config.minio?.endPoint || 'localhost',
  port: config.minio?.port || 9000,
  useSSL: config.minio?.useSSL || false,
  accessKey: config.minio?.accessKey || 'minio',
  secretKey: config.minio?.secretKey || 'minio123',
  bucket: config.minio?.bucket || 'zdknowledge',
  publicEndpoint: config.minio?.publicEndpoint || 'http://localhost:9000',
};

let client: Minio.Client | null = null;

function getClient(): Minio.Client {
  if (!client) {
    client = new Minio.Client({
      endPoint: MINIO_CONFIG.endPoint,
      port: MINIO_CONFIG.port,
      useSSL: MINIO_CONFIG.useSSL,
      accessKey: MINIO_CONFIG.accessKey,
      secretKey: MINIO_CONFIG.secretKey,
    });
  }
  return client;
}

/** 确保 bucket 存在 */
async function ensureBucket(): Promise<void> {
  const mc = getClient();
  const exists = await mc.bucketExists(MINIO_CONFIG.bucket);
  if (!exists) {
    await mc.makeBucket(MINIO_CONFIG.bucket);
    console.log(`[MinIO] 创建 bucket: ${MINIO_CONFIG.bucket}`);
  }
}

/** 生成可对外访问的文件 URL */
function getPublicUrl(objectPath: string): string {
  const base = MINIO_CONFIG.publicEndpoint.replace(/\/$/, '');
  return `${base}/${MINIO_CONFIG.bucket}/${objectPath}`;
}

/** 从 URL 中提取 object 相对路径 */
function extractObjectPath(url: string): string | null {
  const prefix = `${MINIO_CONFIG.publicEndpoint}/${MINIO_CONFIG.bucket}/`;
  if (url.startsWith(prefix)) {
    return url.substring(prefix.length);
  }
  return null;
}

export interface UploadOptions {
  /** 文件相对路径，如 images/math/将军饮马.png */
  objectPath: string;
  /** 文件 buffer */
  buffer: Buffer;
  /** MIME 类型 */
  mimeType: string;
  /** 是否可公开访问（默认 true） */
  public?: boolean;
}

export interface UploadResult {
  /** 相对路径 */
  objectPath: string;
  /** 完整可访问 URL */
  url: string;
  /** 文件大小（bytes） */
  size: number;
  /** MIME 类型 */
  mimeType: string;
}

/**
 * 上传文件到 MinIO
 * @returns 上传结果（含相对路径和完整 URL）
 */
export async function uploadFile(opts: UploadOptions): Promise<UploadResult> {
  await ensureBucket();
  const mc = getClient();
  const metaData: Record<string, string> = {
    'Content-Type': opts.mimeType,
  };
  if (opts.public ?? true) {
    // 公开读权限 — MinIO 支持通过 policy 控制
  }

  await mc.putObject(
    MINIO_CONFIG.bucket,
    opts.objectPath,
    opts.buffer,
    opts.buffer.length,
    metaData,
  );

  // 如果是图片，设置可公开访问
  if (opts.public ?? true) {
    try {
      await mc.setBucketPolicy(MINIO_CONFIG.bucket, JSON.stringify({
        Version: '2012-10-17',
        Statement: [{
          Effect: 'Allow',
          Principal: { AWS: ['*'] },
          Action: ['s3:GetObject'],
          Resource: [`arn:aws:s3:::${MINIO_CONFIG.bucket}/*`],
        }],
      }));
    } catch {
      // 已存在 policy 忽略
    }
  }

  return {
    objectPath: opts.objectPath,
    url: getPublicUrl(opts.objectPath),
    size: opts.buffer.length,
    mimeType: opts.mimeType,
  };
}

/**
 * 删除文件
 */
export async function deleteFile(objectPath: string): Promise<void> {
  const mc = getClient();
  await mc.removeObject(MINIO_CONFIG.bucket, objectPath);
}

/**
 * 获取文件下载流
 */
export async function getFile(objectPath: string): Promise<{
  stream: NodeJS.ReadableStream;
  stat: Minio.BucketItemStat;
}> {
  const mc = getClient();
  const stream = await mc.getObject(MINIO_CONFIG.bucket, objectPath);
  const stat = await mc.statObject(MINIO_CONFIG.bucket, objectPath);
  return { stream, stat };
}

/**
 * 列出 bucket 中的文件
 */
export async function listFiles(prefix?: string): Promise<Minio.BucketItem[]> {
  await ensureBucket();
  const mc = getClient();
  const objects: Minio.BucketItem[] = [];
  const stream = mc.listObjects(MINIO_CONFIG.bucket, prefix, true);
  return new Promise((resolve, reject) => {
    stream.on('data', (obj) => objects.push(obj));
    stream.on('end', () => resolve(objects));
    stream.on('error', reject);
  });
}

/**
 * 从 MinIO URL 获取文件信息
 */
export function getFileInfoFromUrl(url: string): { objectPath: string } | null {
  const objectPath = extractObjectPath(url);
  if (!objectPath) return null;
  return { objectPath };
}

export const minioConfig = MINIO_CONFIG;
