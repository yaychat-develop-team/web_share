function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
}

function getShareMeta(hostname) {
  const title = hostname.includes('oumi')
    ? 'Oumi - Your voice, their story'
    : 'Yaychat-Voice chat room'
  const description = 'Join us, no face cam needed — stream from home and make money.'

  return { title, description }
}

export function onRequest({ request }) {
  const url = new URL(request.url)
  const queryString = url.search
  const meta = getShareMeta(url.hostname)
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
  <main class="loading-page" aria-busy="true">
    <section class="loading-card" aria-live="polite">
      <div class="spinner" aria-hidden="true"></div>
      <p>Loading...</p>
    </section>
    <section class="share-meta" aria-label="Share preview">
      <h1>${escapeHtml(meta.title)}</h1>
      <p>${escapeHtml(meta.description)}</p>
      <img src="${escapeHtml(imageUrl.href)}" alt="${escapeHtml(meta.title)}" width="1200" height="630">
      <p><a href="${escapeHtml(landingUrl.href)}">Open landing page</a></p>
    </section>
  </main>
  <style>
    html,
    body {
      width: 100%;
      min-height: 100%;
      margin: 0;
      background: #360387;
      color: #fff;
      font-family: Arial, sans-serif;
    }

    .loading-page {
      display: grid;
      min-height: 100vh;
      place-items: center;
    }

    .loading-card {
      display: grid;
      justify-items: center;
      gap: 16px;
    }

    .loading-card p {
      margin: 0;
      color: rgba(255, 255, 255, 0.82);
      font-size: 14px;
      line-height: 20px;
    }

    .spinner {
      width: 36px;
      height: 36px;
      border: 3px solid rgba(255, 255, 255, 0.28);
      border-top-color: #ffd400;
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
    }

    .share-meta {
      position: absolute;
      width: 1px;
      height: 1px;
      margin: -1px;
      padding: 0;
      overflow: hidden;
      clip: rect(0 0 0 0);
      white-space: nowrap;
      border: 0;
    }

    @keyframes spin {
      to {
        transform: rotate(360deg);
      }
    }
  </style>
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
