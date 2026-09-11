<script setup>
import { useRoute } from 'vue-router'
import CalculatorApartmentStep from '../components/CalculatorApartmentStep.vue'
import CalculatorFinancingStep from '../components/CalculatorFinancingStep.vue'
import CalculatorFinishingStep from '../components/CalculatorFinishingStep.vue'
import CalculatorAdditionalCostsStep from '../components/CalculatorAdditionalCostsStep.vue'
import CalculatorSummary from '../components/CalculatorSummary.vue'
import { usePurchaseCalculator } from '../composables/usePurchaseCalculator'

const route = useRoute()

const apartmentFromQuery = Array.isArray(route.query.apartment)
  ? route.query.apartment[0]
  : route.query.apartment

const {
  availableInvestments,
  apartmentsFromSelectedInvestment,
  selectedInvestment,
  selectedApartmentId,
  selectedApartment,
  selectInvestment,
  selectApartment,
  ownContribution,
  neededLoan,
  contributionPercent,
  hasLowContribution,
  finishingCostPerMeter,
  finishingStandards,
  totalFinishingCost,
  notaryFee,
  includeParkingSpace,
  parkingSpacePrice,
  includeStorageRoom,
  storageRoomPrice,
  totalAdditionalCosts,
  totalPurchaseCost,
  saveCalculation,
  resetCalculator
} = usePurchaseCalculator(apartmentFromQuery)
</script>

<template>
  <main class="min-h-screen bg-page pt-[88px]">
    <section class="bg-brand py-[clamp(70px,9vw,130px)] text-white">
      <div class="container">
        <p
          class="mb-5 text-[11px] font-bold tracking-[0.16em] text-gold uppercase"
        >
          Zaplanuj swój budżet
        </p>

        <h1
          class="mb-[30px] max-w-[850px] text-[clamp(48px,6vw,76px)] text-white"
        >
          Kalkulator kosztów zakupu
        </h1>

        <p class="mb-0 max-w-[600px] text-[17px] text-[rgba(255,255,255,0.68)]">
          Sprawdź pełny koszt zakupu mieszkania, wysokość dodatkowych opłat oraz
          potrzebnego finansowania.
        </p>
      </div>
    </section>

    <section
      id="calculator"
      class="py-[clamp(48px,7vw,88px)]"
    >
      <div
        class="container grid items-start gap-8 lg:grid-cols-[minmax(0,1.25fr)_minmax(320px,0.75fr)] xl:grid-cols-[minmax(0,1.25fr)_minmax(360px,0.75fr)]"
      >
        <div class="min-w-0">
          <CalculatorApartmentStep
            :investments="availableInvestments"
            :apartments="apartmentsFromSelectedInvestment"
            :selected-investment="selectedInvestment"
            :selected-apartment-id="selectedApartmentId"
            :selected-apartment="selectedApartment"
            @select-investment="selectInvestment"
            @select-apartment="selectApartment"
          />

          <CalculatorFinancingStep
            v-model:own-contribution="ownContribution"
            :contribution-percent="contributionPercent"
            :needed-loan="neededLoan"
            :has-low-contribution="hasLowContribution"
            :apartment-price="selectedApartment?.price || 0"
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
