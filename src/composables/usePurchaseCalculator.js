import { computed, ref } from 'vue'
import { apartments } from '../data/apartments'

export const usePurchaseCalculator = () => {
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
  const ownContribution = ref(100000)
  const finishingCostPerMeter = ref(2500)

  const notaryFee = ref(4000)

  const includeParkingSpace = ref(false)
  const parkingSpacePrice = ref(35000)

  const includeStorageRoom = ref(false)
  const storageRoomPrice = ref(15000)

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

  return {
    availableApartments,
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
    totalAdditionalCosts
  }
}
