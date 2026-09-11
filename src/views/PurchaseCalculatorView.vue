<script setup>
import CalculatorApartmentStep from '../components/CalculatorApartmentStep.vue'
import CalculatorFinancingStep from '../components/CalculatorFinancingStep.vue'
import CalculatorFinishingStep from '../components/CalculatorFinishingStep.vue'
import CalculatorAdditionalCostsStep from '../components/CalculatorAdditionalCostsStep.vue'
import CalculatorSummary from '../components/CalculatorSummary.vue'
import { usePurchaseCalculator } from '../composables/usePurchaseCalculator'

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
} = usePurchaseCalculator()
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
            @select-investment="selectInvestment"
            @select-apartment="selectApartment"
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
