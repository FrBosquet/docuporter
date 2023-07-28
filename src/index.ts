import * as path from 'path'
import * as fs from 'fs'

export class DocuPorter {
  private filePath: string
  private muted = false

  constructor(fileName: string) {
    this.filePath = path.join(process.cwd(), fileName)

    fs.writeFileSync(this.filePath, '')
  }

  reset() {
    fs.writeFileSync(this.filePath, '')
  }

  private append(text: string) {
    if (!this.muted) {
      fs.appendFileSync(this.filePath, `\n${text}`)
    }
  }

  appendHeader(header: string, order: 1 | 2 | 3 | 4 | 5 = 2) {
    this.append(`${'#'.repeat(order)} ${header}\n`)
  }

  appendText(...text: string[]) {
    this.append(`${text.join(' ')}\n`)
  }

  appendCode(code: string, lang = '') {
    const codeBlock = '```'

    this.append(`${codeBlock}${lang}\n${code}\n${codeBlock}\n`)
  }

  appendJson(json: any) {
    this.appendCode(JSON.stringify(json, null, 2), 'JSON')
  }

  appendJs(js: string) {
    this.appendCode(js, 'JavaScript')
  }

  appendTs(ts: any) {
    this.appendCode(ts, 'TypeScrypt')
  }

  text = this.appendText
  json = this.appendJson
  js = this.appendJs
  ts = this.appendTs
  header = this.appendHeader
  h1 = (header: string) => this.appendHeader(header, 1)
  h2 = (header: string) => this.appendHeader(header, 2)
  h3 = (header: string) => this.appendHeader(header, 3)
  h4 = (header: string) => this.appendHeader(header, 4)
  h5 = (header: string) => this.appendHeader(header, 5)

  mute(value: boolean) {
    if (this.muted) return;

    this.muted = value
  }

  log(...args: any[]) {
    if (!this.muted) {
      console.log(...args)
    }
  }

  get quiet() {
    return this.muted
  }

  get loud() {
    return !this.muted
  }

  stopMute() {
    this.muted = false
  }
}