<template>
  <span
    v-if="sizedSvgContent"
    v-bind="$attrs"
    :style="wrapperStyle"
    v-html="sizedSvgContent"
  />
</template>

<script setup lang="ts">
import { computed, type CSSProperties } from 'vue'

/**
 * 尺寸可传：
 * - number：设计稿 px，自动换算 vw（如 24 → 6.4vw）
 * - 纯数字字符串：与 number 等价（如 size="24"）
 * - 含 px 的字符串：替换其中 px 为 vw（如 "24px" / "calc(100% - 8px)"）
 * - 其它单位字符串：原样保留（如 "1.5em" / "100%" / "6.4vw"）
 */
type SvgSize = number | string

interface Props {
  /** svg 文件名，如 right-rouned 或 right-rouned.svg */
  name: string
  alt?: string
  /** 填充颜色，不传则默认继承父级字体颜色 */
  color?: string
  /** 统一设置宽高；width/height 优先级更高 */
  size?: SvgSize
  /** 宽度；缺省时回退到 size */
  width?: SvgSize
  /** 高度；缺省时回退到 size */
  height?: SvgSize
}

const props = withDefaults(defineProps<Props>(), {
  alt: '',
})

const rawSvgModules = import.meta.glob<string>('@/assets/svg/**/*.svg', {
  eager: true,
  query: '?raw',
  import: 'default',
})

const rawSvgsByName = new Map<string, string>()
for (const [key, content] of Object.entries(rawSvgModules)) {
  const match = key.match(/\/assets\/svg\/(.+)$/)
  if (match) rawSvgsByName.set(match[1], content)
}

const normalizedName = computed(() =>
  props.name.endsWith('.svg') ? props.name : `${props.name}.svg`,
)

const rawSvgContent = computed(() => rawSvgsByName.get(normalizedName.value) ?? '')

/**
 * postcss-px-to-viewport 只处理 CSS 块里的 px，无法转换运行时通过 :style / v-html
 * 注入的 px。这里手工做一次等价换算，与 vite.config.ts 的 viewportOptions 保持同步：
 * - 基线视口宽度 375、最大视口宽度 1080、精度 5 位
 * - |px| <= 1 时保留原值（避免极小尺寸被换算成 0）
 */
const VIEWPORT_WIDTH = 375
const MAX_VIEWPORT_WIDTH = 1080
const UNIT_PRECISION = 5
const MIN_PIXEL_VALUE = 1

function pxToVw(px: number): string {
  if (!Number.isFinite(px) || Math.abs(px) <= MIN_PIXEL_VALUE) return `${px}px`
  const vw = Number(((px / VIEWPORT_WIDTH) * 100).toFixed(UNIT_PRECISION))
  const maxPx = Number(((px / VIEWPORT_WIDTH) * MAX_VIEWPORT_WIDTH).toFixed(UNIT_PRECISION))
  return px < 0 ? `clamp(${maxPx}px, ${vw}vw, 0px)` : `clamp(0px, ${vw}vw, ${maxPx}px)`
}

/** 匹配字符串里的 px 值（含小数 / 负数），用于把 "24px" / "calc(100% - 8px)" 中的 px 转 vw */
const PX_VALUE_REGEXP = /(-?\d*\.?\d+)px/g

/** 无单位的纯数字字符串，与 number 一样按设计稿 px 处理（兼容 size="24"） */
const PLAIN_NUMBER_REGEXP = /^-?\d*\.?\d+$/

function convertPxStringToVw(input: string): string {
  return input.replace(PX_VALUE_REGEXP, (_match, raw: string) => pxToVw(Number.parseFloat(raw)))
}

/**
 * 把外部传入的尺寸归一化为 CSS 长度字符串（与全局 postcss px→vw 规则一致）。
 */
function normalizeSize(value: SvgSize | undefined): string | undefined {
  if (value === undefined || value === null || value === '') return undefined

  if (typeof value === 'number') return pxToVw(value)

  const trimmed = value.trim()
  if (!trimmed) return undefined

  if (PLAIN_NUMBER_REGEXP.test(trimmed)) return pxToVw(Number.parseFloat(trimmed))

  return convertPxStringToVw(trimmed)
}

const finalWidth = computed(() => normalizeSize(props.width ?? props.size))
const finalHeight = computed(() => normalizeSize(props.height ?? props.size))

/**
 * 重写原始 svg 的根标签 width / height 属性以实现尺寸控制：
 * - 不传 width/height/size 时返回原始内容，保持现有行为不变。
 * - 已存在的属性会被替换，否则追加。
 */
const sizedSvgContent = computed(() => {
  const raw = rawSvgContent.value
  if (!raw) return ''
  const w = finalWidth.value
  const h = finalHeight.value
  if (!w && !h) return raw
  return raw.replace(/<svg\b([^>]*)>/i, (_match, attrs: string) => {
    let next = attrs
    if (w) {
      next = /\bwidth\s*=\s*["'][^"']*["']/i.test(next)
        ? next.replace(/\bwidth\s*=\s*["'][^"']*["']/i, `width="${w}"`)
        : `${next} width="${w}"`
    }
    if (h) {
      next = /\bheight\s*=\s*["'][^"']*["']/i.test(next)
        ? next.replace(/\bheight\s*=\s*["'][^"']*["']/i, `height="${h}"`)
        : `${next} height="${h}"`
    }
    return `<svg${next}>`
  })
})

/** 同步把宽高写到外层 span，避免内联布局下宽度被 svg 默认值撑开 */
const wrapperStyle = computed<CSSProperties | undefined>(() => {
  const style: CSSProperties = {}
  if (props.color) style.color = props.color
  if (finalWidth.value) style.width = finalWidth.value
  if (finalHeight.value) style.height = finalHeight.value
  if (finalWidth.value || finalHeight.value) style.display = 'inline-flex'
  return Object.keys(style).length ? style : undefined
})
</script>
