<script setup>
import { onBeforeUnmount, onMounted, ref } from 'vue'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { investments } from '../data/investments'
import { apartments } from '../data/apartments'

const emit = defineEmits(['show-investment'])

const mapContainer = ref(null)

let mapInstance = null

const getApartmentsCount = (investmentId) => {
  return apartments.filter((apartment) => {
    return apartment.investmentId === investmentId
  }).length
}

const createMarkerIcon = (apartmentsCount) => {
  return L.divIcon({
    className: 'investment-marker-wrapper',
    html: `
      <div class="investment-marker">
        <span>${apartmentsCount}</span>
      </div>
    `,
    iconSize: [48, 48],
    iconAnchor: [24, 48],
    popupAnchor: [0, -50]
  })
}

const createPopupContent = (investment, apartmentsCount) => {
  return `
    <div class="investment-popup">
      <span>Inwestycja</span>

      <strong>${investment.name}</strong>

      <p>
        ${investment.city}, ${investment.district}<br>
        ${investment.address}
      </p>

      <small>${apartmentsCount} mieszkań w ofercie</small>

      <button
        class="investment-popup__button"
        type="button"
        >
        Pokaż mieszkania
        <span>→</span>
      </button>
    </div>
  `
}

const addInvestmentMarker = (investment) => {
  const apartmentsCount = getApartmentsCount(investment.id)
  const markerIcon = createMarkerIcon(apartmentsCount)
  const popupContent = createPopupContent(investment, apartmentsCount)

  const marker = L.marker(investment.coordinates, {
    icon: markerIcon
  })
    .addTo(mapInstance)
    .bindPopup(popupContent)

  marker.on('popupopen', () => {
    const popupElement = marker.getPopup().getElement()

    const button = popupElement.querySelector('.investment-popup__button')

    button.addEventListener(
      'click',
      () => {
        emit('show-investment', investment.city)
      },
      {
        once: true
      }
    )
  })
}

onMounted(() => {
  mapInstance = L.map(mapContainer.value).setView([52.0, 19.1], 6)

  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(mapInstance)

  investments.forEach(addInvestmentMarker)

  //   const investmentCoordinates = investments.map((investment) => {
  //     return investment.coordinates
  //   })

  //   mapInstance.fitBounds(investmentCoordinates, {
  //     padding: [60, 60],
  //     maxZoom: 7
  //   })
})

onBeforeUnmount(() => {
  if (mapInstance) {
    mapInstance.remove()
    mapInstance = null
  }
})
</script>

<template>
  <div class="investments-map">
    <div
      ref="mapContainer"
      class="investments-map__container"
    ></div>
  </div>
</template>

<style scoped>
.investments-map {
  overflow: hidden;
  padding: 12px;
  background-color: var(--color-surface);
  box-shadow: 0 14px 45px rgba(23, 63, 53, 0.08);
}

.investments-map__container {
  width: 100%;
  height: 650px;
  background-color: var(--color-background);
}

:deep(.investment-marker-wrapper) {
  background: transparent;
  border: 0;
}

:deep(.investment-marker) {
  position: relative;
  display: grid;
  width: 48px;
  height: 48px;
  place-items: center;
  color: #ffffff;
  background-color: var(--color-primary);
  border: 4px solid rgba(255, 255, 255, 0.95);
  border-radius: 50% 50% 50% 0;
  box-shadow: 0 8px 22px rgba(23, 63, 53, 0.28);
  transform: rotate(-45deg);
}

:deep(.investment-marker span) {
  font-family: var(--font-heading);
  font-size: 17px;
  transform: rotate(45deg);
}

:deep(.leaflet-popup-content-wrapper) {
  border-radius: 0;
  box-shadow: 0 15px 40px rgba(23, 63, 53, 0.2);
}

:deep(.leaflet-popup-content) {
  width: 220px !important;
  margin: 20px;
}

:deep(.investment-popup > span) {
  display: block;
  margin-bottom: 5px;
  color: var(--color-accent);
  font-size: 8px;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}

:deep(.investment-popup strong) {
  display: block;
  color: var(--color-primary);
  font-family: var(--font-heading);
  font-size: 23px;
  font-weight: 400;
}

:deep(.investment-popup p) {
  margin-block: 9px 13px;
  color: var(--color-text-muted);
  font-size: 10px;
  line-height: 1.6;
}

:deep(.investment-popup small) {
  color: var(--color-primary);
  font-size: 9px;
  font-weight: 700;
  text-transform: uppercase;
}

:deep(.investment-popup__button) {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  min-height: 42px;
  margin-top: 16px;
  padding-inline: 14px;
  gap: 12px;
  color: #ffffff;
  background-color: var(--color-primary);
  border: 0;
  font-size: 9px;
  font-weight: 700;
  cursor: pointer;
}

:deep(.investment-popup__button:hover) {
  background-color: var(--color-primary-light);
}

:deep(.investment-popup__button span) {
  font-size: 16px;
  transition: transform 0.2s ease;
}

:deep(.investment-popup__button:hover span) {
  transform: translateX(4px);
}

@media (max-width: 991px) {
  .investments-map__container {
    height: 560px;
  }
}

@media (max-width: 767px) {
  .investments-map {
    padding: 8px;
  }

  .investments-map__container {
    height: 480px;
  }
}

@media (max-width: 479px) {
  .investments-map__container {
    height: 400px;
  }
}
</style>
