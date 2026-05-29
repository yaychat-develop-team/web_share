<template>
  <main class="min-h-screen pb-[130px] overflow-x-hidden bg-[#250064] font-['Poppins',Arial,sans-serif] text-white">
    <ResponsiveImg
      class="absolute left-0 top-0 z-1 w-screen object-cover aspect-375/473"
      name="landing/hero"
      alt=""
      :lazy="false"
      fetchpriority="high"
    />
    <div class="pl-[20px] absolute left-0 top-[21px] z-2 flex items-center">
      <ResponsiveImg
        class="w-[32px] h-[32px]! mr-[8px]"
        :name="brandName === 'Oumi' ? 'landing/logo-oumi' : 'landing/logo-yaychat'"
        :scales="[3]"
        alt=""
        :lazy="false"
        fetchpriority="high"
      />
      <h1 class="text-white text-[14px] font-black leading-[21px]">{{ brandName }}</h1>
    </div>
    
    <section
      class="relative z-3 mx-auto pt-[255px] overflow-hidden"
      aria-label="Yaychat landing page"
    >
      <div class="pl-[20px] mb-[8px]">
        <ResponsiveImg
          class="w-[200px] aspect-608/73"
          name="landing/turn-your-voice"
          :scales="[3]"
        />
      </div>
      <div class="pl-[20px] mb-[20px]">
        <ResponsiveImg
          class="w-[280px] aspect-845/125"
          name="landing/into-income"
          :scales="[3]"
        />
      </div>
      <div class="pl-[20px] mb-[24px]">
        <div class="w-[280px] h-[36px] bg-white rounded-[9999px] flex items-center justify-center">
          <div class="text-13px font-[600] text-[#390283]">
            Chat from home and earn money!
          </div>
        </div>
      </div>
      <ul
        class="list-none mb-[36px] grid grid-cols-[139px_183px] gap-x-[13px] gap-y-[14px] pl-[20px]"
        aria-label="Yaychat benefits"
      >
        <li v-for="item in featurePills" :key="item" class="flex items-center gap-[4px] text-[12px] font-semibold leading-[16px] text-white">
          <img :src="checkSvg" alt="" class="h-[18px] w-[18px]">
          <span>{{ item }}</span>
        </li>
      </ul>
      <h2 class="mb-[7px] text-[36px] font-black leading-[54px] text-black bg-[#FFD400] indent-[21px]">Why Join Us?</h2>
