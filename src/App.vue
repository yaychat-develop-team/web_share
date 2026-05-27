<template>
  <router-view v-slot="{ Component }">
    <keep-alive :include="keepAliveList">
      <component :is="Component" />
    </keep-alive>
  </router-view>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const keepAliveList = computed(() =>
  router.getRoutes()
    .filter((route) => route.meta?.keepAlive)
    .map((route) => route.name)
    .filter((name): name is string => typeof name === 'string'),
)
</script>
