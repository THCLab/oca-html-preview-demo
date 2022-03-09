import { OcaJs } from 'oca.js-form-core'
import { renderOCACredential } from 'oca.js-form-html'

const dataVaults = ['https://data-vault.argo.colossi.network/api/v2/files']

const ocaJs = new OcaJs({ dataVaults })
const app = document.querySelector('#app')
const verifiedSign = document.querySelector('#verified-sign')
const notVerifiedSign = document.querySelector('#not-verified-sign')

const renderButton = document.querySelector('#render-button')

renderButton.onclick = async _ => {
  app.style.position = 'static'
  verifiedSign.style.display = 'none'
  notVerifiedSign.style.display = 'none'
  const acdcInput = document.querySelector('#acdc-input').value

  const tdaUrlInput = document.querySelector('#tda-url-input').value
  const tdaUrl = new URL(tdaUrlInput)
  let attestationResponse
  try {
    attestationResponse = await fetch(`${tdaUrl.origin}/attestations`, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain' },
      body: acdcInput
    })
  } catch (_err) {
    app.innerHTML = `Error: Faild to fetch ${tdaUrl.origin}/attestations`
    app.style.color = 'red'
  }
  if (attestationResponse.status === 500) {
    app.innerHTML = 'Error: ' + await attestationResponse.text()
    app.style.color = 'red'
    verifiedSign.style.display = 'none'
    notVerifiedSign.style.display = 'none'
  } else {
    const acdc = await attestationResponse.json()

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

    if (attestationResponse.status === 200) {
      verifiedSign.style.display = 'inline-block'
    } else {
      app.style.position = 'absolute'
      notVerifiedSign.style.display = 'inline-block'
    }
  }
}
