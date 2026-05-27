import React from 'react'
import { ImageResponse } from '@cloudflare/pages-plugin-vercel-og/api'

async function loadFont(request) {
  const fontUrl = new URL('/fonts/NotoSansCJKsc-Regular.otf', request.url)
  const response = await fetch(fontUrl)
  if (!response.ok) return null
  return response.arrayBuffer()
}

export async function onRequest({ request }) {
  const url = new URL(request.url)
  const params = Object.fromEntries(url.searchParams)
  const entries = Object.entries(params)

  const fontData = await loadFont(request)
  const hasParams = entries.length > 0

  return new ImageResponse(
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: 72,
        background: '#f8fafc',
        color: '#0f172a',
        fontFamily: fontData ? 'Noto Sans CJK SC' : 'sans-serif',
      }}
    >
      {/* 顶部：Facebook 标识 */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 28 }}>
        <div
          style={{
            width: 104,
            height: 104,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 52,
            background: '#1877f2',
            color: '#ffffff',
            fontSize: 72,
            fontWeight: 700,
          }}
        >
          f
        </div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ fontSize: 34, fontWeight: 700, color: '#334155' }}>
            Facebook Share
          </div>
          <div style={{ marginTop: 8, fontSize: 24, color: '#64748b' }}>
            Dynamic Open Graph preview
          </div>
        </div>
      </div>

      {/* 中间：动态参数展示 */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        {hasParams ? (
          entries.map(([key, value]) => (
            <div
              key={key}
              style={{
                display: 'flex',
                alignItems: 'baseline',
                gap: 28,
              }}
            >
              <span
                style={{
                  fontSize: 44,
                  fontWeight: 700,
                  color: '#64748b',
                }}
              >
                {key}
              </span>
              <span
                style={{
                  fontSize: 44,
                  fontWeight: 800,
                  color: '#1877f2',
                }}
              >
                {value}
              </span>
            </div>
          ))
        ) : (
          <div
            style={{
              fontSize: 72,
              lineHeight: 1.1,
              fontWeight: 800,
            }}
          >
            Facebook Share
          </div>
        )}
      </div>

      {/* 底部 */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontSize: 24,
          color: '#64748b',
        }}
      >
        <div>{url.hostname}</div>
        <div>1200 x 630</div>
      </div>
    </div>,
    {
      width: 1200,
      height: 630,
      fonts: fontData
        ? [{ name: 'Noto Sans CJK SC', data: fontData, style: 'normal' }]
        : undefined,
    },
  )
}
