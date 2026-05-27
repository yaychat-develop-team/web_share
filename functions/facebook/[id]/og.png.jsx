import React from 'react'
import { ImageResponse } from '@cloudflare/pages-plugin-vercel-og/api'
import shareItems from '../../../share-items.json'

function getShareMeta(id) {
  const item = shareItems[id]

  return {
    title: item?.title || 'Facebook Share',
    description: item?.description || 'Share page prepared for Facebook Open Graph preview.',
  }
}

async function loadFont(request) {
  const fontUrl = new URL('/fonts/NotoSansCJKsc-Regular.otf', request.url)
  const response = await fetch(fontUrl)

  if (!response.ok) return null
  return response.arrayBuffer()
}

export async function onRequest({ params, request }) {
  const meta = getShareMeta(params.id)
  const fontData = await loadFont(request)

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
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 28,
        }}
      >
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
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <div
            style={{
              fontSize: 34,
              fontWeight: 700,
              letterSpacing: 0,
              color: '#334155',
            }}
          >
            Facebook Share
          </div>
          <div
            style={{
              marginTop: 8,
              fontSize: 24,
              color: '#64748b',
            }}
          >
            Dynamic Open Graph preview
          </div>
        </div>
      </div>

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <div
          style={{
            fontSize: 72,
            lineHeight: 1.1,
            fontWeight: 800,
            letterSpacing: 0,
          }}
        >
          {meta.title}
        </div>
        <div
          style={{
            marginTop: 28,
            maxWidth: 920,
            fontSize: 34,
            lineHeight: 1.35,
            color: '#475569',
          }}
        >
          {meta.description}
        </div>
      </div>

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontSize: 24,
          color: '#64748b',
        }}
      >
        <div>facebook-share-e55.pages.dev</div>
        <div>1200 x 630</div>
      </div>
    </div>,
    {
      width: 1200,
      height: 630,
      fonts: fontData
        ? [
            {
              name: 'Noto Sans CJK SC',
              data: fontData,
              style: 'normal',
            },
          ]
        : undefined,
    },
  )
}
