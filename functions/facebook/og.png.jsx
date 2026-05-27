import React from 'react'
import { ImageResponse } from '@cloudflare/pages-plugin-vercel-og/api'

async function loadPoppinsBlack(request) {
  const fontUrl = new URL('/fonts/poppins-latin-900-normal.woff', request.url)
  const response = await fetch(fontUrl)
  if (!response.ok) return null
  return response.arrayBuffer()
}

export async function onRequest({ request }) {
  const url = new URL(request.url)
  const coin = url.searchParams.get('coin') || ''
  const backgroundImage = new URL('/share/facebook-share.webp', request.url).href
  const fontData = await loadPoppinsBlack(request)

  return new ImageResponse(
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
      {coin ? (
        <svg
          width="900"
          height="130"
          viewBox="0 0 900 130"
          style={{
            position: 'absolute',
            top: 138,
            left: 97,
          }}
        >
          <defs>
            <linearGradient id="coinGradient" x1="0" y1="0" x2="0" y2="130" gradientUnits="userSpaceOnUse">
              <stop offset="26.98%" stopColor="#F1FF4B" />
              <stop offset="73.02%" stopColor="#FDE42B" />
            </linearGradient>
          </defs>
          <text
            x="0"
            y="98"
            fill="url(#coinGradient)"
            stroke="#000000"
            strokeWidth="6"
            paintOrder="stroke"
            fontFamily="Poppins"
            fontSize="98"
            fontWeight="900"
          >
            {coin}
          </text>
        </svg>
      ) : null}
    </div>,
    {
      width: 1200,
      height: 630,
      fonts: fontData
        ? [{ name: 'Poppins', data: fontData, weight: 900, style: 'normal' }]
        : undefined,
    },
  )
}
