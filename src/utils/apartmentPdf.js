import {
  formatPrice,
  formatPricePerMeter,
  getFloorLabel,
  getRoomsLabel
} from './apartmentFormatters'
import { formatCompletionDate } from './dateFormatters'

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

  const documentDefinition = {
    pageSize: 'A4',

    pageMargins: [48, 48, 48, 48],

    info: {
      title: `Karta mieszkania ${apartment.number}`,
      author: 'Residence Real Estate',
      subject: `Oferta mieszkania ${apartment.number}`
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
      }
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
      }
    }
  }

  await pdfMake
    .createPdf(documentDefinition)
    .download(getPdfFilename(apartment))
}
