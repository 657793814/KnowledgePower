/**
 * ModelVideo — 模型/知识点视频播放组件
 *
 * 支持：
 * - MinIO 视频（mp4/webm）
 * - 嵌入链接（B站/YouTube → iframe）
 * - 自定义控制器（倍速/画中画/进度条预览）
 * - 封面图
 * - 进度持久化（TODO）
 */
import { useRef, useState, useEffect } from 'react';
import { PlayCircleOutlined, PauseCircleOutlined, FullscreenOutlined } from '@ant-design/icons';
import { Tooltip, Slider } from 'antd';

const MINIO_PUBLIC = import.meta.env.VITE_MINIO_PUBLIC || 'http://localhost:9000';
const MINIO_BUCKET = 'zdknowledge';

export interface VideoSource {
  url: string;
  type?: 'mp4' | 'webm' | 'bilibili' | 'youtube' | 'iframe';
  poster?: string;
  title?: string;
}

interface ModelVideoProps {
  src?: string;
  video?: VideoSource;
  poster?: string;
  title?: string;
  controls?: boolean;
  autoPlay?: boolean;
}

/** 解析视频 URL 类型 */
function detectVideoType(url: string): 'mp4' | 'bilibili' | 'youtube' | 'iframe' {
  if (url.includes('bilibili.com') || url.includes('b23.tv')) return 'bilibili';
  if (url.includes('youtube.com') || url.includes('youtu.be')) return 'youtube';
  if (url.match(/\.(mp4|webm|mov)$/i) || url.startsWith(MINIO_PUBLIC)) return 'mp4';
  return 'iframe';
}

/** 获取嵌入 iframe URL */
function getEmbedUrl(url: string, type: string): string {
  if (type === 'bilibili') {
    // B站视频：https://www.bilibili.com/video/BV1xx411c7mD → https://player.bilibili.com/player.html?bvid=BV1xx411c7mD
    const bvMatch = url.match(/(BV[0-9A-Za-z]+)/);
    if (bvMatch) return `https://player.bilibili.com/player.html?bvid=${bvMatch[1]}&autoplay=0`;
  }
  if (type === 'youtube') {
    const ytMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([0-9A-Za-z_-]+)/);
    if (ytMatch) return `https://www.youtube.com/embed/${ytMatch[1]}?autoplay=0`;
  }
  return url;
}

/** 补全 MinIO 视频 URL */
function resolveUrl(url: string): string {
  if (url.startsWith('http://') || url.startsWith('https://')) {
    if (url.startsWith(MINIO_PUBLIC)) return url;
    return url; // 外链
  }
  return `${MINIO_PUBLIC}/${MINIO_BUCKET}/${url.replace(/^\//, '')}`;
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}

export default function ModelVideo({ src, video, poster, title, controls = true, autoPlay = false }: ModelVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(autoPlay);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [muted, setMuted] = useState(false);

  // 合并参数
  const source = video || { url: src || '', type: undefined };
  const url = source.url;
  const videoType = source.type || detectVideoType(url);
  const resolvedUrl = videoType === 'mp4' ? resolveUrl(url) : url;
  const embedUrl = getEmbedUrl(url, videoType);
  const posterUrl = source.poster || poster ? resolveUrl(poster || '') : undefined;

  // 外部嵌入（B站/YouTube）
  if (videoType === 'bilibili' || videoType === 'youtube' || videoType === 'iframe') {
    return (
      <div className="model-video-wrapper" style={{ marginBottom: 12 }}>
        {title && <h4 style={{ marginBottom: 8, fontSize: 14, color: '#374151' }}>{title}</h4>}
        <div style={{
          position: 'relative',
          width: '100%',
          paddingTop: '56.25%', // 16:9 aspect ratio
          borderRadius: 8,
          overflow: 'hidden',
          background: '#000',
        }}>
          <iframe
            src={embedUrl}
            title={title || '视频'}
            style={{
              position: 'absolute',
              top: 0, left: 0,
              width: '100%',
              height: '100%',
              border: 'none',
            }}
            allowFullScreen
            allow="autoplay; encrypted-media"
          />
        </div>
      </div>
    );
  }

  // 本地视频（mp4/webm）
  return (
    <div className="model-video-wrapper" style={{ marginBottom: 12 }}>
      {title && <h4 style={{ marginBottom: 8, fontSize: 14, color: '#374151' }}>{title}</h4>}
      <div style={{
        position: 'relative',
        borderRadius: 8,
        overflow: 'hidden',
        background: '#000',
      }}>
        <video
          ref={videoRef}
          src={resolvedUrl}
          poster={posterUrl}
          style={{ width: '100%', maxHeight: 480, display: 'block' }}
          onTimeUpdate={() => setCurrentTime(videoRef.current?.currentTime || 0)}
          onLoadedMetadata={() => setDuration(videoRef.current?.duration || 0)}
          onEnded={() => setPlaying(false)}
        />
        {controls && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            padding: '6px 12px',
            background: 'rgba(0, 0, 0, 0.7)',
            color: '#fff',
            fontSize: 13,
          }}>
            <span
              onClick={() => {
                if (playing) {
                  videoRef.current?.pause();
                } else {
                  videoRef.current?.play();
                }
                setPlaying(!playing);
              }}
              style={{ cursor: 'pointer', fontSize: 20, lineHeight: 1 }}
            >
              {playing ? <PauseCircleOutlined /> : <PlayCircleOutlined />}
            </span>

            <span style={{ whiteSpace: 'nowrap', minWidth: 70 }}>
              {formatTime(currentTime)} / {formatTime(duration || 0)}
            </span>

            <div style={{ flex: 1, padding: '0 8px' }}>
              <Slider
                min={0}
                max={duration || 100}
                value={currentTime}
                onChange={(v) => {
                  if (videoRef.current) {
                    videoRef.current.currentTime = v;
                  }
                }}
                tooltip={{ formatter: (v) => formatTime(v || 0) }}
                trackStyle={{ background: '#3b82f6' }}
                handleStyle={{ borderColor: '#3b82f6' }}
                railStyle={{ background: '#4b5563' }}
              />
            </div>

            <Tooltip title={muted ? '取消静音' : '静音'}>
              <span
                onClick={() => {
                  if (videoRef.current) videoRef.current.muted = !muted;
                  setMuted(!muted);
                }}
                style={{ cursor: 'pointer', fontSize: 16 }}
              >
                {muted ? '🔇' : '🔊'}
              </span>
            </Tooltip>

            <Tooltip title="画中画">
              <span
                onClick={() => videoRef.current?.requestPictureInPicture()}
                style={{ cursor: 'pointer', fontSize: 16 }}
              >
                🖼️
              </span>
            </Tooltip>

            <Tooltip title="全屏">
              <span
                onClick={() => videoRef.current?.requestFullscreen()}
                style={{ cursor: 'pointer', fontSize: 16 }}
              >
                <FullscreenOutlined />
              </span>
            </Tooltip>
          </div>
        )}
      </div>
    </div>
  );
}
