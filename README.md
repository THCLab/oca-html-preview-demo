# Rendering OCA Form and Credential - Demo app

see [demo](https://demo.oca.argo.colossi.network/)

## OCA (Overlays Capture Architecture)

OCA may be represented in two formats: JSON or ZIP file.

- JSON

```js
{
  capture_base: { ... },
  overlays: [ { ... }, { ... }, ... ],
  references?: { ... }
}
```

- ZIP
OCA zip is a set of JSON files. Structure of such zip is:

```
OCA.zip
├── meta.json
├── [Capture Base SAI].json
├── [Overlay 1 SAI].json
├── [Overlay 2 SAI].json
└── ...
```

where `meta.json` is human readable file indexing type of file's conent to it's SAI

## Samples

- [Swiss Passport](https://repository-old.oca.argo.colossi.network/api/v0.1/schemas/E2oRZ5zEKxTfTdECW-v2Q7bM_H0OD0ko7IcCwdo_u9co/archive)
- [Passport with generated layouts](https://repository-old.oca.argo.colossi.network/api/v0.1/schemas/E-dPLS2l3i2MBnmGHMW4oBJTd_D1_tR5prT5jPj1jgAQ/archive)
  - [UnitOverlay - Imperial Units metric system](https://repository-old.oca.argo.colossi.network/api/v0.1/schemas/EKotApLbKlwUljp6HpdkWG__vMlT4SWO2dg0TKLAKmUg/archive)

## Libs

### [oca.js-form-core](https://github.com/THCLab/oca.js-form-core)

It's a package for parsing OCA JSON to more friendly JSON format for forms
(named Strucutre):  
`createStructure: (oca: OCA) => Promise<Structure>`  
Additionaly, it allows to parse OCA zip to OCA JSON:  
`resolveFromZip: (file: File) => Promise<OCA>`

### [oca.js-form-html](https://github.com/THCLab/oca.js-form-html)

Renders HTML element of Form or Credential.  

```js
renderOCAForm: (
    structure: Structure
    data: { [key: string]: string },
    config: {
      showFlagged?: boolean
      defaultLanguage?: string
      onSubmitHandler?: (capturedData: { [key: string]: string }) => void
      ocaRepoHostUrl?: string
      additionalOverlays?: Overlay[]
    }
  ) => Promise<string>
```

```js
renderOCACredential: (
    structure: Structure,
    data: { [key: string]: string },
    config: {
      dataVaultUrl?: string
      ocaRepoHostUrl?: string
      additionalOverlays?: Overlay[]
    }
  ) => Promise<{
    node: string
    config: { width: string; height: string }
    pageNumber: number
  }>
```

## Snippets

### Rendering Form HTML

[./src/form.js](./src/form.js)

```js
import { resolveFromZip, OcaJs } from 'oca.js-form-core'
import { renderOCAForm } from 'oca.js-form-html'

const ocaJs = new OcaJs({})

const fileChooser = document.querySelector('#file-input')
fileChooser.onchange = async e => {
  const file = e.target.files[0]
  const oca = await resolveFromZip(file)
  const structure = await ocaJs.createStructure(oca)
  const form = renderOCAForm(structure, {}, {})
  console.log(form)
}
```

### Rendering Credential HTML

[./src/credential.js](./src/credential.js)

```js
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

