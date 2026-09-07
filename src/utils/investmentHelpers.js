export const getApartmentsCountByInvestment = (apartments, investmentId) => {
  return apartments.filter((apartment) => {
    return apartment.investmentId === investmentId
  }).length
}
