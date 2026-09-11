const apartmentAreaPoints = [
  '143,105 691,105 691,489 84,489 84,344 43,344 43,118 143,118',
  '844,105 1392,105 1392,118 1493,118 1493,344 1392,344 1392,489 844,489',
  '84,493 691,493 691,850 143,850 143,837 43,837 43,624 84,624',
  '844,493 1392,493 1392,624 1493,624 1493,837 1392,837 1392,850 844,850'
]

const createApartmentAreas = (apartmentIds) => {
  return apartmentIds.map((apartmentId, index) => ({
    apartmentId,
    points: apartmentAreaPoints[index]
  }))
}

const createFloorPlan = ({ floor, name, apartmentIds }) => ({
  id: `zielone-tarasy-a-${floor}`,
  investmentId: 'zielone-tarasy',
  building: 'A',
  floor,
  name,
  image: '/images/floors/zielone-tarasy-a-parter.png',
  viewBox: '0 0 1536 1024',
  apartmentAreas: createApartmentAreas(apartmentIds)
})

export const floorPlans = [
  createFloorPlan({
    floor: 0,
    name: 'Budynek A — parter',
    apartmentIds: [1, 2, 21, 22]
  }),
  createFloorPlan({
    floor: 1,
    name: 'Budynek A — 1. piętro',
    apartmentIds: [23, 24, 25, 3]
  }),
  createFloorPlan({
    floor: 2,
    name: 'Budynek A — 2. piętro',
    apartmentIds: [26, 27, 28, 4]
  }),
  createFloorPlan({
    floor: 3,
    name: 'Budynek A — 3. piętro',
    apartmentIds: [29, 30, 31, 32]
  }),
  createFloorPlan({
    floor: 4,
    name: 'Budynek A — 4. piętro',
    apartmentIds: [33, 5, 34, 35]
  })
]
