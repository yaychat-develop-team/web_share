function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
}

function getShareMeta(searchParams) {
  const entries = Object.fromEntries(searchParams)
  const pairs = Object.entries(entries)

  if (pairs.length === 0) {
    return {
      title: 'Facebook Share',
      description: 'Share page prepared for Facebook Open Graph preview.',
    }
  }

  const title = pairs.map(([k, v]) => `${k}: ${v}`).join('  |  ')
  const description = pairs.map(([k, v]) => `${k}=${v}`).join('&')

  return { title, description }
}

export function onRequest({ request }) {
  const url = new URL(request.url)
  const queryString = url.search
  const meta = getShareMeta(url.searchParams)
  const siteUrl = url.origin

  const pageUrl = `${siteUrl}/facebook${queryString}`
  const imageUrl = `${siteUrl}/facebook/og.png${queryString}`

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
  <meta property="og:image" content="${escapeHtml(imageUrl)}">
  <meta property="og:image:secure_url" content="${escapeHtml(imageUrl)}">
  <meta property="og:image:type" content="image/webp">
  <meta property="og:image:width" content="3600">
  <meta property="og:image:height" content="1890">
  <meta property="og:image:alt" content="${escapeHtml(meta.title)}">
  <meta property="og:locale" content="zh_CN">
  <title>${escapeHtml(meta.title)}</title>
</head>
<body>
  <script>location.replace('/facebook${queryString}')</script>
  <noscript><a href="${escapeHtml('/facebook' + queryString)}">打开分享页面</a></noscript>
</body>
</html>`, {
    headers: {
      'content-type': 'text/html; charset=utf-8',
      'cache-control': 'public, max-age=60',
    },
  })
}
