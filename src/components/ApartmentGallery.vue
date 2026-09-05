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
  <div class="gallery">
    <Swiper
      class="gallery__main"
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
          class="gallery__slide"
          :class="{
            'gallery__slide--floor-plan': image.type === 'floor-plan'
          }"
        >
          <img
            :src="image.src"
            :alt="image.alt"
            @click="openLightbox(index)"
          />

          <span v-if="image.type === 'floor-plan'"> Rzut mieszkania </span>
        </div>
      </SwiperSlide>
    </Swiper>

    <Swiper
      class="gallery__thumbs"
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
          class="gallery__thumbnail"
          type="button"
        >
          <img
            :src="image.src"
            :alt="image.alt"
          />

          <span>
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
.gallery {
  min-width: 0;
}

.gallery__main {
  height: 560px;
  background-color: var(--color-surface);
  --swiper-navigation-color: var(--color-primary);
  --swiper-navigation-size: 18px;
}

.gallery__main img {
  cursor: zoom-in;
}

.gallery__slide {
  position: relative;
  width: 100%;
  height: 100%;
}

.gallery__slide img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.gallery__slide--floor-plan {
  padding: 35px;
}

.gallery__slide--floor-plan img {
  object-fit: contain;
}

.gallery__slide > span {
  position: absolute;
  right: 18px;
  bottom: 18px;
  padding: 8px 12px;
  color: #ffffff;
  background-color: var(--color-primary);
  font-size: 9px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.gallery__thumbs {
  margin-top: 12px;
}

.gallery__thumbnail {
  position: relative;
  width: 100%;
  height: 95px;
  padding: 0;
  overflow: hidden;
  background-color: var(--color-surface);
  border: 2px solid transparent;
  cursor: pointer;
}

.gallery__thumbnail img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.gallery__thumbnail span {
  position: absolute;
  right: 6px;
  bottom: 6px;
  display: grid;
  min-width: 23px;
  height: 23px;
  padding-inline: 5px;
  place-items: center;
  color: #ffffff;
  background-color: rgba(23, 63, 53, 0.9);
  font-size: 8px;
  font-weight: 700;
  text-transform: uppercase;
}

.gallery__thumbs :deep(.swiper-slide) {
  opacity: 0.55;
  cursor: pointer;
  transition: opacity 0.2s ease;
}

.gallery__thumbs :deep(.swiper-slide-thumb-active) {
  opacity: 1;
}

.gallery__thumbs :deep(.swiper-slide-thumb-active) .gallery__thumbnail {
  border-color: var(--color-accent);
}

.gallery__main :deep(.swiper-button-prev),
.gallery__main :deep(.swiper-button-next) {
  width: 34px;
  height: 34px;
  margin-top: 0;
  color: var(--color-primary);
  background-color: rgba(255, 255, 255, 0.92);
  border-radius: 50%;
  transform: translateY(-50%);
  box-shadow: 0 5px 16px rgba(23, 63, 53, 0.12);
  --swiper-navigation-size: 13px;
}

.gallery__main :deep(.swiper-button-prev):hover,
.gallery__main :deep(.swiper-button-next):hover {
  color: #ffffff;
  background-color: var(--color-primary);
}

.gallery__main :deep(.swiper-button-prev svg),
.gallery__main :deep(.swiper-button-next svg) {
  width: 13px;
  height: 13px;
}

@media (max-width: 767px) {
  .gallery__main {
    height: 450px;
  }

  .gallery__thumbnail {
    height: 78px;
  }
}

@media (max-width: 479px) {
  .gallery__main {
    height: 340px;
  }

  .gallery__slide--floor-plan {
    padding: 15px;
  }

  .gallery__thumbnail {
    height: 60px;
  }

  .gallery__main :deep(.swiper-button-prev),
  .gallery__main :deep(.swiper-button-next) {
    width: 30px;
    height: 30px;
    --swiper-navigation-size: 11px;
  }

  .gallery__main :deep(.swiper-button-prev svg),
  .gallery__main :deep(.swiper-button-next svg) {
    width: 11px;
    height: 11px;
  }
}
</style>
