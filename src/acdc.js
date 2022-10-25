import { OcaJs } from 'oca.js-form-core'
import { renderOCACredential } from 'oca.js-form-html'

import uuid4 from 'uuid4'
import { sign } from 'tweetnacl'
import { encodeBase64, decodeBase64 } from 'tweetnacl-util'

const ocaJs = new OcaJs({ dataVaults: ['https://data-vault.argo.colossi.network'] })
const app = document.querySelector('#app')
const verifiedSign = document.querySelector('#verified-sign')
const notVerifiedSign = document.querySelector('#not-verified-sign')

const issueButton = document.querySelector('#issue-button')
const renderButton = document.querySelector('#render-button')

const seed = uuid4().replaceAll(/-/gi, '')
const seedB64 = btoa(seed)
const keyPair = sign.keyPair.fromSeed(new TextEncoder().encode(seed))
document.getElementById('issue_seed-input').value = seedB64
document.getElementById('render_seed-input').value = seedB64

issueButton.onclick = async _ => {
  const issueACDCInput = document.getElementById('issue_acdc-input').value
  const acdc = JSON.parse(issueACDCInput)
  const signedACDC = sign(new TextEncoder().encode(JSON.stringify(acdc)), keyPair.secretKey)
  const signedACDCb64 = encodeBase64(signedACDC)
  document.getElementById('render_acdc-input').value = `${issueACDCInput}-AABAA${signedACDCb64}`
}

renderButton.onclick = async _ => {
  app.style.position = 'static'
  verifiedSign.style.display = 'none'
  notVerifiedSign.style.display = 'none'
  const renderACDCInput = document.querySelector('#render_acdc-input').value
  const dataStoreHostInput = document.querySelector('#render_data-store-host-input').value
  const dataStoreUrl = new URL(dataStoreHostInput)

  const attestationSplited = renderACDCInput.split('}-AABAA')
  const acdc = JSON.parse(attestationSplited[0] + '}')
  const signatureB64 = attestationSplited[1]
  const signature = decodeBase64(signatureB64)

  const message = sign.open(signature, keyPair.publicKey)
  if (message) {
    const decodedMsg = new TextDecoder().decode(message)
    if (JSON.stringify(acdc) == decodedMsg) {
      verifiedSign.style.display = 'inline-block'
    } else {
      app.style.position = 'absolute'
      notVerifiedSign.style.display = 'inline-block'
    }
  } else {
    app.style.position = 'absolute'
    notVerifiedSign.style.display = 'inline-block'
  }

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
  app.innerHTML = credential.node
  app.style.width = parseInt(credential.config.width, 10) + 38
  app.style.height = parseInt(credential.config.height, 10) + 76
}
