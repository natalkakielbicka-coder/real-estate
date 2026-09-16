export const getLatestPriceChange = (priceHistory = []) => {
  if (priceHistory.length < 2) {
    return null
  }

  const sortedHistory = [...priceHistory].sort((firstEntry, secondEntry) => {
    return new Date(firstEntry.date) - new Date(secondEntry.date)
  })

  const previousEntry = sortedHistory.at(-2)
  const currentEntry = sortedHistory.at(-1)

  const amount = currentEntry.price - previousEntry.price

  if (amount === 0) {
    return null
  }

  const percentage =
    previousEntry.price > 0 ? (amount / previousEntry.price) * 100 : 0

  return {
    amount,
    percentage,
    direction: amount < 0 ? 'decrease' : 'increase'
  }
}
