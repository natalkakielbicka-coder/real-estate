<script setup>
import { computed } from 'vue'
import { Doughnut } from 'vue-chartjs'
import { ArcElement, Chart as ChartJS, Legend, Tooltip } from 'chart.js'

ChartJS.register(ArcElement, Legend, Tooltip)

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
        backgroundColor: ['#173f35', '#829476', '#c79d62'],
        borderColor: '#ffffff',
        borderWidth: 2
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
    }
  }
}
</script>

<template>
  <div class="relative h-[280px] w-full">
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
          class="block font-display text-[clamp(20px,2.5vw,28px)] font-normal text-brand"
        >
          {{ formatPrice(totalCost) }} zł
        </strong>

        <span
          class="mt-1 block text-[10px] tracking-[0.12em] text-muted uppercase"
        >
          Suma
        </span>
      </div>
    </div>
  </div>
</template>
