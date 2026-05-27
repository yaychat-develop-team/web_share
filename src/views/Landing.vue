<template>
  <main class="min-h-screen bg-white px-16 py-24 text-slate-900">
    <section class="mx-auto flex w-full max-w-[375px] flex-col gap-16">
      <div>
        <p class="text-12 font-semibold uppercase tracking-wide text-slate-400">
          Landing
        </p>
        <h1 class="mt-8 text-28 font-semibold leading-tight">
          {{ code || 'No code' }}
        </h1>
        <p class="mt-8 text-14 leading-20 text-slate-500">
          Code from Facebook share URL.
        </p>
      </div>

      <dl class="grid gap-8 text-12 leading-18 text-slate-600">
        <div class="rounded-8 bg-slate-50 p-12">
          <dt class="font-semibold text-slate-900">
            code
          </dt>
          <dd class="mt-4 break-all">
            {{ code || '-' }}
          </dd>
        </div>
      </dl>
    </section>
  </main>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

const code = computed(() => {
  const value = route.query.code
  return Array.isArray(value) ? value[0] || '' : value || ''
})
</script>
