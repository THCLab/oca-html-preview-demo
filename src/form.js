import { resolveFromZip, OcaJs } from 'oca.js-form-core'
import { renderOCAForm } from 'oca.js-form-html'

const ocaJs = new OcaJs({})
const app = document.querySelector('#app')

const fileChooser = document.querySelector('#file-input')
fileChooser.onchange = async e => {
  const file = e.target.files[0]
  const oca = await resolveFromZip(file)
  const structure = await ocaJs.createStructure(oca)
  console.log(structure)
  const form = renderOCAForm(structure)
  console.log(form)
  app.innerHTML = form
  app.style.cssText = "border: solid 1px; padding: 5px;"
}
