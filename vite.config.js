import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import tailwindcss from '@tailwindcss/postcss';
import { fileURLToPath, URL } from 'node:url';
const viewportOptions = {
    viewportWidth: 375,
    maxViewportWidth: 1080,
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
    const transformValue = (value, targetWidth, targetUnit) => {
        let transformed = false;
        const nextValue = value.replace(pxRegExp, (match, pixelValue) => {
            const pixels = Number.parseFloat(pixelValue);
            if (!Number.isFinite(pixels) || Math.abs(pixels) <= options.minPixelValue)
                return match;
            transformed = true;
            const targetValue = Number.parseFloat(((pixels / options.viewportWidth) * targetWidth).toFixed(options.unitPrecision));
            return `${targetValue}${targetUnit}`;
        });
        return { value: nextValue, transformed };
    };
    const toViewportValue = (value) => transformValue(value, 100, options.viewportUnit);
    const toMaxPixelValue = (value) => transformValue(value, options.maxViewportWidth, 'px');
    const createMaxViewportRule = (decl) => {
        const parent = decl.parent;
        if (!parent?.clone)
            return undefined;
        const maxDecl = decl.clone({ value: toMaxPixelValue(decl.value).value });
        maxDecl.__pxToViewportMax = true;
        return {
            type: 'atrule',
            name: 'media',
            params: `(min-width: ${options.maxViewportWidth}px)`,
            nodes: [parent.clone({ nodes: [maxDecl] })],
        };
    };
    const shouldSkipDeclaration = (decl) => {
        if (decl.__pxToViewportMax)
            return true;
        const selector = decl.parent?.selector;
        return Boolean(selector && shouldIgnoreSelector(selector));
    };
    return {
        postcssPlugin: 'postcss-px-to-viewport-in-tailwind-layers',
        Declaration(decl) {
            if (shouldSkipDeclaration(decl))
                return;
            const viewportResult = toViewportValue(decl.value);
            if (!viewportResult.transformed)
                return;
            const maxViewportRule = createMaxViewportRule(decl);
            decl.value = viewportResult.value;
            if (maxViewportRule) {
                decl.parent?.after(maxViewportRule);
            }
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
