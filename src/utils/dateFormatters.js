export const formatCompletionDate = (date) => {
  return new Intl.DateTimeFormat('pl-PL', {
    month: 'long',
    year: 'numeric'
  }).format(new Date(date))
}
