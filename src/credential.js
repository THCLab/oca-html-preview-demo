import { resolveFromZip, OcaJs } from 'oca.js-form-core'
import { renderOCACredential } from 'oca.js-form-html'

const ocaJs = new OcaJs({
  dataVaults: ['https://data-vault.argo.colossi.network'],
  ocaRepositories: ['https://repository.oca.argo.colossi.network/api/v0.1/schemas']
})
const app = document.querySelector('#app')

const inputs = {
  ocaBundle: document.querySelector('#oca-bundle-file-input'),
  recordSAID: document.querySelector('#record-said-input'),
  dataStoreHost: document.querySelector('#data-store-host-input')
}
const loadBtn = document.querySelector('#load-btn')

loadBtn.onclick = async () => {
  const inputValues = {
    ocaBundle: inputs.ocaBundle.files[0],
    recordSAID: inputs.recordSAID.value,
    dataStoreHost: inputs.dataStoreHost.value
  }

  const errors = []
  app.innerHTML = ''

  if (!inputValues.ocaBundle) {
    errors.push("Missing OCA Bundle file")
  }
  if (!inputValues.recordSAID) {
    errors.push("Missing record SAID")
  }
  if (!inputValues.dataStoreHost) {
    errors.push("Missing data store host")
  }

  if (errors.length == 0) {
    const oca = await resolveFromZip(inputValues.ocaBundle)
    const structure = await ocaJs.createStructure(oca)
    const recordResponse = await fetch(`${inputValues.dataStoreHost}/api/v1/files/${inputValues.recordSAID}`)
    const record = await recordResponse.json()
    console.log(record)
    const credential = await renderOCACredential(structure, record, {
      defaultLanguage: 'en',
      dataVaultUrl: 'https://data-vault.argo.colossi.network',
      ocaRepoHostUrl: 'https://repository.oca.argo.colossi.network'
    })
    app.innerHTML = credential.node
    app.style.width = `min(${credential.config.width}, 100%)`
    app.style['min-width'] = credential.config.width / 2
    app.style.height = credential.config.height
  } else {
    app.style.color = 'red'
    errors.forEach(e => {
      app.innerHTML += e + '<br>'
    })
  }
}
