<script setup>
import { ref, computed, onMounted } from 'vue'
import { apartments } from '../data/apartments'
import CalculatorApartmentStep from '../components/CalculatorApartmentStep.vue'
import CalculatorFinancingStep from '../components/CalculatorFinancingStep.vue'
import CalculatorFinishingStep from '../components/CalculatorFinishingStep.vue'
import CalculatorAdditionalCostsStep from '../components/CalculatorAdditionalCostsStep.vue'
import CalculatorSummary from '../components/CalculatorSummary.vue'
import { useToast } from '../composables/useToast'

const { showToast } = useToast()

const formatPrice = (price) => {
  const formattedPrice = new Intl.NumberFormat('pl-PL').format(price)

  return formattedPrice
}

const availableApartments = apartments.filter((apartment) => {
  return apartment.status === 'available'
})

const availableInvestments = [
  ...new Set(
    availableApartments.map((apartment) => {
      return apartment.investment
    })
  )
]

const firstAvailableApartment = availableApartments[0]
const selectedInvestment = ref(availableInvestments[0])

const apartmentsFromSelectedInvestment = computed(() => {
  return availableApartments.filter((apartment) => {
    return apartment.investment === selectedInvestment.value
  })
})

const handleInvestmentChange = (investmentName) => {
  selectedInvestment.value = investmentName

  const firstApartment = apartmentsFromSelectedInvestment.value[0]

  selectedApartmentId.value = firstApartment?.id ?? null
}

const handleApartmentChange = (apartmentId) => {
  const apartment = apartmentsFromSelectedInvestment.value.find((item) => {
    return String(item.id) === String(apartmentId)
  })

  selectedApartmentId.value = apartment?.id ?? null
}

const selectedApartmentId = ref(firstAvailableApartment.id)
const ownContribution = ref(100000)
const finishingCostPerMeter = ref(2500)
const notaryFee = ref(4000)

const includeParkingSpace = ref(false)
const parkingSpacePrice = ref(35000)

const includeStorageRoom = ref(false)
const storageRoomPrice = ref(15000)

const parkingCost = computed(() => {
  if (includeParkingSpace.value) {
    return parkingSpacePrice.value || 0
  }

  return 0
})

const storageRoomCost = computed(() => {
  if (includeStorageRoom.value) {
    return storageRoomPrice.value || 0
  }

  return 0
})

const totalAdditionalCosts = computed(() => {
  const notaryCost = notaryFee.value || 0

  return notaryCost + parkingCost.value + storageRoomCost.value
})

const finishingStandards = [
  {
    name: 'Podstawowy',
    price: 1800
  },
  {
    name: 'Komfort',
    price: 2500
  },
  {
    name: 'Premium',
    price: 3500
  }
]

const selectFinishingStandard = (price) => {
  finishingCostPerMeter.value = price
}

const selectedApartment = computed(() => {
  const foundApartment = apartmentsFromSelectedInvestment.value.find(
    (apartment) => {
      return apartment.id === selectedApartmentId.value
    }
  )

  return foundApartment || apartmentsFromSelectedInvestment.value[0] || null
})

const neededLoan = computed(() => {
  if (!selectedApartment.value) {
    return 0
  }

  const apartmentPrice = selectedApartment.value.price
  const contribution = ownContribution.value || 0
  const loanAmount = apartmentPrice - contribution

  return Math.max(loanAmount, 0)
})

const totalFinishingCost = computed(() => {
  if (!selectedApartment.value) {
    return 0
  }

  const apartmentArea = selectedApartment.value.area
  const costPerMeter = finishingCostPerMeter.value || 0

  return apartmentArea * costPerMeter
})

const totalPurchaseCost = computed(() => {
  if (!selectedApartment.value) {
    return 0
  }

  return (
    selectedApartment.value.price +
    totalFinishingCost.value +
    totalAdditionalCosts.value
  )
})

const contributionPercent = computed(() => {
  if (!selectedApartment.value) {
    return 0
  }

  const apartmentPrice = selectedApartment.value.price
  const contribution = ownContribution.value || 0
  const percent = (contribution / apartmentPrice) * 100

  return Math.min(Math.round(percent), 100)
})

const hasLowContribution = computed(() => {
  return contributionPercent.value < 20
})

const resetCalculator = () => {
  selectedInvestment.value = availableInvestments[0]

  const firstApartment = availableApartments.find((apartment) => {
    return apartment.investment === selectedInvestment.value
  })

  selectedApartmentId.value = firstApartment?.id ?? null

  ownContribution.value = 100000
  finishingCostPerMeter.value = 2500
  notaryFee.value = 4000

  includeParkingSpace.value = false
  parkingSpacePrice.value = 35000

  includeStorageRoom.value = false
  storageRoomPrice.value = 15000

  showToast('Kalkulator został zresetowany', 'info')
}

