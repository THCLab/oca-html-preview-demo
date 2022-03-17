import { resolveFromZip, OcaJs } from 'oca.js-form-core'
import { renderOCAForm } from 'oca.js-form-html'

const ocaJs = new OcaJs({ dataVaults: ['https://data-vault.argo.colossi.network/api/v2/files']})
const app = document.querySelector('#app')

const fileChooser = document.querySelector('#file-input')
fileChooser.onchange = async e => {
  const file = e.target.files[0]
  const oca = await resolveFromZip(file)
  const structure = await ocaJs.createStructure(oca)
  const onSubmitHandler = (capturedData) => {
    console.log(capturedData)
  }
  const form = renderOCAForm(structure, {}, {
    showPii: true,
    defaultLanguage: 'en',
    onSubmitHandler
  })
  app.innerHTML = form
}
