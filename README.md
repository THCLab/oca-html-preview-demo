# Rendering OCA Form and Credential - Demo app

see [demo](https://demo.oca.argo.colossi.network/)

## OCA (Overlay Capture Architecture)

OCA may be represented in two formats: JSON or ZIP file.

- JSON

```js
{
  capture_base: { ... },
  overlays: [ { ... }, { ... }, ... ]
}
```

- ZIP
OCA zip is a set of JSON files. Structure of such zip is:
```
OCA.zip
├── [Capture Base SAI]
│    ├── [Overlay 1 SAI].json
│    ├── [Overlay 2 SAI].json
│    └── ...
└── [Capture Base SAI].json (Capture Base)
```

## Samples

- [Swiss Passport](https://data-vault.argo.colossi.network/api/v1/files/zQmNSffPUnWxPN6mLfBuX4HM4Dh9gaoZokRLKPkhJ2aKPYt)
- [Driving License (California)](https://data-vault.argo.colossi.network/api/v1/files/zQmUEHF1zm5XXhn9dvSk2NRevKPsHVcnpCYx2C3DuM5F4ui)
- [Driving License (Arizona)](https://data-vault.argo.colossi.network/api/v1/files/zQmPfNmyFTon99HQv2ic79PRSL8i113JfLLYCXGyR8r3qe4)

## Libs

### [oca.js-form-core](https://github.com/THCLab/oca.js-form-core)

It's a package for parsing OCA JSON to more friendly JSON format for forms (named Strucutre):  
`createStructure: (oca: OCA) => Promise<Structure>`  
Additionaly, it allows to parse OCA zip to OCA JSON:  
`resolveFromZip: (file: File) => Promise<OCA>`

### [oca.js-form-html](https://github.com/THCLab/oca.js-form-html)

Renders HTML element of Form or Credential.  
`renderOCAForm: (structure: Structure) => string`
```
renderOCACredential: (
    structure: Structure,
    data: { [key: string]: string },
    config: { dataVaultUrl?: string }
  ) => {
    node: string
    config: { width: string; height: string }
    pageNumber: number
  }
```

## Snippets

### Rendering Form HTML
[./src/form.js](./src/form.js)

```
import { resolveFromZip, OcaJs } from 'oca.js-form-core'
import { renderOCAForm } from 'oca.js-form-html'

const ocaJs = new OcaJs({})

const fileChooser = document.querySelector('#file-input')
fileChooser.onchange = async e => {
  const file = e.target.files[0]
  const oca = await resolveFromZip(file)
  const structure = await ocaJs.createStructure(oca)
  const form = renderOCAForm(structure)
  console.log(form)
}
```

### Rendering Credential HTML
[./src/credential.js](./src/credential.js)

```
import { resolveFromZip, OcaJs } from 'oca.js-form-core'
import { renderOCACredential } from 'oca.js-form-html'

const ocaJs = new OcaJs({})

const fileChooser = document.querySelector('#file-input')
fileChooser.onchange = async e => {
  const file = e.target.files[0]
  const oca = await resolveFromZip(file)
  const structure = await ocaJs.createStructure(oca)
  const credential = renderOCACredential(structure, {}, {})
  console.log(credential)
}
```
