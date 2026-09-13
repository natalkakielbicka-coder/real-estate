export const shuffleArray = (items) => {
  const shuffledItems = [...items]

  for (let index = shuffledItems.length - 1; index > 0; index--) {
    const randomIndex = Math.floor(Math.random() * (index + 1))
    const currentItem = shuffledItems[index]

    shuffledItems[index] = shuffledItems[randomIndex]
    shuffledItems[randomIndex] = currentItem
  }

  return shuffledItems
}
