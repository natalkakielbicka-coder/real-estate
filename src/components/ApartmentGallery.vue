<script setup>
import { computed, ref } from 'vue'
import { A11y, Keyboard, Navigation, Thumbs } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/vue'

import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/thumbs'
import VueEasyLightbox from 'vue-easy-lightbox'

const props = defineProps({
  apartment: {
    type: Object,
    required: true
  }
})

const modules = [Navigation, Thumbs, Keyboard, A11y]

const thumbsSwiper = ref(null)

const lightboxVisible = ref(false)
const lightboxIndex = ref(0)

const images = computed(() => {
  const galleryImages = props.apartment.gallery.map((image, index) => ({
    src: image,
    alt: `Wizualizacja mieszkania ${props.apartment.number} – ${index + 1}`,
    type: 'visualization'
  }))

  const floorPlan = {
    src: props.apartment.floorPlan,
    alt: `Rzut mieszkania ${props.apartment.number}`,
    type: 'floor-plan'
  }

  return [floorPlan, ...galleryImages]
})

const setThumbsSwiper = (swiper) => {
  thumbsSwiper.value = swiper
}

const lightboxImages = computed(() => {
  return images.value.map((image) => ({
    src: image.src,
    title: image.alt
  }))
})

const openLightbox = (index) => {
  lightboxIndex.value = index
  lightboxVisible.value = true
}

const closeLightbox = () => {
  lightboxVisible.value = false
}
</script>

<template>
  <div class="min-w-0">
    <Swiper
      class="gallery-main h-[560px] bg-panel max-sm:h-[450px] max-xs:h-[340px]"
      :modules="modules"
      :navigation="true"
      :keyboard="{
        enabled: true
      }"
      :thumbs="{
        swiper: thumbsSwiper
      }"
      :space-between="10"
    >
      <SwiperSlide
        v-for="(image, index) in images"
        :key="image.src"
      >
        <div
          class="relative h-full w-full"
          :class="{
            'p-[35px] max-xs:p-[15px]': image.type === 'floor-plan'
          }"
        >
          <img
            class="h-full w-full cursor-zoom-in"
            :class="
              image.type === 'floor-plan' ? 'object-contain' : 'object-cover'
            "
            :src="image.src"
            :alt="image.alt"
            @click="openLightbox(index)"
          />

          <span
            v-if="image.type === 'floor-plan'"
            class="absolute right-[18px] bottom-[18px] bg-brand px-3 py-2 text-[9px] font-bold tracking-[0.08em] text-white uppercase"
          >
            Rzut mieszkania
          </span>
        </div>
      </SwiperSlide>
    </Swiper>

    <Swiper
      class="mt-3 [&_.swiper-slide]:cursor-pointer [&_.swiper-slide]:opacity-55 [&_.swiper-slide]:transition-opacity [&_.swiper-slide]:duration-200 [&_.swiper-slide-thumb-active]:opacity-100 [&_.swiper-slide-thumb-active_button]:border-gold"
      :modules="modules"
      :slides-per-view="4"
      :space-between="12"
      :watch-slides-progress="true"
      @swiper="setThumbsSwiper"
    >
      <SwiperSlide
        v-for="(image, index) in images"
        :key="image.src"
      >
        <button
          class="relative h-[95px] w-full cursor-pointer overflow-hidden border-2 border-transparent bg-panel p-0 max-sm:h-[78px] max-xs:h-[60px]"
          type="button"
        >
          <img
            class="h-full w-full object-cover"
            :src="image.src"
            :alt="image.alt"
          />

          <span
            class="absolute right-1.5 bottom-1.5 grid h-[23px] min-w-[23px] place-items-center bg-[rgba(23,63,53,0.9)] px-[5px] text-[8px] font-bold text-white uppercase"
          >
            {{ image.type === 'floor-plan' ? 'Rzut' : index }}
          </span>
        </button>
      </SwiperSlide>
    </Swiper>

    <VueEasyLightbox
      :visible="lightboxVisible"
      :imgs="lightboxImages"
      :index="lightboxIndex"
      :loop="true"
      @hide="closeLightbox"
    />
  </div>
</template>

<style scoped>
.gallery-main {
  --swiper-navigation-color: var(--color-primary);
  --swiper-navigation-size: 13px;
}

.gallery-main :deep(.swiper-button-prev),
.gallery-main :deep(.swiper-button-next) {
  width: 34px;
  height: 34px;
  margin-top: 0;
  color: var(--color-primary);
  background-color: rgba(255, 255, 255, 0.92);
  border-radius: 50%;
  box-shadow: 0 5px 16px rgba(23, 63, 53, 0.12);
  transform: translateY(-50%);
  transition:
    color 0.2s ease,
    background-color 0.2s ease;
}

.gallery-main :deep(.swiper-button-prev:hover),
.gallery-main :deep(.swiper-button-next:hover) {
  color: #ffffff;
  background-color: var(--color-primary);
}

.gallery-main :deep(.swiper-button-prev svg),
.gallery-main :deep(.swiper-button-next svg) {
  width: 13px;
  height: 13px;
}

@media (max-width: 479px) {
  .gallery-main :deep(.swiper-button-prev),
  .gallery-main :deep(.swiper-button-next) {
    width: 30px;
    height: 30px;
    --swiper-navigation-size: 11px;
  }

  .gallery-main :deep(.swiper-button-prev svg),
  .gallery-main :deep(.swiper-button-next svg) {
    width: 11px;
    height: 11px;
  }
}
</style>
