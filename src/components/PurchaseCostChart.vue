<script setup>
import { computed, ref, onMounted, onUnmounted, watch } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Doughnut } from 'vue-chartjs'
import { ArcElement, Chart as ChartJS, Tooltip } from 'chart.js'
import { formatPrice } from '../utils/apartmentFormatters'
gsap.registerPlugin(ScrollTrigger)

ChartJS.register(ArcElement, Tooltip)

const props = defineProps({
  apartmentPrice: {
    type: Number,
    required: true
  },
  finishingCost: {
    type: Number,
    required: true
  },
  additionalCosts: {
    type: Number,
    required: true
  },
  totalCost: {
    type: Number,
    required: true
  }
})

const calculatePercentage = (cost) => {
  if (props.totalCost === 0) {
    return 0
  }

  return Math.round((cost / props.totalCost) * 100)
}

const apartmentPercentage = computed(() => {
  return calculatePercentage(props.apartmentPrice)
})

const finishingPercentage = computed(() => {
  return calculatePercentage(props.finishingCost)
})

const additionalCostsPercentage = computed(() => {
  return calculatePercentage(props.additionalCosts)
})

const chartData = computed(() => {
  return {
    labels: ['Mieszkanie', 'Wykończenie', 'Opłaty'],

    datasets: [
      {
        data: [
          props.apartmentPrice,
          props.finishingCost,
          props.additionalCosts
        ],
        backgroundColor: ['#173f35', '#8fa17f', '#c79d62'],
        borderColor: '#ffffff',
        borderWidth: 2,
        hoverOffset: 4
      }
    ]
  }
})

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  cutout: '68%',
  plugins: {
    legend: {
      display: false
    },
    tooltip: {
      callbacks: {
        label(context) {
          const value = context.raw

          return `${context.label}: ${formatPrice(value)} zł`
        }
      }
    }
  }
}

const chartContainer = ref(null)
const legendContainer = ref(null)

let chartAnimation = null
let legendAnimation = null

onMounted(() => {
  const chart = chartContainer.value
  const legend = legendContainer.value

  if (!chart || !legend) return

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    gsap.set([chart, ...legend.querySelectorAll('[data-legend-item]')], {
      opacity: 1
    })

    return
  }

  const legendItems = legend.querySelectorAll('[data-legend-item]')

  // 1. Wykres – animacja po pojawieniu się w oknie
  chartAnimation = gsap.fromTo(
    chart,
    {
      opacity: 0,
      y: 40,
      scale: 0.92
    },
    {
      opacity: 1,
      y: 0,
      scale: 1,
      duration: 0.9,
      ease: 'power2.out',
      immediateRender: false,
      scrollTrigger: {
        trigger: chart,
        start: 'top 80%',
        once: true
      },
      onComplete: () => {
        gsap.set(chart, {
          clearProps: 'opacity,transform'
        })
      }
    }
  )

  // 2. Legenda – niezależna animacja po przewinięciu
  legendAnimation = gsap.fromTo(
    legendItems,
    {
      opacity: 0,
      x: -35
    },
    {
      opacity: 1,
      x: 0,
      duration: 0.65,
      stagger: 0.25,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: legend,
        start: 'top 85%',
        once: true
      },
      onComplete: () => {
        gsap.set(legendItems, {
          clearProps: 'opacity,transform'
        })
      }
    }
  )

  ScrollTrigger.refresh()
})

onUnmounted(() => {
  chartAnimation?.scrollTrigger?.kill()
  legendAnimation?.scrollTrigger?.kill()

  chartAnimation?.kill()
  legendAnimation?.kill()
})
</script>

<template>
  <div>
    <!-- Wykres -->
    <div
      ref="chartContainer"
      class="relative mx-auto h-[220px] w-full max-w-[250px] xs:h-[250px] xs:max-w-[290px]"
      style="opacity: 0"
    >
      <Doughnut
        :data="chartData"
        :options="chartOptions"
        aria-label="Podział kosztów zakupu mieszkania"
      />

      <div
        class="pointer-events-none absolute inset-0 grid place-items-center"
        aria-hidden="true"
      >
        <div class="text-center">
          <strong
            class="block font-display text-[clamp(20px,2.4vw,27px)] font-normal leading-none text-brand"
          >
            {{ formatPrice(totalCost) }} zł
          </strong>

          <span class="mt-2 block text-[10px] text-muted"> suma </span>
        </div>
      </div>
    </div>

    <!-- Legenda -->
    <div
      ref="legendContainer"
      class="mt-7 space-y-4"
    >
      <!-- Mieszkanie -->
      <div
        data-legend-item
        class="grid grid-cols-[minmax(0,1fr)_36px_86px] items-center gap-2 text-xs xs:grid-cols-[minmax(0,1fr)_42px_100px] xs:gap-3 xs:text-sm"
        style="opacity: 0"
      >
        <div class="flex items-center gap-3">
          <span
            class="size-3.5 shrink-0 rounded-full bg-brand"
            aria-hidden="true"
          ></span>

          <span> Mieszkanie </span>
        </div>

        <span class="text-right text-muted"> {{ apartmentPercentage }}% </span>

        <strong class="text-right font-semibold text-[var(--color-text)]">
          {{ formatPrice(apartmentPrice) }} zł
        </strong>
      </div>

      <!-- Wykończenie -->
      <div
        data-legend-item
        class="grid grid-cols-[minmax(0,1fr)_36px_86px] items-center gap-2 text-xs xs:grid-cols-[minmax(0,1fr)_42px_100px] xs:gap-3 xs:text-sm"
        style="opacity: 0"
      >
        <div class="flex items-center gap-3">
          <span
            class="size-3.5 shrink-0 rounded-full bg-[#8fa17f]"
            aria-hidden="true"
          ></span>

          <span> Wykończenie </span>
        </div>

        <span class="text-right text-muted"> {{ finishingPercentage }}% </span>

        <strong class="text-right font-semibold text-[var(--color-text)]">
          {{ formatPrice(finishingCost) }} zł
        </strong>
      </div>

      <!-- Opłaty -->
      <div
        data-legend-item
        class="grid grid-cols-[minmax(0,1fr)_36px_86px] items-center gap-2 text-xs xs:grid-cols-[minmax(0,1fr)_42px_100px] xs:gap-3 xs:text-sm"
        style="opacity: 0"
      >
        <div class="flex items-center gap-3">
          <span
            class="size-3.5 shrink-0 rounded-full bg-gold"
            aria-hidden="true"
          ></span>

          <span> Opłaty </span>
        </div>

        <span class="text-right text-muted">
          {{ additionalCostsPercentage }}%
        </span>

        <strong class="text-right font-semibold text-[var(--color-text)]">
          {{ formatPrice(additionalCosts) }} zł
        </strong>
      </div>
    </div>
  </div>
</template>
