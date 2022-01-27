import { resolveFromZip, OcaJs } from 'oca.js-form-core'
import { renderOCACredential } from 'oca.js-form-html'

const ocaJs = new OcaJs({})
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
  }
}
