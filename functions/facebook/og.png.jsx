import React from 'react'
import { ImageResponse } from '@cloudflare/pages-plugin-vercel-og/api'

const digitWidths = {
  '0': 76,
  '1': 48,
  '2': 64,
  '3': 64,
  '4': 72,
  '5': 72,
  '6': 72,
  '7': 68,
  '8': 68,
  '9': 68,
}

export async function onRequest({ request }) {
  const url = new URL(request.url)
  const coin = (url.searchParams.get('coin') || '').replace(/\D/g, '')
  const backgroundImage = new URL('/share/facebook-share-og.png', request.url).href
  const unitImage = new URL('/share/unit.svg', request.url).href
  const digits = coin.split('').filter((digit) => digit in digitWidths)

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
        src={backgroundImage}
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
      {digits.length > 0 ? (
        <div
          style={{
            position: 'absolute',
            top: 150,
            left: 97,
            display: 'flex',
            alignItems: 'flex-start',
            gap: 6,
          }}
        >
          <img src={unitImage} width="60" height="78" />
          {digits.map((digit, index) => (
            <img
              key={`${digit}-${index}`}
              src={new URL(`/share/${digit}.svg`, request.url).href}
              width={digitWidths[digit]}
              height="78"
            />
          ))}
        </div>
      ) : null}
    </div>,
    {
      width: 1200,
      height: 630,
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
