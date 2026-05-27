const siteUrl = 'https://facebook-share-e55.pages.dev'

import shareItems from '../../share-items.json'

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
}

function getShareMeta(id) {
  const item = shareItems[id]
  const pageUrl = `${siteUrl}/facebook/${encodeURIComponent(id)}`
  const imageVersion = encodeURIComponent(item?.updatedAt || 'default')

  return {
    title: item?.title || 'Facebook Share',
    description: item?.description || 'Share page prepared for Facebook Open Graph preview.',
    image: item?.image || `${pageUrl}/og.png?v=${imageVersion}`,
  }
}

export function onRequest({ params }) {
  const id = params.id
  const meta = getShareMeta(id)
  const pageUrl = `${siteUrl}/facebook/${encodeURIComponent(id)}`
  const appUrl = `/facebook?id=${encodeURIComponent(id)}`

  return new Response(`<!doctype html>
<html lang="zh-CN">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <meta name="description" content="${escapeHtml(meta.description)}">
  <meta property="og:url" content="${escapeHtml(pageUrl)}">
  <meta property="og:type" content="website">
  <meta property="og:title" content="${escapeHtml(meta.title)}">
  <meta property="og:description" content="${escapeHtml(meta.description)}">
  <meta property="og:image" content="${escapeHtml(meta.image)}">
  <meta property="og:image:secure_url" content="${escapeHtml(meta.image)}">
  <meta property="og:image:type" content="image/webp">
  <meta property="og:image:width" content="3600">
  <meta property="og:image:height" content="1890">
  <meta property="og:image:alt" content="${escapeHtml(meta.title)}">
  <meta property="og:locale" content="zh_CN">
  <title>${escapeHtml(meta.title)}</title>
</head>
<body>
  <script>location.replace(${JSON.stringify(appUrl)})</script>
  <noscript><a href="${escapeHtml(appUrl)}">打开分享页面</a></noscript>
</body>
</html>`, {
    headers: {
      'content-type': 'text/html; charset=utf-8',
      'cache-control': 'public, max-age=60',
    },
  })
}
