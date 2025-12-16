import { Skeleton, Image } from 'antd';
import React, { useState, useEffect } from 'react';

export const LoadingImage: React.FC<{ url: string; uid: string }> = ({ url, uid }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // 当 url 变化时重置状态（可选，适用于动态切换图片）
  useEffect(() => {
    setLoading(true);
    setError(false);
  }, [url]);

  return (
    <div style={{ width: 80, height: 80, position: 'relative' }}>
      {/* 骨架屏：加载中 */}
      {loading && !error && (
        <Skeleton.Avatar
          active
          size={80}
          shape="square"
          style={{
            borderRadius: 8,
            position: 'absolute',
            top: 0,
            left: 0,
            zIndex: 1,
          }}
        />
      )}

      {/* 错误占位 */}
      {error && (
        <div
          style={{
            width: 80,
            height: 80,
            backgroundColor: '#f5f5f5',
            borderRadius: 8,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#999',
            fontSize: 12,
          }}
        >
          ❌
        </div>
      )}

      {/* 隐藏的 img：用于监听加载状态 */}
      <img
        src={url}
        alt={`monitor-${uid}`}
        onLoad={() => setLoading(false)}
        onError={() => {
          setLoading(false);
          setError(true);
        }}
        style={{ display: 'none' }} // 完全隐藏，只用于触发事件
      />

      {/* 加载成功后显示 */}
      {!loading && !error && (
        <Image
          src={url}
          alt={`preview-${uid}`}
          preview // 点击放大
          style={{
            width: 80,
            height: 80,
            borderRadius: 8,
            objectFit: 'cover',
          }}
        />
      )}
    </div>
  );
};