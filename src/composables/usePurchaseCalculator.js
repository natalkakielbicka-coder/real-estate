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

  return {
    availableApartments,
    availableInvestments,
    apartmentsFromSelectedInvestment,
    selectedInvestment,
    selectedApartmentId,
    selectedApartment,
    selectInvestment,
    selectApartment
  }
}
