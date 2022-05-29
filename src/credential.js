import { resolveFromZip, OcaJs } from 'oca.js-form-core'
import { renderOCACredential } from 'oca.js-form-html'
import { photoBase64 } from './assets/photoBase64'
import { signatureBase64 } from './assets/signatureBase64'

const ocaJs = new OcaJs({
  dataVaults: ['https://data-vault.argo.colossi.network/api/v2/files'],
  ocaRepositories: ['https://repository.oca.argo.colossi.network/api/v0.1/schemas']
})
const app = document.querySelector('#app')

const fileChooser = document.querySelector('#file-input')
fileChooser.onchange = async e => {
  let ocaBundleFile = e.target.files[0]
  const files = []
  for (let i = 0; i < e.target.files.length; i++) {
    const file = e.target.files[i]
    if (file.type === 'application/zip') {
      ocaBundleFile = file
    } else {
      files.push(file)
    }
  }
  const additionalOverlays = (await Promise.all(files.map(f => readFile(f)))).map(o => JSON.parse(o))

  const oca = await resolveFromZip(ocaBundleFile)
  const structure = await ocaJs.createStructure(oca)
  const captureBaseSAI = structure.captureBaseSAI
  const credential = await renderOCACredential(structure, dataRepo[captureBaseSAI], {
    defaultLanguage: 'en',
    dataVaultUrl: 'https://data-vault.argo.colossi.network/api/v1/files',
    ocaRepoHostUrl: 'https://repository.oca.argo.colossi.network',
    additionalOverlays
  })
  app.innerHTML = credential.node
  app.style.width = `min(${credential.config.width}, 100%)`
  app.style['min-width'] = credential.config.width / 2
  app.style.height = credential.config.height
}

const readFile = (file) => {
  return new Promise((resolve, reject) => {
    var fr = new FileReader()
    fr.onload = () => {
      resolve(fr.result)
    }
    fr.onerror = reject
    fr.readAsText(file)
  })
}

const dataRepo = {
  EYz7AI0ePCPnpmTpM0CApKoMzBA5bkwek1vsRBEQuMdQ: {
    drivingLicenseID: 'I12345678',
    expirationDate: '08/31/2019',
    lastName: 'Card',
    firstName: 'Holder',
    buildingNumber: '3570',
    street: '21th Street',
    city: 'Sacramento',
    state: 'CA',
    zipCode: '95818',
    dateOfBirth: '08/29/1977',
    restrictions: 'None',
    class: 'C',
    endorsements: 'None',
    sex: 'M',
    hairColor: 'brn',
    eyesColor: 'blu',
    height: '5\'-55"',
    weight: '125',
    documentDiscriminator: '09/30/201060221/21FD/18',
    issueDate: '09/06/2010'
  },
  'ERY1EB9L3dDyLW-b0cwmQrkS-hBebmjKu2ylU75iYq8c': {
    dateOfBirth: "",
    dateOfExpiry: "",
    dateOfIssue: [
        "2022-04-30",
        "2022-05-30"
    ],
    documentNumber: "",
    documentType: "",
    fullName: "",
    issuedBy: "",
    issuingState: "AZE",
    height: '180',
    issuingStateCode: [],
    nationality: "",
    optionalData: "",
    optionalDocumentData: "",
    optionalPersonalData: "180",
    personalNumber: "",
    photoImage: "",
    placeOfBirth: "",
    primaryIdentifier: "",
    secondaryIdentifier: "",
    sex: "unknown",
    signatureImage: ""
  },
  EPMaG1h2hVxKCZ5_3KoNNwgAyd4Eq8zrxK3xgaaRsz2M: {
    documentType: 'PA',
    issuingState: 'CHE',
    issuingStateCode: 'che',
    documentNumber: 'c0000000',
    primaryIdentifier: 'John',
    secondaryIdentifier: 'Citizen',
    nationality: 'CHE',
    dateOfBirth: '28.01.0000',
    personalNumber: '',
    sex: 'M',
    placeOfBirth: 'Luzern LU',
    optionalPersonalData: '170',
    dateOfIssue: '11.07.0000',
    issuedBy: 'Luzern LU',
    dateOfExpiry: '11.07.0000',
    photoImage: photoBase64,
    signatureImage: signatureBase64
  }
}
