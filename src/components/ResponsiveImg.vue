<template>
  <img
    :srcset="srcsetAttr"
    :sizes="sizes"
    :src="fallbackSrc"
    :alt="alt"
    :loading="lazy ? 'lazy' : 'eager'"
    :fetchpriority="fetchpriority"
    v-bind="$attrs"
  />
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  /** 基础路径，不含倍率后缀和扩展名，如 openbox/header */
  name: string
  alt?: string
  sizes?: string
  /** 图片扩展名 */
  ext?: string
  /** 支持的倍率列表，默认 [1, 2, 3] */
  scales?: number[]
  /** 1x 对应的基准宽度(px)，默认 375 */
  baseWidth?: number
  /** 是否懒加载，默认 true。首屏关键图片设为 false */
  lazy?: boolean
  /** 资源加载优先级，默认 auto。LCP 图片应设为 high */
  fetchpriority?: 'high' | 'low' | 'auto'
}

const props = withDefaults(defineProps<Props>(), {
  alt: '',
  sizes: '100vw',
  ext: 'webp',
  scales: () => [1, 2, 3],
  baseWidth: 375,
  lazy: true,
  fetchpriority: 'auto',
})

const imageModules = import.meta.glob<string>('@/assets/images/**/*.{png,jpg,jpeg,webp,avif}', {
  eager: true,
  import: 'default',
})

const imagesByName = new Map<string, string>()
for (const [key, url] of Object.entries(imageModules)) {
  const match = key.match(/\/assets\/images\/(.+)$/)
  if (match) imagesByName.set(match[1], url)
}

function resolve(scale: number): string {
  const fileName = `${props.name}-${scale}x.${props.ext}`
  return imagesByName.get(fileName) ?? ''
}

const srcsetAttr = computed(() =>
  props.scales
    .map((s) => {
      const url = resolve(s)
      return url ? `${url} ${props.baseWidth * s}w` : ''
    })
    .filter(Boolean)
    .join(', '),
)

const fallbackSrc = computed(() => resolve(2) || resolve(props.scales[0]))

</script>
