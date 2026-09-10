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
  }
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
  cutout: '68%'
}
</script>

<template>
  <div class="h-[280px] w-full">
    <Doughnut
      :data="chartData"
      :options="chartOptions"
      aria-label="Podział kosztów zakupu mieszkania"
    />
  </div>
</template>
