/**
 * ModelImage — 模型/知识点配图展示组件
 *
 * 支持：
 * - MinIO 完整 URL 或相对路径自动补全
 * - 点击放大预览（antd Image）
 * - 懒加载 + 加载态骨架屏
 * - 图题说明
 * - 多图画廊模式
 */
import { useState } from 'react';
import { Image, Skeleton } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';

const MINIO_PUBLIC = import.meta.env.VITE_MINIO_PUBLIC || 'http://localhost:9000';
const MINIO_BUCKET = 'zdknowledge';

export interface ImageItem {
  url: string;
  alt?: string;
  caption?: string;
  width?: number;
  height?: number;
}

interface ModelImageProps {
  /** 单图 URL（相对或绝对） */
  src?: string;
  /** 图片信息列表（画廊模式） */
  images?: ImageItem[];
  /** 替代文本 */
  alt?: string;
  /** 图题说明 */
  caption?: string;
  /** 图片宽度 */
  width?: number | string;
  /** 是否展示标题 */
  showCaption?: boolean;
}

/** 补全为完整的 MinIO 可访问 URL */
function resolveUrl(url: string): string {
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }
  // 相对路径 → 补全 MinIO 地址
  const clean = url.replace(/^\//, '');
  return `${MINIO_PUBLIC}/${MINIO_BUCKET}/${clean}`;
}

export default function ModelImage({
  src, images, alt, caption, width, showCaption = true,
}: ModelImageProps) {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  // 单图模式
  if (src) {
    const fullUrl = resolveUrl(src);
    return (
      <div className="model-image-wrapper" style={{ marginBottom: 12 }}>
        {!loaded && !error && (
          <Skeleton.Image style={{ width: width || 400, height: 240 }} active />
        )}
        {error ? (
          <div style={{
            padding: 40, textAlign: 'center', color: '#94a3b8',
            background: '#f8fafc', borderRadius: 8, border: '1px dashed #d1d5db',
          }}>
            <LoadingOutlined style={{ fontSize: 24 }} />
            <p style={{ marginTop: 8, fontSize: 13 }}>图片加载失败</p>
          </div>
        ) : (
          <Image
            src={fullUrl}
            alt={alt || ''}
            style={{
              maxWidth: width || '100%',
              borderRadius: 8,
              display: loaded ? 'block' : 'none',
            }}
            onLoad={() => setLoaded(true)}
            onError={() => setError(true)}
            preview={{ mask: '点击查看大图' }}
          />
        )}
        {showCaption && caption && (
          <div style={{ fontSize: 13, color: '#64748b', textAlign: 'center', marginTop: 6, fontStyle: 'italic' }}>
            {caption}
          </div>
        )}
      </div>
    );
  }

  // 画廊模式
  if (images && images.length > 0) {
    return (
      <div className="model-image-gallery" style={{ marginBottom: 12 }}>
        <Image.PreviewGroup>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
            {images.map((img, i) => {
              const fullUrl = resolveUrl(img.url);
              return (
                <div key={i} style={{ flex: '0 0 auto', maxWidth: img.width || 300 }}>
                  <Image
                    src={fullUrl}
                    alt={img.alt || ''}
                    style={{ borderRadius: 8, maxHeight: 240, objectFit: 'cover' }}
                    preview={{ mask: '查看大图' }}
                  />
                  {showCaption && img.caption && (
                    <div style={{ fontSize: 12, color: '#64748b', textAlign: 'center', marginTop: 4 }}>
                      {img.caption}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </Image.PreviewGroup>
      </div>
    );
  }

  return null;
}

/** 最小样式 */
export const modelImageStyles = `
.model-image-wrapper {
  position: relative;
}
.model-image-wrapper .ant-image {
  display: block;
}
.model-image-gallery .ant-image {
  display: block;
}
`;
