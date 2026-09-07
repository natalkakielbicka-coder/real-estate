export const getApartmentsCountByInvestment = (apartments, investmentId) => {
  return apartments.filter((apartment) => {
    return apartment.investmentId === investmentId
  }).length
}

export const getInvestmentStatusCounts = (apartments, investmentId) => {
  const investmentApartments = apartments.filter((apartment) => {
    return apartment.investmentId === investmentId
  })

  return {
    available: investmentApartments.filter((apartment) => {
      return apartment.status === 'available'
    }).length,

    reserved: investmentApartments.filter((apartment) => {
      return apartment.status === 'reserved'
    }).length,

    sold: investmentApartments.filter((apartment) => {
      return apartment.status === 'sold'
    }).length
  }
}