<!--       
      <section
        v-for="section in sections"
        :key="section.no"
        class=""
      >
        <p class="m-0 text-[48px] font-black leading-[58px] text-[#ffd400]">{{ section.no }}</p>
        <h3 class="mt-[-10px] text-[24px] font-black leading-[36px] text-[#ffd400]">{{ section.title }}</h3>
        <p class="mt-[2px] w-[297px] text-[14px] font-medium leading-[16px] text-white">{{ section.desc }}</p>
      </section> -->
      <section
        class="pl-[20px] mb-[18px]"
      >
        <p class="text-[60px] font-black leading-[90px] text-white/20">01</p>
        <h3 class="mt-[-50px]! mb-[2px]! text-[24px] font-black leading-[36px] text-[#ffd400]">Easy to earn</h3>
        <p class="w-[297px] text-[14px] font-medium leading-[16px] text-white">Lots of quality users — just chat and get rewarded.</p>
      </section>
      <div class="grid gap-[10px] px-[20px] mb-[32px]">
        <article v-for="item in earningItems" :key="item.title" class="relative h-[78px] pl-[12px] flex items-center rounded-[12px] bg-[#f4effe]">
          <ResponsiveImg
            class="h-[54px] w-[54px] rounded-[8px] object-cover"
            :name="item.image"  
            alt=""
            :base-width="54"
          />
          <div class="ml-[12px]">
            <h4 class="mb-[5px] text-[14px] font-semibold leading-[21px] text-black">{{ item.title }}</h4>
            <p class="text-[12px] font-normal leading-[16px] text-[#343235]/70">{{ item.desc }}</p>
          </div>
        </article>
      </div>

      <section
        class="pl-[20px] mb-[18px]"
      >
        <p class="text-[60px] font-black leading-[90px] text-white/20">02</p>
        <h3 class="mt-[-50px]! mb-[2px]! text-[24px] font-black leading-[36px] text-[#ffd400]">Simple Job Duties</h3>
        <p class="w-[297px] text-[14px] font-medium leading-[16px] text-white">Start Your Voice Chat Host Career with Zero Barriers.</p>
      </section>

      <div class="px-[20px] mb-[32px] grid grid-cols-[repeat(2,162px)] gap-x-[11px] gap-y-[10px]">
        <article v-for="item in duties" :key="item.title" class="relative h-[222px] w-[162px] p-[10px_10px_19px_10px] rounded-[12px] bg-[#f4effe]">
          <ResponsiveImg
            class="h-[104px]! w-[142px] mb-[10px] rounded-[8px] object-cover"
            :name="item.image"
            alt=""
            :base-width="142"
          />
          <h4 class="w-[146px] mb-[5px] text-center text-[14px] font-semibold leading-[21px] text-black">{{ item.title }}</h4>
          <p class="w-[142px] text-center text-[12px] font-normal leading-[16px] text-[#343235]/70">
            {{ item.desc }}
          </p>
        </article>
      </div>

      <section
        class="pl-[20px] mb-[18px]"
      >
        <p class="text-[60px] font-black leading-[90px] text-white/20">03</p>
        <h3 class="mt-[-50px]! mb-[2px]! text-[24px] font-black leading-[36px] text-[#ffd400]">Rising Star Program</h3>
        <p class="w-[297px] text-[14px] font-medium leading-[16px] text-white">From zero to growth, we support you all the way.</p>
      </section>

      <div class="grid gap-[10px] px-[20px] mb-[32px]">
        <article v-for="item in supports" :key="item.title" class="h-[120px] w-[335px] overflow-hidden rounded-[12px] bg-[#f4effe]">
          <div class="flex h-[50px] w-[335px] items-center gap-[6px] rounded-[12px_12px_0_0] border border-white bg-[#af00ff]/10 pl-[13px]">
            <SvgIcon name="landing/star" size="16" />
            <h4 class="text-[16px] font-bold leading-[24px] text-[#6707c1]">{{ item.title }}</h4>
          </div>
          <div class="p-[14px_14px_16px_14px]">
            <p class=" text-[13px] font-normal leading-[20px] text-[#343235]/70">{{ item.desc }}</p>
          </div>
        </article>
      </div>

      <section
        class="pl-[20px] mb-[18px]"
      >
        <p class="text-[60px] font-black leading-[90px] text-white/20">04</p>
        <h3 class="mt-[-50px]! mb-[2px]! text-[24px] font-black leading-[36px] text-[#ffd400]">Their Weekly Earnings</h3>
        <p class="w-[297px] text-[14px] font-medium leading-[16px] text-white">Real earning cases, with transparent payout records.</p>
      </section>

      <ProofCarousel :items="proofs" />

      <section class="relative text-center">
        <SvgIcon name="landing/sparkle-left" size="24" class="absolute left-[23px] top-[7px] rotate-270" />
        <h3 class="text-[28px] font-black leading-[42px]">
          You Can <span class="text-[#ffd400]">Start Now</span>
        </h3>
        <SvgIcon name="landing/sparkle-left" size="24" class="absolute right-[23px] top-[7px]" />
        <p class="text-[12px] font-medium leading-[16px] text-[rgba(255,255,255,0.8)]">Join Us and Become the Next Voice Chat Star</p>
      </section>

      <div v-if="brandName === 'Oumi'" class="fixed bottom-0 left-0 h-[120px] w-screen p-[12px_16px_0_16px] bg-[#461791]">
        <div class="flex w-full items-center gap-[11px] mb-[16px]">
          <div
            class="flex h-[54px] min-w-0 flex-1 basis-0 items-center justify-center rounded-[12px] bg-black text-[13px] font-semibold leading-[20px] text-white no-underline border border-white"
            aria-label="Android Download"
            @click="download('google')"
          >
            <ResponsiveImg name="landing/google-logo" class="h-[27px]! w-[24px] mr-[8px]" />
            <div>
              <p class="text-[10px] font-medium leading-[15px]">GET IT ON</p>
              <p class="mt-[-3px] text-[15px] font-bold leading-[23px]">Google Play</p>
            </div>
          </div>
          <div
            class="flex h-[54px] min-w-0 flex-1 basis-0 items-center justify-center rounded-[12px] bg-black text-[13px] font-semibold leading-[20px] text-white no-underline border border-white"
            aria-label="IOS Download"
            @click="download('ios')"
          >
            <ResponsiveImg name="landing/apple-logo" class="h-[28px] w-[28px] mr-[8px]" />
            <div>
              <p class="text-[10px] font-medium leading-[15px]">GET IT ON</p>
              <p class="mt-[-3px] text-[15px] font-bold leading-[23px]">App Store</p>
            </div>
          </div>
        </div>
        <div class="text-[13px] text-center font-medium leading-[16px] text-[rgba(255,255,255,0.8)]" >
          <div class="inline-block underline" @click="download('official')">
            Official website download
          </div>
        </div>
      </div>

      <div v-if="brandName === 'Yaychat'" class="fixed bottom-0 left-0 z-[9999] h-[90px] w-screen p-[16px_16px_0_16px] bg-[#461791]">
        <div class="flex w-full items-center gap-x-[11px] mb-[16px]">
          <div
            class="flex h-[54px] min-w-0 flex-1 basis-0 items-center justify-center gap-[4px] rounded-[12px] bg-black text-[13px] font-semibold leading-[20px] text-white no-underline border border-white"
            aria-label="google Download"
            @click="download('google')"
          >
            <ResponsiveImg name="landing/google-logo" class="h-[27px]! w-[20px] mr-[10px]" />
            <div>
              <p class="text-[10px] font-medium leading-[15px]">GET IT ON</p>
              <p class="mt-[-3px] text-[15px] font-bold leading-[23px]">Google Play</p>
            </div>
          </div>
          <div
            class="flex h-[54px] min-w-0 flex-1 basis-0 items-center justify-center rounded-[12px] bg-black text-[13px] font-semibold leading-[20px] text-white no-underline border border-white"
            aria-label="IOS Download"
            @click="download('official')"
          >
            <ResponsiveImg name="landing/android-logo" class="h-[29px]! w-[30px] mr-[9px]" />
            <div>
              <p class="text-[10px] font-medium leading-[15px]">download from</p>
              <p class="mt-[-3px] text-[15px] font-bold leading-[23px]">Official Site</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>

