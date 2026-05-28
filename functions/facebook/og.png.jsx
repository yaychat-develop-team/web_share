import React from 'react'
import { ImageResponse } from '@cloudflare/pages-plugin-vercel-og/api'

const digitWidths = {
  '0': 59,
  '1': 34,
  '2': 52,
  '3': 53,
  '4': 60,
  '5': 53,
  '6': 53,
  '7': 49,
  '8': 56,
  '9': 54,
}

const pointWidth = 39

function getCoinTokens(coin) {
  const tokens = []
  const firstGroupLength = coin.length % 3 || 3

  coin.split('').forEach((digit, index) => {
    if (index > 0 && (index - firstGroupLength) % 3 === 0) {
      tokens.push('point')
    }
    tokens.push(digit)
  })

  return tokens
}

export async function onRequest({ request }) {
  const url = new URL(request.url)
  const coin = (url.searchParams.get('coin') || '').replace(/\D/g, '')
  const backgroundImage = new URL('/share/facebook-share-og.png', request.url).href
  const unitImage = new URL('/share/unit.svg', request.url).href
  const coinTokens = getCoinTokens(coin).filter((token) => token === 'point' || token in digitWidths)

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
      {coinTokens.length > 0 ? (
        <div
          style={{
            position: 'absolute',
            top: 170,
            left: 97,
            display: 'flex',
            alignItems: 'flex-start',
            gap: 2,
          }}
        >
          <img src={unitImage} width="60" height="78" />
          {coinTokens.map((token, index) => (
            <img
              key={`${token}-${index}`}
              src={new URL(`/share/${token === 'point' ? 'point' : token}.svg`, request.url).href}
              width={token === 'point' ? pointWidth : digitWidths[token]}
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
