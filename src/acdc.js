import { OcaJs } from 'oca.js-form-core'
import { renderOCACredential } from 'oca.js-form-html'

const ocaJs = new OcaJs({ dataVaults: ['https://data-vault.argo.colossi.network'] })
const app = document.querySelector('#app')
const verifiedSign = document.querySelector('#verified-sign')
const notVerifiedSign = document.querySelector('#not-verified-sign')

const renderButton = document.querySelector('#render-button')

renderButton.onclick = async _ => {
  app.style.position = 'static'
  verifiedSign.style.display = 'none'
  notVerifiedSign.style.display = 'none'
  const acdcInput = document.querySelector('#acdc-input').value
  const dataStoreHostInput = document.querySelector('#data-store-host-input').value
  const dataStoreUrl = new URL(dataStoreHostInput)

  const attestationSplited = acdcInput.split('}-')
  const acdc = JSON.parse(attestationSplited[0] + '}')
  console.log(acdc)

  const oca = await (await fetch(`https://repository.oca.argo.colossi.network/api/v0.1/schemas/${acdc.s}`)).json()

  let capturedData = {}
  if (typeof acdc.a === 'string') {
    capturedData = await (await fetch(`${dataStoreUrl}api/v1/files/${acdc.a}`)).json()
  } else {
    capturedData = acdc.a
  }

  const structure = await ocaJs.createStructure(oca)
  const credential = await renderOCACredential(structure, capturedData, {
    defaultLanguage: 'en',
    dataVaultUrl: 'https://data-vault.argo.colossi.network'
  })
  app.style.position = 'absolute'
  notVerifiedSign.style.display = 'inline-block'
  app.innerHTML = credential.node
  app.style.width = parseInt(credential.config.width, 10) + 38
  app.style.height = parseInt(credential.config.height, 10) + 76
}
