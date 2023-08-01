import * as path from 'path'
import * as fs from 'fs'

enum TicketState {
  New,
  InProgress,
  Used,
}
export class DocuPorter {
  private filePath: string
  private muted = false
  private values = new Map()
  private conditions = new Map()
  private ticket = new Map<string, TicketState>()

  constructor(fileName: string) {
    this.filePath = path.join(process.cwd(), fileName)

    fs.writeFileSync(this.filePath, '')
  }

  reset() {
    fs.writeFileSync(this.filePath, '')
  }

  private append(text: string) {
    if (this.isNoisy()) {
      fs.appendFileSync(this.filePath, `\n${text}`)
    }
  }

  private appendHeader(header: string, order: 1 | 2 | 3 | 4 | 5 = 2) {
    this.append(`${'#'.repeat(order)} ${header}\n`)
  }

  private appendText(...text: string[]) {
    // use :: to start/end inline code blocks
    this.append(`${text.map(s => s.replace(/::/g, '`')).join(' ')}\n`)
  }

  private appendCode(code: string, lang = '', comment = '') {
    const codeBlock = '```'

    this.append(`${codeBlock}${lang}\n${comment.length ? `// ${comment}\n\n` : ''}${code}\n${codeBlock}\n`)
  }

  private appendJson(json: any) {
    this.appendCode(JSON.stringify(json, null, 2), 'JSON')
  }

  private appendJs(js: string, comment?: string) {
    this.appendCode(js, 'javascript', comment)
  }

  private appendTs(ts: string, comment?: string) {
    this.appendCode(ts, 'typescript', comment)
  }

  private appendLabeledJson(label: string, code: any) {
    this.appendText(label)
    this.appendJson(code)
  }

  text = this.appendText
  json = this.appendJson
  js = this.appendJs
  ts = this.appendTs
  header = this.appendHeader
  h1 = (...header: string[]) => this.appendHeader(header.join(' '), 1)
  h2 = (...header: string[]) => this.appendHeader(header.join(' '), 2)
  h3 = (...header: string[]) => this.appendHeader(header.join(' '), 3)
  h4 = (...header: string[]) => this.appendHeader(header.join(' '), 4)
  h5 = (...header: string[]) => this.appendHeader(header.join(' '), 5)
  ljson = this.appendLabeledJson

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
    if (this.isNoisy()) {
      console.log(...args)
    }
  }

  logState() {
    const values = Object.fromEntries(this.values)
    const conditions = Object.fromEntries(this.conditions)
    const tickets = Object.fromEntries(this.ticket)

    console.log({
      values,
      conditions,
      tickets,
      muted: this.muted,
    })
  }

  mute() {
    this.muted = true
  }

  unMute() {
    this.muted = false
  }

  private isNoisy() {
    return this.anyTicketOngoing() || (this.valuesMatch() && !this.muted)
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

  addTicket(ticket: string) {
    this.ticket.set(ticket, TicketState.New)
  }

  useTicket(ticket: string) {
    this.ticket.set(ticket, TicketState.InProgress)
  }

  finishTicket(ticket: string) {
    this.ticket.set(ticket, TicketState.Used)
  }

  private anyTicketOngoing() {
    return Array.from(this.ticket.values()).some(state => state === TicketState.InProgress)
  }
}