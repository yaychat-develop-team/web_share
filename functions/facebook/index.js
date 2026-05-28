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
  const description = 'Join us, no face cam needed — stream from home and make money.'

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
  const imageUrl = new URL('/facebook/og.png', siteUrl)

  url.searchParams.forEach((value, key) => {
    imageUrl.searchParams.append(key, value)
  })
  imageUrl.searchParams.set('v', '20260528-svg-digits-point-v1')

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
  <meta property="og:image" content="${escapeHtml(imageUrl.href)}">
  <meta property="og:image:secure_url" content="${escapeHtml(imageUrl.href)}">
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
    <img src="${escapeHtml(imageUrl.href)}" alt="${escapeHtml(meta.title)}" width="1200" height="630">
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
