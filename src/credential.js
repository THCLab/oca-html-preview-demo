import { resolveFromZip, OcaJs } from 'oca.js-form-core'
import { renderOCACredential } from 'oca.js-form-html'
import { mrBeanBase64 } from './assets/mrBeanBase64'
import { signatureBase64 } from './assets/signatureBase64'

const ocaJs = new OcaJs({ dataVaults: ['https://data-vault.argo.colossi.network/api/v2/files']})
const app = document.querySelector('#app')

const fileChooser = document.querySelector('#file-input')
fileChooser.onchange = async e => {
  const file = e.target.files[0]
  const oca = await resolveFromZip(file)
  const captureBaseSAI = oca.overlays[0].capture_base
  const structure = await ocaJs.createStructure(oca)
  const credential = renderOCACredential(structure, dataRepo[captureBaseSAI], {
    dataVaultUrl: 'https://data-vault.argo.colossi.network/api/v1/files'
  })
  app.innerHTML = credential.node
  app.style.width = credential.config.width
  app.style.height = parseInt(credential.config.height, 10) / credential.pageNumber + 38
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
  EPMaG1h2hVxKCZ5_3KoNNwgAyd4Eq8zrxK3xgaaRsz2M: {
    documentType: 'PA',
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
    dateOfIssue: '12.07.0000',
    issuedBy: 'Luzern LU',
    dateOfExpiry: '11.07.0000',
    photoImage: mrBeanBase64,
    signatureImage: signatureBase64
  }
}
