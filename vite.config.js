import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import tailwindcss from '@tailwindcss/postcss';
import { fileURLToPath, URL } from 'node:url';
const viewportOptions = {
    viewportWidth: 375,
    unitPrecision: 5,
    viewportUnit: 'vw',
    selectorBlackList: ['.ignore-px'],
    minPixelValue: 1,
    mediaQuery: false,
};
function pxToViewport(options) {
    const pxRegExp = /(-?\d*\.?\d+)px/g;
    const shouldIgnoreSelector = (selector) => {
        return options.selectorBlackList.some((item) => selector.includes(item));
    };
    const transformValue = (value) => {
        return value.replace(pxRegExp, (match, pixelValue) => {
            const pixels = Number.parseFloat(pixelValue);
            if (!Number.isFinite(pixels) || Math.abs(pixels) <= options.minPixelValue)
                return match;
            const viewportValue = Number.parseFloat(((pixels / options.viewportWidth) * 100).toFixed(options.unitPrecision));
            return `${viewportValue}${options.viewportUnit}`;
        });
    };
    return {
        postcssPlugin: 'postcss-px-to-viewport-in-tailwind-layers',
        Declaration(decl) {
            const selector = decl.parent?.selector;
            if (selector && shouldIgnoreSelector(selector))
                return;
            decl.value = transformValue(decl.value);
        },
    };
}
export default defineConfig(({ mode }) => ({
    plugins: [vue()],
    ...(mode === 'production' || mode.startsWith('production-')
        ? {
            esbuild: { drop: ['console', 'debugger'] },
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
                pxToViewport(viewportOptions),
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
                    if (!id.includes('node_modules'))
                        return;
                    if (id.includes('vue') || id.includes('vue-router') || id.includes('pinia'))
                        return 'framework';
                    if (id.includes('swiper'))
                        return 'swiper';
                    if (id.includes('axios'))
                        return 'axios';
                    if (id.includes('@fontsource'))
                        return 'fonts';
                    return 'vendor';
                },
            },
        },
    },
}));
