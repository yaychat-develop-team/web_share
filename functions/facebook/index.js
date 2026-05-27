function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
}

function getShareMeta(searchParams) {
  const title = searchParams.get('text') || 'Facebook Share'
  const coin = searchParams.get('coin') || ''
  const description = coin
    ? `Coin amount: ${coin}`
    : 'Share page prepared for Facebook Open Graph preview.'

  return { title, description }
}

export function onRequest({ request }) {
  const url = new URL(request.url)
  const queryString = url.search
  const meta = getShareMeta(url.searchParams)
  const siteUrl = url.origin
  const code = url.searchParams.get('inviteCode') || ''
  const landingUrl = new URL('/landing', siteUrl)

  if (code) {
    landingUrl.searchParams.set('code', code)
  }

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
  <meta property="og:image:type" content="image/png">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta property="og:image:alt" content="${escapeHtml(meta.title)}">
  <meta property="og:locale" content="zh_CN">
  <title>${escapeHtml(meta.title)}</title>
</head>
<body>
  <main>
    <h1>${escapeHtml(meta.title)}</h1>
    <p>${escapeHtml(meta.description)}</p>
    <img src="${escapeHtml(imageUrl)}" alt="${escapeHtml(meta.title)}" width="1200" height="630">
    <p><a href="${escapeHtml(landingUrl.href)}">Open landing page</a></p>
  </main>
  <script>
    if (!/facebookexternalhit|Facebot/i.test(navigator.userAgent)) {
      location.replace(${JSON.stringify(landingUrl.href)})
    }
  </script>
</body>
</html>`, {
    headers: {
      'content-type': 'text/html; charset=utf-8',
      'cache-control': 'public, max-age=60',
    },
  })
}