const saveCalculation = () => {
  const calculation = {
    selectedInvestment: selectedInvestment.value,
    selectedApartmentId: selectedApartmentId.value,
    ownContribution: ownContribution.value,
    finishingCostPerMeter: finishingCostPerMeter.value,
    notaryFee: notaryFee.value,
    includeParkingSpace: includeParkingSpace.value,
    parkingSpacePrice: parkingSpacePrice.value,
    includeStorageRoom: includeStorageRoom.value,
    storageRoomPrice: storageRoomPrice.value
  }

  localStorage.setItem('purchase-calculation', JSON.stringify(calculation))

  showToast('Kalkulacja została zapisana')
}

const loadSavedCalculation = () => {
  const savedCalculation = localStorage.getItem('purchase-calculation')

  if (!savedCalculation) {
    return
  }

  try {
    const calculation = JSON.parse(savedCalculation)

    const investmentExists = availableInvestments.includes(
      calculation.selectedInvestment
    )

    if (investmentExists) {
      selectedInvestment.value = calculation.selectedInvestment
    }

    const apartmentExists = apartmentsFromSelectedInvestment.value.find(
      (apartment) => {
        return apartment.id === calculation.selectedApartmentId
      }
    )

    selectedApartmentId.value =
      apartmentExists?.id ??
      apartmentsFromSelectedInvestment.value[0]?.id ??
      null

    ownContribution.value = calculation.ownContribution ?? 100000
    finishingCostPerMeter.value = calculation.finishingCostPerMeter ?? 2500

    notaryFee.value = calculation.notaryFee ?? 4000

    includeParkingSpace.value = calculation.includeParkingSpace ?? false

    parkingSpacePrice.value = calculation.parkingSpacePrice ?? 35000

    includeStorageRoom.value = calculation.includeStorageRoom ?? false

    storageRoomPrice.value = calculation.storageRoomPrice ?? 15000
  } catch {
    localStorage.removeItem('purchase-calculation')

    showToast('Nie udało się wczytać zapisanej kalkulacji', 'error')
  }
}

onMounted(() => {
  loadSavedCalculation()
})
</script>

<template>
  <main class="min-h-screen bg-page pt-[74px] sm:pt-[88px]">
    <section class="bg-brand py-[clamp(48px,7vw,88px)]">
      <div class="container">
        <p class="mb-4 text-xs font-bold tracking-[0.18em] text-gold uppercase">
          Zaplanuj swój budżet
        </p>

        <h1 class="max-w-[760px] text-[clamp(40px,6vw,76px)] text-panel">
          Kalkulator kosztów zakupu
        </h1>

        <p class="mt-5 max-w-[620px] text-base text-white/70">
          Sprawdź pełny koszt zakupu mieszkania, wysokość dodatkowych opłat oraz
          potrzebnego finansowania.
        </p>
      </div>
    </section>

    <section class="py-[clamp(48px,7vw,88px)]">
      <div
        class="container grid items-start gap-8 lg:grid-cols-[minmax(0,1.25fr)_minmax(360px,0.75fr)]"
      >
        <div>
          <CalculatorApartmentStep
            :investments="availableInvestments"
            :apartments="apartmentsFromSelectedInvestment"
            :selected-investment="selectedInvestment"
            :selected-apartment-id="selectedApartmentId"
            :selected-apartment="selectedApartment"
            @select-investment="handleInvestmentChange"
            @select-apartment="handleApartmentChange"
          />

          <CalculatorFinancingStep
            v-model:own-contribution="ownContribution"
            :contribution-percent="contributionPercent"
            :needed-loan="neededLoan"
            :has-low-contribution="hasLowContribution"
          />

          <CalculatorFinishingStep
            v-model:cost-per-meter="finishingCostPerMeter"
            :standards="finishingStandards"
            :total-cost="totalFinishingCost"
            :apartment-area="selectedApartment?.area || 0"
          />

          <CalculatorAdditionalCostsStep
            v-model:include-parking-space="includeParkingSpace"
            v-model:parking-space-price="parkingSpacePrice"
            v-model:include-storage-room="includeStorageRoom"
            v-model:storage-room-price="storageRoomPrice"
            v-model:notary-fee="notaryFee"
            :total-additional-costs="totalAdditionalCosts"
          />
        </div>

        <CalculatorSummary
          :apartment-price="selectedApartment?.price || 0"
          :finishing-cost="totalFinishingCost"
          :additional-costs="totalAdditionalCosts"
          :total-cost="totalPurchaseCost"
          :needed-loan="neededLoan"
          @save="saveCalculation"
          @reset="resetCalculator"
        />
      </div>
    </section>
  </main>
</template>
