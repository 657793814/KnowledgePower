import { Spin } from 'antd';

export function Loading() {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 300 }}>
      <Spin size="large" tip="加载中..." />
    </div>
  );
}
