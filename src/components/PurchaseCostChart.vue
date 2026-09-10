<script setup>
import { computed } from 'vue'
import { Doughnut } from 'vue-chartjs'
import { ArcElement, Chart as ChartJS, Tooltip } from 'chart.js'

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

const formatPrice = (price) => {
  return new Intl.NumberFormat('pl-PL').format(price)
}

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
</script>

<template>
  <div>
    <!-- Wykres -->
    <div class="relative mx-auto h-[250px] w-full max-w-[290px]">
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
    <div class="mt-7 space-y-4">
      <!-- Mieszkanie -->
      <div
        class="grid grid-cols-[minmax(0,1fr)_42px_100px] items-center gap-3 text-sm"
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
        class="grid grid-cols-[minmax(0,1fr)_42px_100px] items-center gap-3 text-sm"
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
        class="grid grid-cols-[minmax(0,1fr)_42px_100px] items-center gap-3 text-sm"
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
