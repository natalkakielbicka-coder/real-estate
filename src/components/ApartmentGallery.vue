<script setup>
import { computed, ref, watch } from 'vue'

const props = defineProps({
  apartment: {
    type: Object,
    required: true
  }
})

const activeImage = ref('')

const images = computed(() => {
  return [
    ...props.apartment.gallery.map((image, index) => ({
      src: image,
      alt: `Wizualizacja mieszkania ${props.apartment.number} – ${index + 1}`,
      type: 'visualization'
    })),
    {
      src: props.apartment.floorPlan,
      alt: `Rzut mieszkania ${props.apartment.number}`,
      type: 'floor-plan'
    }
  ]
})

watch(
  () => props.apartment,
  () => {
    activeImage.value = images.value[0].src
  },
  {
    immediate: true
  }
)

const activeImageData = computed(() => {
  return images.value.find((image) => {
    return image.src === activeImage.value
  })
})
</script>

<template>
  <div class="gallery">
    <div
      class="gallery__main"
      :class="{
        'gallery__main--floor-plan': activeImageData?.type === 'floor-plan'
      }"
    >
      <img
        :src="activeImageData?.src"
        :alt="activeImageData?.alt"
      />

      <span v-if="activeImageData?.type === 'floor-plan'">
        Rzut mieszkania
      </span>
    </div>

    <div class="gallery__thumbnails">
      <button
        v-for="(image, index) in images"
        :key="image.src"
        type="button"
        :class="{
          'gallery__thumbnail--active': activeImage === image.src
        }"
        @click="activeImage = image.src"
      >
        <img
          :src="image.src"
          :alt="image.alt"
        />

        <span v-if="image.type === 'floor-plan'"> Rzut </span>

        <span v-else>
          {{ index + 1 }}
        </span>
      </button>
    </div>
  </div>
</template>

<style scoped>
.gallery {
  min-width: 0;
}

.gallery__main {
  position: relative;
  height: 560px;
  overflow: hidden;
  background-color: var(--color-surface);
}

.gallery__main img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.gallery__main--floor-plan {
  padding: 35px;
}

.gallery__main--floor-plan img {
  object-fit: contain;
}

.gallery__main > span {
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

.gallery__thumbnails {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  margin-top: 12px;
  gap: 12px;
}

.gallery__thumbnails button {
  position: relative;
  height: 95px;
  padding: 0;
  overflow: hidden;
  background-color: var(--color-surface);
  border: 2px solid transparent;
}

.gallery__thumbnails button:hover,
.gallery__thumbnail--active {
  border-color: var(--color-accent) !important;
}

.gallery__thumbnails img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.gallery__thumbnails span {
  position: absolute;
  right: 6px;
  bottom: 6px;
  display: grid;
  min-width: 22px;
  height: 22px;
  padding-inline: 5px;
  place-items: center;
  color: #ffffff;
  background-color: rgba(23, 63, 53, 0.9);
  font-size: 8px;
  font-weight: 700;
  text-transform: uppercase;
}

@media (max-width: 767px) {
  .gallery__main {
    height: 450px;
  }

  .gallery__thumbnails button {
    height: 78px;
  }
}

@media (max-width: 479px) {
  .gallery__main {
    height: 340px;
  }

  .gallery__main--floor-plan {
    padding: 15px;
  }

  .gallery__thumbnails {
    gap: 7px;
  }

  .gallery__thumbnails button {
    height: 60px;
  }
}
</style>
