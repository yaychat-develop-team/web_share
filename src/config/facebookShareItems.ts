import shareItems from '../../share-items.json'

export type FacebookShareItem = {
  id: string
  title: string
  description: string
  image?: string
  updatedAt?: string
}

export const facebookShareItems = shareItems as Record<string, FacebookShareItem>

export function getFacebookShareItem(id: string | null | undefined) {
  if (!id) return null
  return facebookShareItems[id] || null
}