<script setup lang="ts">
import ResponsiveImg from '@/components/ResponsiveImg.vue'
import ProofCarousel from '@/components/ProofCarousel.vue'
import SvgIcon from '@/components/SvgIcon.vue'
import checkSvg from '@/assets/svg/landing/check.svg'
import { ta } from '@/utils/thinkingdata'
import { onMounted } from 'vue'

const featurePills = [
  'Flexible schedule',
  'No need to show your face',
  'Newcomer support',
  'Weekly salary payout',
]

const earningItems = [
  {
    image: 'landing/quality-users',
    title: 'High-spending users',
    desc: 'KA users spend 10,000+ on average',
  },
  {
    image: 'landing/bonus-events',
    title: 'Lots of bonus events',
    desc: 'More rewards, more chances',
  },
  {
    image: 'landing/weekly-payment',
    title: 'Weekly payment',
    desc: 'Scheduled payouts, fast payment.',
  },
]

const duties = [
  {
    image: 'landing/face-card',
    title: 'No need to show your face',
    desc: 'just let your charming voice shine.',
  },
  {
    image: 'landing/hours-card',
    title: 'Flexible working hours',
    desc: '20 working hours, flexibly scheduled.',
  },
  {
    image: 'landing/traffic-card',
    title: 'Professional traffic support',
    desc: 'Steady access to high-value users.',
  },
  {
    image: 'landing/team-card',
    title: 'Room Manager team support',
    desc: 'Team support to help you grow faster.',
  },
]

const supports = [
  {
    title: 'Newcomer Support',
    desc: '3-on-1 Trainer support to guide you through onboarding and help you grow faster.',
  },
  {
    title: 'Traffic support for newcomers',
    desc: 'Exclusive quality traffic for newcomers, with less competition to help you grow faster.',
  },
]

const proofs = [
  {
    avatar: 'landing/avatar-madeline',
    name: '🚀🔞Madeline🍒🍑',
    role: 'College Students',
    amount: '50,315',
  },
  {
    avatar: 'landing/avatar-vega',
    name: '🌼Vega🩷',
    role: 'Freelancer',
    amount: '26,577',
  },
  {
    avatar: 'landing/avatar-kelsey',
    name: '🧿𝓚𝐞𝐥𝐬𝐞𝔂🌹ᥫ᭡',
    role: 'Homemaker',
    amount: '62,307',
  },
]

const brandName = typeof window !== 'undefined' && window.location.hostname.includes('oumi')
  ? 'Oumi'
  : 'Yaychat'

const downloadUrl = (type: 'google' | 'ios' | 'official') => {
  if (brandName === 'Oumi') {
    switch (type) {
      case 'google':
        return 'https://play.google.com/store/apps/details?id=chat.oumi.app'
      case 'ios':
        return 'https://apps.apple.com/app/id6748783645'
      case 'official':
        return 'http://cdn.oumiapp.com/oumi/reviews/oumi-gw.apk'
      default:
        break;
    }
  } else {
    switch (type) {
      case 'google':
        return 'https://play.google.com/store/apps/details?id=chat.yay.app'
      case 'official':
        return 'https://cdn.yay1.xyz/apks/yaychat-gw.apk'
      default:
        break;
    }
  }
}

const copyInviteCode = async () => {
  const inviteCode = new URLSearchParams(window.location.search).get('code')
  if (!inviteCode) return

  const copyText = `#^yc:${inviteCode}^#`

  try {
    await navigator.clipboard.writeText(copyText)
  } catch {
    const textarea = document.createElement('textarea')
    textarea.value = copyText
    textarea.style.position = 'fixed'
    textarea.style.opacity = '0'
    document.body.appendChild(textarea)
    textarea.select()
    document.execCommand('copy')
    document.body.removeChild(textarea)
  }
}

const download = async (type: 'google' | 'ios' | 'official') => {
  ta.track('gs_share_show', {
    type,
  })
  await copyInviteCode()
  window.open(downloadUrl(type), '_blank')
}

onMounted(() => {
  ta.track('gs_share_show')
})

</script>
