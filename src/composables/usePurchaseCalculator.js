import { computed, ref, onMounted } from 'vue'
import { apartments } from '../data/apartments'
import { useToast } from './useToast'

const STORAGE_KEY = 'purchase-calculation'

const DEFAULT_CALCULATION = {
  ownContribution: 100000,
  finishingCostPerMeter: 2500,
  notaryFee: 4000,
  includeParkingSpace: false,
  parkingSpacePrice: 35000,
  includeStorageRoom: false,
  storageRoomPrice: 15000
}

export const usePurchaseCalculator = () => {
  const { showToast } = useToast()
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

  const selectedInvestment = ref(availableInvestments[0] ?? '')
  const selectedApartmentId = ref(availableApartments[0]?.id ?? null)
  const ownContribution = ref(DEFAULT_CALCULATION.ownContribution)

  const finishingCostPerMeter = ref(DEFAULT_CALCULATION.finishingCostPerMeter)

  const notaryFee = ref(DEFAULT_CALCULATION.notaryFee)

  const includeParkingSpace = ref(DEFAULT_CALCULATION.includeParkingSpace)

  const parkingSpacePrice = ref(DEFAULT_CALCULATION.parkingSpacePrice)

  const includeStorageRoom = ref(DEFAULT_CALCULATION.includeStorageRoom)

  const storageRoomPrice = ref(DEFAULT_CALCULATION.storageRoomPrice)

  const apartmentsFromSelectedInvestment = computed(() => {
    return availableApartments.filter((apartment) => {
      return apartment.investment === selectedInvestment.value
    })
  })

  const selectedApartment = computed(() => {
    const apartment = apartmentsFromSelectedInvestment.value.find((item) => {
      return String(item.id) === String(selectedApartmentId.value)
    })

    return apartment ?? apartmentsFromSelectedInvestment.value[0] ?? null
  })

  const neededLoan = computed(() => {
    if (!selectedApartment.value) {
      return 0
    }

    const apartmentPrice = selectedApartment.value.price
    const contribution = ownContribution.value || 0

    return Math.max(apartmentPrice - contribution, 0)
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

  const totalFinishingCost = computed(() => {
    if (!selectedApartment.value) {
      return 0
    }

    const apartmentArea = selectedApartment.value.area
    const costPerMeter = finishingCostPerMeter.value || 0

    return apartmentArea * costPerMeter
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

  const selectInvestment = (investmentName) => {
    selectedInvestment.value = investmentName

    const firstApartment = apartmentsFromSelectedInvestment.value[0]

    selectedApartmentId.value = firstApartment?.id ?? null
  }

  const selectApartment = (apartmentId) => {
    const apartment = apartmentsFromSelectedInvestment.value.find((item) => {
      return String(item.id) === String(apartmentId)
    })

    selectedApartmentId.value = apartment?.id ?? null
  }

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

  const applyCalculationValues = (calculation) => {
    ownContribution.value =
      calculation.ownContribution ?? DEFAULT_CALCULATION.ownContribution

    finishingCostPerMeter.value =
      calculation.finishingCostPerMeter ??
      DEFAULT_CALCULATION.finishingCostPerMeter

    notaryFee.value = calculation.notaryFee ?? DEFAULT_CALCULATION.notaryFee

    includeParkingSpace.value =
      calculation.includeParkingSpace ?? DEFAULT_CALCULATION.includeParkingSpace

    parkingSpacePrice.value =
      calculation.parkingSpacePrice ?? DEFAULT_CALCULATION.parkingSpacePrice

    includeStorageRoom.value =
      calculation.includeStorageRoom ?? DEFAULT_CALCULATION.includeStorageRoom

    storageRoomPrice.value =
      calculation.storageRoomPrice ?? DEFAULT_CALCULATION.storageRoomPrice
  }

  const resetCalculator = () => {
    selectedInvestment.value = availableInvestments[0] ?? ''

    const firstApartment = apartmentsFromSelectedInvestment.value[0]

    selectedApartmentId.value = firstApartment?.id ?? null

    applyCalculationValues(DEFAULT_CALCULATION)

    localStorage.removeItem(STORAGE_KEY)

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

    localStorage.setItem(STORAGE_KEY, JSON.stringify(calculation))

    showToast('Kalkulacja została zapisana')
  }

  const loadSavedCalculation = () => {
    const savedCalculation = localStorage.getItem(STORAGE_KEY)

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
          return (
            String(apartment.id) === String(calculation.selectedApartmentId)
          )
        }
      )

      selectedApartmentId.value =
        apartmentExists?.id ??
        apartmentsFromSelectedInvestment.value[0]?.id ??
        null

      applyCalculationValues(DEFAULT_CALCULATION)
    } catch {
      localStorage.removeItem(STORAGE_KEY)

      showToast('Nie udało się wczytać zapisanej kalkulacji', 'error')
    }
  }

  onMounted(loadSavedCalculation)

  return {
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
  }
}
