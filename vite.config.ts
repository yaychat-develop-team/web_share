import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/postcss'
import { fileURLToPath, URL } from 'node:url'

const viewportOptions = {
  viewportWidth: 375,
  unitPrecision: 5,
  viewportUnit: 'vw',
  selectorBlackList: ['.ignore-px'],
  minPixelValue: 1,
  mediaQuery: false,
}

type CssDeclaration = {
  value: string
  parent?: {
    selector?: string
  }
}

type LocalPostcssPlugin = {
  postcssPlugin: string
  Declaration: (decl: CssDeclaration) => void
}

function pxToViewport(options: typeof viewportOptions) {
  const pxRegExp = /(-?\d*\.?\d+)px/g

  const shouldIgnoreSelector = (selector: string) => {
    return options.selectorBlackList.some((item) => selector.includes(item))
  }

  const transformValue = (value: string) => {
    return value.replace(pxRegExp, (match, pixelValue: string) => {
      const pixels = Number.parseFloat(pixelValue)
      if (!Number.isFinite(pixels) || Math.abs(pixels) <= options.minPixelValue) return match

      const viewportValue = Number.parseFloat(((pixels / options.viewportWidth) * 100).toFixed(options.unitPrecision))
      return `${viewportValue}${options.viewportUnit}`
    })
  }

  return {
    postcssPlugin: 'postcss-px-to-viewport-in-tailwind-layers',
    Declaration(decl: CssDeclaration) {
      const selector = decl.parent?.selector
      if (selector && shouldIgnoreSelector(selector)) return

      decl.value = transformValue(decl.value)
    },
  } as unknown as LocalPostcssPlugin
}

export default defineConfig(({ mode }) => ({
  plugins: [vue()],
  ...(mode === 'production' || mode.startsWith('production-')
    ? {
        esbuild: { drop: ['console', 'debugger'] as const } as import('vite').ESBuildOptions,
      }
    : {}),
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  css: {
    postcss: {
      plugins: [
        tailwindcss(),
        pxToViewport(viewportOptions) as never,
      ],
    },
    preprocessorOptions: {
      scss: {
        additionalData: `@use "@/assets/styles/variables" as *;`,
      },
    },
  },
  server: {
    host: '0.0.0.0',
    port: 3000,
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes('node_modules')) return
          if (id.includes('vue') || id.includes('vue-router') || id.includes('pinia')) return 'framework'
          if (id.includes('swiper')) return 'swiper'
          if (id.includes('axios')) return 'axios'
          if (id.includes('@fontsource')) return 'fonts'
          return 'vendor'
        },
      },
    },
  },
}))
