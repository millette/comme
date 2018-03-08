'use strict'

// npm
const sortKeys = require('sort-keys')
const memoize = require('lodash.memoize')

// core
const zlib = require('zlib')
const gzipSync = memoize(zlib.gzipSync)

const re = /".+?":/g

const cmp = (n, a, b) => {
  const ca = a[n]
  const cb = b[n]
  if (ca > cb) { return 1 }
  if (ca < cb) { return -1 }
  return 0
}

const calcImp = (w, x, i) => [i, Math.round(1000 * (w[i].length ? (w[i].length - 20) : 0) / (x.length ? (x.length - 20) : 0)) / 1000]

class Booya {
  constructor (json) {
    if (!json || !json.length) { return }
    this.dataOrig = sortKeys(json, { deep: true })
    this.dataLike = this.dataOrig.map((x) => JSON.stringify(x).replace(re, '').toLowerCase())
    this.dataGz = this.dataLike.map(gzipSync)
    this.sorted = []
  }

  press (r, x, i) {
    if (i === r) { return '' }
    let it
    if (x.length > this.dataLike[r].length) {
      it = x + this.dataLike[r]
    } else {
      it = this.dataLike[r] + x
    }
    return gzipSync(it)
  }

  calc (w, n) {
    return this.dataGz.map(calcImp.bind(null, w)).sort(cmp.bind(null, 1))
  }

  doit () {
    if (!this.dataLike || !this.dataLike.length) { return }
    this.sorted = this.dataLike
      .map((y, r) => this.dataLike.map(this.press.bind(this, r)))
      .map(this.calc)
      .map((x, i) => [x[1][1], i, x[1][0]])
      .sort(cmp.bind(null, 0))
  }

  prepareDisplay () {
    if (!this.sorted || !this.sorted.length) { return }
    return this.sorted
      .map((x) => {
        const ret = x.slice()
        const iData = this.dataOrig[x[1]]
        const nData = this.dataOrig[x[2]]
        ret.push('PLACE')
        if (iData.properties.place === nData.properties.place) {
          ret.push(iData.properties.place + '*')
        } else {
          ret.push(iData.properties.place)
          ret.push(nData.properties.place)
        }

        ret.push('PROGRAM')
        if (iData.properties.program === nData.properties.program) {
          ret.push(iData.properties.program + '*')
        } else {
          ret.push(iData.properties.program)
          ret.push(nData.properties.program)
        }

        ret.push('URL')
        if (iData.properties.url === nData.properties.url) {
          ret.push(iData.properties.url + '*')
        } else {
          ret.push(iData.properties.url)
          ret.push(nData.properties.url)
        }
        return ret
      })
      .map((x) => x.join(' --- '))
  }
}

module.exports = Booya
