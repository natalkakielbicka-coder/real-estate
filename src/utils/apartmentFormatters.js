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
