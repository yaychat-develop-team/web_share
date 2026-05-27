import poppins400Latin from '@fontsource/poppins/files/poppins-latin-400-normal.woff2'

function addPreload(href: string, as: string, fetchPriority: 'high' | 'low' | 'auto' = 'auto') {
  const link = document.createElement('link')
  link.rel = 'preload'
  link.as = as
  link.href = href
  if (fetchPriority !== 'auto') {
    ;(link as HTMLLinkElement & { fetchPriority?: string }).fetchPriority = fetchPriority
  }
  if (as === 'font') link.crossOrigin = 'anonymous'
  document.head.appendChild(link)
}

export function preloadGlobalAssets() {
  addPreload(poppins400Latin, 'font', 'high')
}
