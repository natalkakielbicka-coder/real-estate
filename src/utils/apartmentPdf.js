import {
  formatPrice,
  formatPricePerMeter,
  getFloorLabel,
  getRoomsLabel
} from './apartmentFormatters'
import { formatCompletionDate } from './dateFormatters'
import { apartmentStatusLabels } from '../constants/apartmentStatuses'
import { outdoorSpaceLabels } from '../constants/apartmentAttributes'

const apartmentStatusColors = {
  available: '#4f806b',
  reserved: '#c79d62',
  sold: '#929896'
}

const getImageDataUrl = async (imageUrl) => {
  const response = await fetch(imageUrl)

  if (!response.ok) {
    throw new Error('Nie udało się pobrać obrazu')
  }

  const imageBlob = await response.blob()

  return new Promise((resolve, reject) => {
    const reader = new FileReader()

    reader.onload = () => {
      resolve(reader.result)
    }

    reader.onerror = () => {
      reject(new Error('Nie udało się odczytać obrazu'))
    }

    reader.readAsDataURL(imageBlob)
  })
}

const getPdfFilename = (apartment) => {
  const apartmentNumber = apartment.number.toLowerCase().replaceAll('.', '-')

  return `karta-mieszkania-${apartmentNumber}.pdf`
}

export const downloadApartmentPdf = async (apartment) => {
  const [pdfMakeModule, pdfFontsModule] = await Promise.all([
    import('pdfmake/build/pdfmake'),
    import('pdfmake/build/vfs_fonts')
  ])

  const pdfMake = pdfMakeModule.default
  const pdfFonts = pdfFontsModule.default

  pdfMake.addVirtualFileSystem(pdfFonts)

  const apartmentDetails = [
    ['Powierzchnia', `${apartment.area} m²`],
    ['Liczba pokoi', `${apartment.rooms} ${getRoomsLabel(apartment.rooms)}`],
    ['Piętro', getFloorLabel(apartment.floor)],
    ['Cena', `${formatPrice(apartment.price)} zł`],
    [
      'Cena za m²',
      `${formatPricePerMeter(apartment.price, apartment.area)} zł`
    ],
    ['Termin oddania', formatCompletionDate(apartment.completionDate)]
  ]

  const outdoorSpaceLabel = outdoorSpaceLabels[apartment.outdoorSpace.type]

  const apartmentFeatures = [
    ...apartment.features.filter((feature) => {
      return feature !== outdoorSpaceLabel
    }),

    `${outdoorSpaceLabel} ${apartment.outdoorSpace.area} m²`,

    ...(apartment.parkingSpace ? ['Miejsce parkingowe'] : []),

    ...(apartment.storageRoom ? ['Komórka lokatorska'] : [])
  ]

  const floorPlanImage = await getImageDataUrl(apartment.floorPlan).catch(
    () => {
      return null
    }
  )

  const documentDefinition = {
    pageSize: 'A4',

    pageMargins: [48, 48, 48, 64],

    info: {
      title: `Karta mieszkania ${apartment.number}`,
      author: 'Residence Real Estate',
      subject: `Oferta mieszkania ${apartment.number}`
    },

    footer: (currentPage, pageCount) => {
      return {
        columns: [
          {
            text: 'RESIDENCE · REAL ESTATE',
            alignment: 'left'
          },
          {
            text: `${currentPage} / ${pageCount}`,
            alignment: 'right'
          }
        ],

        margin: [48, 20, 48, 0],
        color: '#929896',
        fontSize: 8
      }
    },

    content: [
      {
        text: 'RESIDENCE',
        style: 'brand'
      },
      {
        text: `${apartment.investment} · budynek ${apartment.building}`,
        style: 'eyebrow'
      },
      {
        text: `Mieszkanie ${apartment.number}`,
        style: 'title'
      },
      {
        text: `${apartment.address}, ${apartment.city}`,
        style: 'address'
      },
      {
        table: {
          widths: ['*', 'auto'],

          body: apartmentDetails.map(([label, value]) => {
            return [
              {
                text: label,
                style: 'detailLabel',
                margin: [0, 10, 0, 10]
              },
              {
                text: value,
                style: 'detailValue',
                alignment: 'right',
                margin: [0, 10, 0, 10]
              }
            ]
          })
        },

        layout: {
          hLineWidth: (rowIndex, tableNode) => {
            const isFirstOrLastLine =
              rowIndex === 0 || rowIndex === tableNode.table.body.length

            return isFirstOrLastLine ? 0 : 0.5
          },

          vLineWidth: () => 0,

          hLineColor: () => '#d8dedb'
        },

        margin: [0, 0, 0, 30]
      },
      {
        text: `Status: ${apartmentStatusLabels[apartment.status]}`,
        style: 'status',
        color: apartmentStatusColors[apartment.status]
      },
      {
        text: 'Cechy i udogodnienia',
        style: 'sectionTitle'
      },
      {
        ul: apartmentFeatures,
        style: 'featuresList'
      },
      ...(floorPlanImage
        ? [
            {
              text: `Rzut mieszkania ${apartment.number}`,
              style: 'floorPlanTitle',
              pageBreak: 'before'
            },
            {
              text: `${apartment.investment} · budynek ${apartment.building} · ${getFloorLabel(apartment.floor)}`,
              style: 'floorPlanSubtitle'
            },
            {
              image: floorPlanImage,
              fit: [499, 620],
              alignment: 'center',
              margin: [0, 20, 0, 20]
            },
            {
              text: 'Rzut ma charakter poglądowy i nie stanowi oferty handlowej.',
              style: 'disclaimer'
            }
          ]
        : [])
    ],

    defaultStyle: {
      font: 'Roboto',
      color: '#173f35'
    },

    styles: {
      brand: {
        color: '#c79d62',
        fontSize: 11,
        bold: true,
        characterSpacing: 2,
        margin: [0, 0, 0, 28]
      },

      eyebrow: {
        color: '#c79d62',
        fontSize: 9,
        bold: true,
        characterSpacing: 1.2,
        margin: [0, 0, 0, 8]
      },

      title: {
        color: '#173f35',
        fontSize: 34,
        bold: true,
        margin: [0, 0, 0, 10]
      },

      address: {
        color: '#6f7975',
        fontSize: 10,
        margin: [0, 0, 0, 30]
      },

      detailLabel: {
        color: '#6f7975',
        fontSize: 10
      },

      detailValue: {
        color: '#173f35',
        fontSize: 11,
        bold: true
      },
      status: {
        fontSize: 10,
        bold: true,
        characterSpacing: 0.7,
        margin: [0, 0, 0, 26]
      },

      sectionTitle: {
        color: '#173f35',
        fontSize: 17,
        bold: true,
        margin: [0, 0, 0, 14]
      },

      featuresList: {
        color: '#6f7975',
        fontSize: 10,
        lineHeight: 1.4,
        margin: [4, 0, 0, 0]
      },
      floorPlanTitle: {
        color: '#173f35',
        fontSize: 25,
        bold: true,
        margin: [0, 0, 0, 8]
      },

      floorPlanSubtitle: {
        color: '#c79d62',
        fontSize: 9,
        bold: true,
        characterSpacing: 0.7
      },

      disclaimer: {
        color: '#929896',
        fontSize: 8,
        italics: true,
        alignment: 'center'
      }
    }
  }

  await pdfMake
    .createPdf(documentDefinition)
    .download(getPdfFilename(apartment))
}
