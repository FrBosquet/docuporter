export class KVStore {
  values: Record<string, string> = {}

  constructor() { }

  set(key: string, value: string) {
    this.values[key] = value
  }

  setMany(values: Record<string, string>) {
    this.values = {
      ...this.values,
      ...values
    }
  }

  get(key: string) {
    return this.values[key]
  }

  getAll() {
    return this.values
  }

  clearAll() {
    this.values = {}
  }

  clearOne(key: string) {
    delete this.values[key]
  }
}