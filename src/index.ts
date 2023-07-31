import * as path from 'path'
import * as fs from 'fs'

export class DocuPorter {
  private filePath: string
  private muted = false
  private values = new Map()
  private conditions = new Map()

  constructor(fileName: string) {
    this.filePath = path.join(process.cwd(), fileName)

    fs.writeFileSync(this.filePath, '')
  }

  reset() {
    fs.writeFileSync(this.filePath, '')
  }

  private append(text: string) {
    if (this.valuesMatch() && !this.muted) {
      fs.appendFileSync(this.filePath, `\n${text}`)
    }
  }

  appendHeader(header: string, order: 1 | 2 | 3 | 4 | 5 = 2) {
    this.append(`${'#'.repeat(order)} ${header}\n`)
  }

  appendText(...text: string[]) {
    // use :: to start/end inline code blocks
    this.append(`${text.map(s => s.replace(/::/g, '`')).join(' ')}\n`)
  }

  appendCode(code: string, lang = '', comment = '') {
    const codeBlock = '```'

    this.append(`${codeBlock}${lang}\n${comment.length ? `// ${comment}\n\n` : ''}${code}\n${codeBlock}\n`)
  }

  appendJson(json: any) {
    this.appendCode(JSON.stringify(json, null, 2), 'JSON')
  }

  appendJs(js: string, comment?: string) {
    this.appendCode(js, 'javascript', comment)
  }

  appendTs(ts: string, comment?: string) {
    this.appendCode(ts, 'typescript', comment)
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

  match(key: string) {
    // if no condition is set, return true
    if (!this.conditions.get(key) || !this.values.get(key)) return true

    return this.conditions.get(key) === this.values.get(key)
  }

  valuesMatch() {
    const currentValues = Object.fromEntries(this.values)
    return Object.keys(currentValues).every(key => this.match(key))
  }

  log(...args: any[]) {
    if (this.valuesMatch() && !this.muted) {
      console.log(...args)
    }
  }

  mute() {
    this.muted = true
  }

  unMute() {
    this.muted = false
  }

  setValue(key: string, value: string) {
    this.values.set(key, value)
  }

  setValues(values: Record<string, string>) {
    Object.entries(values).forEach(([key, value]) => this.setValue(key, value))
  }

  clearValue(key: string) {
    this.values.delete(key)
  }

  clearValues() {
    this.values.clear()
  }

  setCondition(key: string, value: string) {
    this.conditions.set(key, value)
  }

  setConditions(conditions: Record<string, string>) {
    Object.entries(conditions).forEach(([key, value]) => this.setCondition(key, value))
  }

  clearCondition(key: string) {
    this.conditions.delete(key)
  }

  clearConditions() {
    this.conditions.clear()
  }
}