<template>
  <div class="px-[20px] mb-[28px]">
    <Swiper
      :modules="modules"
      slides-per-view="auto"
      :space-between="12"
      :loop="true"
      :speed="TRANSITION_SPEED"
      :autoplay="{ delay: AUTOPLAY_DELAY, disableOnInteraction: false }"
      class="proof-swiper"
    >
      <SwiperSlide v-for="item in items" :key="item.name" class="proof-swiper-slide">
        <article class="h-[278px] w-[200px] pt-[16px] rounded-[12px] bg-[#f4effe]">
          <div class="mb-[12px] flex items-center justify-center">
            <ResponsiveImg
              class="h-[60px] w-[60px] rounded-full object-cover"
              :name="item.avatar"
              alt=""
              :base-width="60"
            />
          </div>
          <h4 class="mb-[3px] text-center text-[16px] font-bold leading-[24px] text-[#343235]">{{ item.name }}</h4>
          <div class="mb-[16px] flex items-center justify-center">
            <div class="h-[22px] w-[115px] rounded-[4px] bg-[#efdcff] text-center text-[12px] font-normal leading-[22px] text-[#343235]/70">
              {{ item.role }}
            </div>
          </div>
          <div class="px-[20px] mb-[18px]">
            <div class="border-t border-[#6707c1]/10"></div>
          </div>
          <p class="text-[12px] text-center font-normal leading-[18px] text-[#343235]/70">Last Week</p>
          <p class="mt-[-3px] text-[36px] text-center font-bold leading-[54px] text-[#6707c1]">{{ item.amount }}</p>
          <p class="text-[14px] text-center font-medium leading-[21px] text-[#6707c1]">Poso</p>
        </article>
      </SwiperSlide>
    </Swiper>
  </div>
</template>

<script setup lang="ts">
import { Swiper, SwiperSlide } from 'swiper/vue'
import { Autoplay } from 'swiper/modules'
import 'swiper/css'
import ResponsiveImg from '@/components/ResponsiveImg.vue'

export interface ProofItem {
  avatar: string
  name: string
  role: string
  amount: string
}

defineProps<{ items: ProofItem[] }>()

const modules = [Autoplay]
const AUTOPLAY_DELAY = 3000
const TRANSITION_SPEED = 400
</script>

<style scoped>
.proof-swiper {
  overflow: visible;
}

.proof-swiper-slide {
  width: 200px;
  height: auto;
}
</style>
