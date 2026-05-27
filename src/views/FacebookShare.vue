<template>
  <main class="min-h-screen bg-white px-16 py-24 text-slate-900">
    <section class="mx-auto flex w-full max-w-[375px] flex-col gap-16">
      <img
        class="aspect-[1200/630] w-full rounded-8 border border-slate-200 object-cover"
        :src="shareMeta.image"
        :alt="shareMeta.imageAlt"
      >

      <div>
        <h1 class="text-24 font-semibold leading-tight">
          {{ shareMeta.title }}
        </h1>
        <p class="mt-8 text-14 leading-20 text-slate-500">
          {{ shareMeta.description }}
        </p>
      </div>

      <dl class="grid gap-8 text-12 leading-18 text-slate-600">
        <div class="rounded-8 bg-slate-50 p-12">
          <dt class="font-semibold text-slate-900">
            og:url
          </dt>
          <dd class="mt-4 break-all">
            {{ shareMeta.url }}
          </dd>
        </div>
        <div class="rounded-8 bg-slate-50 p-12">
          <dt class="font-semibold text-slate-900">
            og:image
          </dt>
          <dd class="mt-4 break-all">
            {{ shareMeta.image }}
          </dd>
        </div>
      </dl>
    </section>
  </main>
</template>

<script setup lang="ts">
import { useFacebookShareMeta } from '@/composables/useFacebookShareMeta'

/**
 * 该页面是 Facebook 分享落地页。
 *
 * 页面职责：
 * 1. 在浏览器中展示与分享卡片一致的标题、描述和图片。
 * 2. 挂载后同步 Open Graph meta 标签，便于本地调试和非爬虫访问。
 * 3. 作为 `/facebook-share` 路由的单一维护入口。
 *
 * 重要限制：
 * Facebook 爬虫通常读取服务端返回的原始 HTML，而不是等待 Vue 挂载后执行 JS。
 * 因此 `index.html` 中也放置了默认 Open Graph 标签；如果未来分享内容需要动态化，
 * 应改为 SSR、预渲染或由后端按分享 URL 输出完整 meta 标签。
 */
const { shareMeta } = useFacebookShareMeta()
</script>
