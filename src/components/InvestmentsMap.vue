<script setup>
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'
import gsap from 'gsap'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { investments } from '../data/investments'
import {
  getApartmentsCountByInvestment,
  getInvestmentStatusCounts
} from '../utils/investmentHelpers'
import { getApartmentsLabel } from '../utils/apartmentFormatters'

const props = defineProps({
  apartments: {
    type: Array,
    required: true
  }
})

const emit = defineEmits(['show-investment'])

const mapContainer = ref(null)

let mapInstance = null
let markersLayer = null

let activeMarkerElement = null

const prefersReducedMotion = () => {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

const resetActiveMarker = () => {
  if (!activeMarkerElement) return

  gsap.killTweensOf(activeMarkerElement)

  gsap.set(activeMarkerElement, {
    clearProps: 'backgroundColor,boxShadow'
  })

  activeMarkerElement = null
}

const highlightMarker = (marker) => {
  const markerElement = marker.getElement()?.querySelector('.investment-marker')

  if (!markerElement) return

  resetActiveMarker()

  activeMarkerElement = markerElement

  if (prefersReducedMotion()) {
    gsap.set(markerElement, {
      backgroundColor: '#c79d62',
      boxShadow: '0 10px 30px rgba(199,157,98,0.5)'
    })
    return
  }

  gsap.to(markerElement, {
    backgroundColor: '#c79d62',
    boxShadow: '0 10px 30px rgba(199,157,98,0.5)',
    duration: 0.35,
    ease: 'power2.out',
    overwrite: true
  })
}

const initialMapCenter = [52.0, 19.1]
const initialMapZoom = 6

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

const createPopupContent = (investment, apartmentsCount, statusCounts) => {
  const popup = document.createElement('div')
  popup.className = 'investment-popup'

  const eyebrow = document.createElement('p')
  eyebrow.className = 'investment-popup__eyebrow'
  eyebrow.textContent = 'Inwestycja'

  const title = document.createElement('h3')
  title.textContent = investment.name

  const address = document.createElement('p')
  address.append(
    document.createTextNode(`${investment.city}, ${investment.district}`),
    document.createElement('br'),
    document.createTextNode(investment.address)
  )

  const apartmentsSummary = document.createElement('strong')
  apartmentsSummary.textContent = `${apartmentsCount} ${getApartmentsLabel(
    apartmentsCount
  )}`

  const statuses = document.createElement('div')
  statuses.className = 'investment-popup__statuses'

  const statusItems = [
    {
      type: 'available',
      label: `${statusCounts.available} dostępnych`
    },
    {
      type: 'reserved',
      label: `${statusCounts.reserved} rezerwacji`
    },
    {
      type: 'sold',
      label: `${statusCounts.sold} sprzedanych`
    }
  ]

  statusItems.forEach((status) => {
    const statusElement = document.createElement('span')

    statusElement.className = `investment-popup__status investment-popup__status--${status.type}`
    statusElement.textContent = status.label

    statuses.append(statusElement)
  })

  const button = document.createElement('button')
  button.className = 'investment-popup__button'
  button.type = 'button'
  button.textContent = 'Pokaż mieszkania '

  const arrow = document.createElement('span')
  arrow.textContent = '→'
  arrow.setAttribute('aria-hidden', 'true')

  button.append(arrow)

  popup.append(eyebrow, title, address, apartmentsSummary, statuses, button)

  return popup
}

const addInvestmentMarker = (investment) => {
  const apartmentsCount = getApartmentsCountByInvestment(
    props.apartments,
    investment.id
  )

  if (apartmentsCount === 0) {
    return
  }

  const statusCounts = getInvestmentStatusCounts(
    props.apartments,
    investment.id
  )

  const markerIcon = createMarkerIcon(apartmentsCount)

  const popupContent = createPopupContent(
    investment,
    apartmentsCount,
    statusCounts
  )

  const marker = L.marker(investment.coordinates, {
    icon: markerIcon
  })
    .addTo(markersLayer)
    .bindPopup(popupContent, {
      autoPan: true,
      keepInView: true,
      autoPanPaddingTopLeft: [30, 30],
      autoPanPaddingBottomRight: [30, 30],
      maxWidth: 280
    })

  marker.on('click', () => {
    highlightMarker(marker)

    mapInstance.flyTo(investment.coordinates, 11, {
      duration: prefersReducedMotion() ? 0 : 0.8
    })
  })

  marker.on('popupopen', () => {
    const popupElement = marker.getPopup().getElement()

    const button = popupElement.querySelector('.investment-popup__button')

    highlightMarker(marker)
    animatePopup(popupElement)

    button.addEventListener(
      'click',
      () => {
        emit('show-investment', investment.city)
      },
      { once: true }
    )
  })

  marker.on('popupclose', () => {
    const popupContent = marker
      .getPopup()
      ?.getElement()
      ?.querySelector('.investment-popup')

    if (popupContent) {
      gsap.killTweensOf(popupContent)
    }

    resetActiveMarker()

    if (!mapInstance) return

    mapInstance.flyTo(initialMapCenter, initialMapZoom, {
      duration: prefersReducedMotion() ? 0 : 0.8
    })
  })
}

const renderMarkers = () => {
  if (!markersLayer) {
    return
  }

  markersLayer.clearLayers()
  resetActiveMarker()

  investments.forEach((investment) => {
    const apartmentsCount = getApartmentsCountByInvestment(
      props.apartments,
      investment.id
    )

    if (apartmentsCount > 0) {
      addInvestmentMarker(investment)
    }
  })
}

const animatePopup = (popupElement) => {
  if (!popupElement || prefersReducedMotion()) return

  const content = popupElement.querySelector('.investment-popup')

  if (!content) return

  gsap.fromTo(
    content,
    {
      opacity: 0,
      y: 15
    },
    {
      opacity: 1,
      y: 0,
      duration: 0.45,
      ease: 'power2.out',
      overwrite: true,
      onComplete: () => {
        gsap.set(content, {
          clearProps: 'opacity,transform'
        })
      }
    }
  )
}

onMounted(() => {
  mapInstance = L.map(mapContainer.value).setView(
    initialMapCenter,
    initialMapZoom
  )

  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(mapInstance)

  markersLayer = L.layerGroup().addTo(mapInstance)
  renderMarkers()

  //   const investmentCoordinates = investments.map((investment) => {
  //     return investment.coordinates
  //   })

  //   mapInstance.fitBounds(investmentCoordinates, {
  //     padding: [60, 60],
  //     maxZoom: 7
  //   })
})

watch(
  () => props.apartments,
  () => {
    renderMarkers()
  }
)

onBeforeUnmount(() => {
  resetActiveMarker()

  mapContainer.value
    ?.querySelectorAll('.investment-popup')
    .forEach((element) => {
      gsap.killTweensOf(element)
    })

  if (mapInstance) {
    mapInstance.remove()
    mapInstance = null
    markersLayer = null
  }
})
</script>

<template>
  <div
    class="overflow-hidden bg-panel p-3 shadow-[0_14px_45px_rgba(23,63,53,0.08)]"
  >
    <div
      ref="mapContainer"
      class="h-[650px] w-full bg-page max-sm:h-[520px] max-xs:h-[430px]"
    ></div>
  </div>
</template>

<style scoped>
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

:deep(.investment-popup .investment-popup__eyebrow) {
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

:deep(.investment-popup__statuses) {
  display: flex;
  flex-direction: column;
  margin-block: 14px;
  gap: 6px;
}

:deep(.investment-popup__status) {
  display: flex;
  align-items: center;
  gap: 7px;
  font-size: 11px;
}

:deep(.investment-popup__status::before) {
  width: 8px;
  height: 8px;
  flex-shrink: 0;
  border-radius: 50%;
  content: '';
}

:deep(.investment-popup__status--available::before) {
  background-color: #3d806d;
}

:deep(.investment-popup__status--reserved::before) {
  background-color: #c28b3f;
}

:deep(.investment-popup__status--sold::before) {
  background-color: #929896;
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
