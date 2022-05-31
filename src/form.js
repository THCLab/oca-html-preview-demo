import { resolveFromZip, OcaJs } from 'oca.js-form-core'
import { renderOCAForm } from 'oca.js-form-html'

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
  const onSubmitHandler = (capturedData) => {
    console.log(capturedData)
  }
  const data = {}
  const form = await renderOCAForm(structure, data, {
    showFlagged: true,
    defaultLanguage: 'en',
    onSubmitHandler,
    ocaRepoHostUrl: 'https://repository.oca.argo.colossi.network',
    additionalOverlays
  })
  app.innerHTML = form
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
