/**
 * 素材上传路由
 *
 * 图片 → POST /upload/image
 * 视频 → POST /upload/video
 * 列表 → GET  /upload/list?prefix=...
 * 删除 → DELETE /upload/:objectPath
 *
 * 文件相对路径规则: {type}/{subtype}/{filename}
 * 例如: images/math/将军饮马.png, videos/demos/天体运动.mp4
 *
 * 前端通过拼接 MINIO_PUBLIC_ENDPOINT + /{bucket}/ + objectPath 获取完整 URL
 */
import { Router, Request, Response } from 'express';
import multer from 'multer';
import { uploadFile, deleteFile, listFiles, minioConfig } from '../services/minioService.js';
import { fail, ok } from '../utils/response.js';

const router = Router();

// multer 内存存储（直接 buffer，不写磁盘）
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 200 * 1024 * 1024, // 200MB max
  },
  fileFilter: (_req, file, cb) => {
    const allowedImageTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml', 'image/gif'];
    const allowedVideoTypes = ['video/mp4', 'video/webm', 'video/quicktime'];
    const allAllowed = [...allowedImageTypes, ...allowedVideoTypes];

    if (allAllowed.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error(`不支持的文件类型: ${file.mimetype}，支持: ${allAllowed.join(', ')}`));
    }
  },
});

/** 生成安全的文件相对路径 */
function makeObjectPath(type: string, subtype: string, originalname: string): string {
  const ext = originalname.split('.').pop()?.toLowerCase() || 'bin';
  // 清理文件名：去特殊字符，保留中英文数字和短横线下划线
  const basename = originalname
    .replace(/\.[^.]+$/, '')    // 去掉原扩展名
    .replace(/[^\w\u4e00-\u9fff-]/g, '_') // 保留中英文数字短横线
    .replace(/_+/g, '_')
    .slice(0, 80);

  return `${type}/${subtype}/${basename}.${ext}`;
}

/** 从请求路径参数中解码 object path */
function decodeObjectPath(raw: string): string {
  return Array.isArray(raw) ? raw.join('/') : raw;
}

// POST /upload/image — 上传图片
router.post('/image', upload.single('file'), async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return fail(res, 400, '请上传文件');
    }

    const subtype = (req.body.subtype || 'general').replace(/[^\w-]/g, '');
    const objectPath = makeObjectPath('images', subtype, req.file.originalname);

    const result = await uploadFile({
      objectPath,
      buffer: req.file.buffer,
      mimeType: req.file.mimetype,
    });

    return ok(res, {
      objectPath: result.objectPath,
      url: result.url,
      size: result.size,
      mimeType: result.mimeType,
      originalName: req.file.originalname,
    });
  } catch (err: any) {
    console.error('[upload] 图片上传失败:', err);
    return fail(res, 500, err.message || '上传失败');
  }
});

// POST /upload/video — 上传视频
router.post('/video', upload.single('file'), async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return fail(res, 400, '请上传文件');
    }

    const subtype = (req.body.subtype || 'general').replace(/[^\w-]/g, '');
    const objectPath = makeObjectPath('videos', subtype, req.file.originalname);

    const result = await uploadFile({
      objectPath,
      buffer: req.file.buffer,
      mimeType: req.file.mimetype,
    });

    return ok(res, {
      objectPath: result.objectPath,
      url: result.url,
      size: result.size,
      mimeType: result.mimeType,
      originalName: req.file.originalname,
    });
  } catch (err: any) {
    console.error('[upload] 视频上传失败:', err);
    return fail(res, 500, err.message || '上传失败');
  }
});

// POST /upload — 通用上传（自动判 type）
router.post('/', upload.single('file'), async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return fail(res, 400, '请上传文件');
    }

    const mime = req.file.mimetype;
    const type = mime.startsWith('video/') ? 'videos' : 'images';
    const subtype = (req.body.subtype || 'general').replace(/[^\w-]/g, '');
    const objectPath = makeObjectPath(type, subtype, req.file.originalname);

    const result = await uploadFile({
      objectPath,
      buffer: req.file.buffer,
      mimeType: mime,
    });

    return ok(res, {
      objectPath: result.objectPath,
      url: result.url,
      size: result.size,
      mimeType: result.mimeType,
      originalName: req.file.originalname,
    });
  } catch (err: any) {
    console.error('[upload] 上传失败:', err);
    return fail(res, 500, err.message || '上传失败');
  }
});

// GET /upload/list?prefix=images/math — 列出文件
router.get('/list', async (req: Request, res: Response) => {
  try {
    const prefix = (req.query.prefix as string) || '';
    const files = await listFiles(prefix);

    const items = files.map(f => ({
      objectPath: f.name,
      url: `${minioConfig.publicEndpoint}/${minioConfig.bucket}/${f.name}`,
      size: f.size,
      lastModified: f.lastModified,
    }));

    return ok(res, { prefix, items, total: items.length });
  } catch (err: any) {
    console.error('[upload] 文件列表查询失败:', err);
    return fail(res, 500, err.message || '查询失败');
  }
});

// DELETE /upload/:path(*) — 删除文件
router.delete('/*', async (req: Request, res: Response) => {
  try {
    const objectPath = decodeObjectPath(req.params[0] || '');
    if (!objectPath) {
      return fail(res, 400, '请指定文件路径');
    }
    await deleteFile(objectPath);
    return ok(res, { deleted: objectPath });
  } catch (err: any) {
    console.error('[upload] 删除失败:', err);
    return fail(res, 500, err.message || '删除失败');
  }
});

// multer 错误处理
router.use((err: any, _req: Request, res: Response, _next: any) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return fail(res, 413, '文件过大，最大支持 200MB');
    }
    return fail(res, 400, err.message);
  }
  if (err) {
    return fail(res, 400, err.message);
  }
});

export default router;
