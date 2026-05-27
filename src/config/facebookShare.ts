import { getFacebookShareItem } from './facebookShareItems'

const appBaseUrl = new URL(import.meta.env.BASE_URL, window.location.origin)

function toAbsoluteUrl(pathOrUrl: string) {
  return new URL(pathOrUrl, appBaseUrl).href
}

/**
 * Facebook 分享配置。
 *
 * 注意：Facebook 抓取分享信息时主要读取 URL 首次返回的 HTML。
 * 如果分享标题、描述、图片需要按活动或用户动态变化，生产环境应使用 SSR、
 * 预渲染或后端模板在 HTML 中直接输出对应 Open Graph 标签；仅在客户端
 * 运行后再修改 meta 标签，通常无法保证被 Facebook 爬虫读取。
 */
const activeShareId = new URLSearchParams(window.location.search).get('id')
const activeShareItem = getFacebookShareItem(activeShareId)
const defaultShareImage = toAbsoluteUrl(import.meta.env.VITE_FACEBOOK_SHARE_IMAGE || 'share/facebook-share.webp')
const activeShareUrl = activeShareId ? `facebook/${encodeURIComponent(activeShareId)}` : ''
const activeShareImageVersion = encodeURIComponent(activeShareItem?.updatedAt || 'default')

export const facebookShareConfig = {
  /**
   * 分享页面的规范 URL。
   *
   * Facebook 建议 `og:url` 使用稳定、绝对、可公网访问的 URL。
   * 这里优先读取环境变量，避免测试和生产域名写死在代码里。
   */
  url: activeShareId
    ? toAbsoluteUrl(activeShareUrl)
    : toAbsoluteUrl(import.meta.env.VITE_FACEBOOK_SHARE_URL || 'facebook'),

  /**
   * 分享卡片标题。
   *
   * 对应 Open Graph 的 `og:title`，会展示在 Facebook 分享卡片主标题位置。
   */
  title: activeShareItem?.title || import.meta.env.VITE_FACEBOOK_SHARE_TITLE || 'Facebook Share',

  /**
   * 分享卡片描述。
   *
   * 对应 Open Graph 的 `og:description`，用于补充说明页面内容。
   */
  description: activeShareItem?.description || import.meta.env.VITE_FACEBOOK_SHARE_DESCRIPTION || 'Share page prepared for Facebook Open Graph preview.',

  /**
   * 分享图片。
   *
   * 对应 Open Graph 的 `og:image`。Facebook 推荐使用绝对 URL，图片建议
   * 1200 x 630 像素，比例 1.91:1，便于在 Feed 中展示大图卡片。
   */
  image: activeShareItem?.image
    ? toAbsoluteUrl(activeShareItem.image)
    : activeShareId
      ? toAbsoluteUrl(`${activeShareUrl}/og.png?v=${activeShareImageVersion}`)
      : defaultShareImage,

  /**
   * 分享图片 MIME 类型。
   */
  imageType: 'image/webp',

  /**
   * 分享图片尺寸。
   *
   * `og:image:width` 和 `og:image:height` 可以帮助 Facebook 更快确定预览图比例。
   */
  imageWidth: '3600',
  imageHeight: '1890',

  /**
   * 分享图片的替代文本。
   *
   * 对应 `og:image:alt`，用于无障碍描述，也能提高分享素材语义完整性。
   */
  imageAlt: 'Facebook Share preview image',

  /**
   * Open Graph 类型。
   *
   * 普通 H5 分享页通常使用 `website`；文章详情页可以改为 `article`。
   */
  type: 'website',

  /**
   * 页面展示语言。
   *
   * 对应 `og:locale`，格式通常为 language_TERRITORY。
   */
  locale: 'en_US',

  /**
   * Facebook App ID。
   *
   * 如果项目有 Facebook App，可通过环境变量提供，用于 Facebook Insights
   * 等平台能力；没有 App 时可保持为空，不影响基础分享预览。
   */
  appId: import.meta.env.VITE_FACEBOOK_APP_ID || '',
}
