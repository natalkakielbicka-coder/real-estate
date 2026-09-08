export const getFloorLabel = (floor) => {
  return floor === 0 ? 'Parter' : `${floor}. piętro`
}

export const formatPrice = (price) => {
  return new Intl.NumberFormat('pl-PL').format(price)
}

export const formatPricePerMeter = (price, area) => {
  const pricePerMeter = price / area

  return new Intl.NumberFormat('pl-PL', {
    maximumFractionDigits: 0
  }).format(pricePerMeter)
}

export const getApartmentsLabel = (count) => {
  if (count === 1) {
    return 'mieszkanie'
  }

  const lastDigit = count % 10
  const lastTwoDigits = count % 100

  const usesMieszkania =
    lastDigit >= 2 &&
    lastDigit <= 4 &&
    (lastTwoDigits < 12 || lastTwoDigits > 14)

  return usesMieszkania ? 'mieszkania' : 'mieszkań'
}

export const getOffersLabel = (count) => {
  if (count === 1) {
    return 'oferta'
  }

  const lastDigit = count % 10
  const lastTwoDigits = count % 100

  const usesOferty =
    lastDigit >= 2 &&
    lastDigit <= 4 &&
    (lastTwoDigits < 12 || lastTwoDigits > 14)

  return usesOferty ? 'oferty' : 'ofert'
}
