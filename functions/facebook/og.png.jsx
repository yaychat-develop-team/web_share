import React from 'react'
import { ImageResponse } from '@cloudflare/pages-plugin-vercel-og/api'

async function loadPoppinsBlack(request) {
  const fontUrl = new URL('/fonts/poppins-latin-900-normal.woff', request.url)
  const response = await fetch(fontUrl)
  if (!response.ok) return null
  return response.arrayBuffer()
}

/**
 * Workers 上对超大数组做 String.fromCharCode(...chunk) 会参数过多导致运行时异常（1101）。
 * 改用 apply + 小段切片。
 */
function arrayBufferToBase64(buffer) {
  const bytes = new Uint8Array(buffer)
  let binary = ''
  const chunkSize = 4096

  for (let i = 0; i < bytes.length; i += chunkSize) {
    const chunk = bytes.subarray(i, i + chunkSize)
    binary += String.fromCharCode.apply(null, chunk)
  }

  return btoa(binary)
}

async function loadBackgroundImage(request) {
  try {
    const imageUrl = new URL('/share/facebook-share.webp', request.url)
    const response = await fetch(imageUrl)
    if (!response.ok) return null

    const imageBuffer = await response.arrayBuffer()
    return `data:image/webp;base64,${arrayBufferToBase64(imageBuffer)}`
  } catch {
    return null
  }
}

export async function onRequest({ request }) {
  const url = new URL(request.url)
  const coin = url.searchParams.get('coin') || ''
  const backgroundImage = await loadBackgroundImage(request)
  const fontData = await loadPoppinsBlack(request)

  // ImageResponse 使用异步 ReadableStream。在 Cloudflare 边缘上，未命中缓存时
  // 有可能在流尚未 enqueue 之前就把响应交给 CDN，导致 Facebook 等爬虫收到 0 字节
  // 的 “PNG”（调试工具报图片损坏）。先 arrayBuffer() 再返回可保证 body 完整。
  const imageResponse = new ImageResponse(
    <div
      style={{
        position: 'relative',
        width: 1200,
        height: 630,
        display: 'flex',
      }}
    >
      <img
        src={backgroundImage || new URL('/share/facebook-share.webp', request.url).href}
        width="1200"
        height="630"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: 1200,
          height: 630,
        }}
      />
      {coin ? (
        <div
          style={{
            position: 'absolute',
            top: 138,
            left: 97,
            display: 'flex',
            alignItems: 'center',
            fontFamily: 'Poppins',
            fontWeight: 900,
            fontSize: 98,
            lineHeight: 1,
            color: '#FDE42B',
            letterSpacing: '-0.02em',
            // Satori 不支持 SVG <text>；用 div + 字体描边近似原渐变描边样式
            WebkitTextStroke: '6px #000000',
          }}
        >
          {coin}
        </div>
      ) : null}
    </div>,
    {
      width: 1200,
      height: 630,
      fonts: fontData
        ? [{ name: 'Poppins', data: fontData, weight: 900, style: 'normal' }]
        : undefined,
      headers: {
        'cache-control': 'public, max-age=60',
      },
    },
  )

  const png = await imageResponse.arrayBuffer()
  return new Response(png, {
    status: imageResponse.status,
    statusText: imageResponse.statusText,
    headers: {
      'content-type': 'image/png',
      'cache-control': 'public, max-age=60',
    },
  })
}
