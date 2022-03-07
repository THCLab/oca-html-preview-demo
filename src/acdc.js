import { OcaJs } from 'oca.js-form-core'
import { renderOCACredential } from 'oca.js-form-html'

const dataVaults = ['https://data-vault.argo.colossi.network/api/v2/files']

const ocaJs = new OcaJs({ dataVaults })
const app = document.querySelector('#app')

const renderButton = document.querySelector('#render-button')

renderButton.onclick = async _ => {
  const acdcInput = document.querySelector('#acdc-input').value
  const acdc = JSON.parse(acdcInput.split('}-')[0] + '}')

  const oca = await (await fetch(`https://repository.oca.argo.colossi.network/api/v4/schemas/${acdc.s}`)).json()

  let capturedData = {}
  if (typeof acdc.a === 'string') {
    capturedData = await (await fetch(`${dataVaults[0]}/${acdc.a}`)).json()
  } else {
    capturedData = acdc.a
  }

  const structure = await ocaJs.createStructure(oca)
  const credential = renderOCACredential(structure, capturedData, {
    dataVaultUrl: dataVaults[0]
  })
  app.innerHTML = credential.node
  app.style.width = credential.config.width
  app.style.height = parseInt(credential.config.height, 10) / credential.pageNumber + 38
}
