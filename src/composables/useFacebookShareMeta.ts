import { onMounted } from 'vue'
import { facebookShareConfig } from '@/config/facebookShare'

type ShareMetaTag = {
  property?: string
  name?: string
  content: string
}

/**
 * 创建或更新一个 meta 标签。
 *
 * Facebook 使用 Open Graph 协议读取 `property="og:*"` 标签；
 * 常规浏览器和部分平台也会读取 `name="description"`。
 */
function setMetaTag(tag: ShareMetaTag) {
  const selector = tag.property
    ? `meta[property="${tag.property}"]`
    : `meta[name="${tag.name}"]`

  let element = document.head.querySelector<HTMLMetaElement>(selector)
  if (!element) {
    element = document.createElement('meta')
    if (tag.property) element.setAttribute('property', tag.property)
    if (tag.name) element.setAttribute('name', tag.name)
    document.head.appendChild(element)
  }

  element.setAttribute('content', tag.content)
}

/**
 * 在客户端同步 Facebook 分享所需的页面信息。
 *
 * 这能保证用户真实打开 `/facebook-share` 页面时，浏览器标题和 DOM 中的
 * Open Graph 标签完整可见；但 Facebook 爬虫是否读取到这些动态修改，取决于
 * 部署方式。要完全符合分享抓取稳定性，应在服务端首屏 HTML 中输出同样标签。
 */
export function useFacebookShareMeta() {
  const applyFacebookShareMeta = () => {
    document.title = facebookShareConfig.title

    const tags: ShareMetaTag[] = [
      // 标准页面描述，兼容搜索引擎和普通链接预览。
      { name: 'description', content: facebookShareConfig.description },

      // 分享目标规范 URL，Facebook 会把相同 `og:url` 视为同一个对象来缓存。
      { property: 'og:url', content: facebookShareConfig.url },

      // 内容类型。普通落地页使用 website。
      { property: 'og:type', content: facebookShareConfig.type },

      // 分享卡片标题。
      { property: 'og:title', content: facebookShareConfig.title },

      // 分享卡片描述。
      { property: 'og:description', content: facebookShareConfig.description },

      // 分享卡片主图，必须是可公网访问的绝对 URL 才适合 Facebook 抓取。
      { property: 'og:image', content: facebookShareConfig.image },

      // 图片安全 URL，HTTPS 图片可同时提供 `og:image:secure_url`。
      { property: 'og:image:secure_url', content: facebookShareConfig.image },

      // 图片 MIME 类型；如果后续改为 jpg/png/webp，需要同步调整。
      { property: 'og:image:type', content: facebookShareConfig.imageType },

      // 图片尺寸，帮助 Facebook 生成稳定卡片布局。
      { property: 'og:image:width', content: facebookShareConfig.imageWidth },
      { property: 'og:image:height', content: facebookShareConfig.imageHeight },

      // 图片替代文本，提高分享素材语义完整性。
      { property: 'og:image:alt', content: facebookShareConfig.imageAlt },

      // 页面语言区域。
      { property: 'og:locale', content: facebookShareConfig.locale },
    ]

    if (facebookShareConfig.appId) {
      // 可选：绑定 Facebook App 后用于 Insights 等平台能力。
      tags.push({ property: 'fb:app_id', content: facebookShareConfig.appId })
    }

    tags.forEach(setMetaTag)
  }

  onMounted(applyFacebookShareMeta)

  return {
    shareMeta: facebookShareConfig,
    applyFacebookShareMeta,
  }
}
