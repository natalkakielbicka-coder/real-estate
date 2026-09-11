export const toNonNegativeNumber = (value) => {
  const number = Number(value)

  if (!Number.isFinite(number) || number < 0) {
    return 0
  }

  return number
}

export const toNumberInputValue = (value) => {
  if (value === '') {
    return ''
  }

  return toNonNegativeNumber(value)
}
