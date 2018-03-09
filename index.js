'use strict'

// npm
const sortKeys = require('sort-keys')
const memoize = require('lodash.memoize')

// core
const zlib = require('zlib')
// const gzipSync = memoize(zlib.gzipSync)
const gzipSync = memoize((x) => zlib.gzipSync(x, {}).length - 10)

const re = /".+?":/g

const cmp = (n, a, b) => {
  const ca = a[n]
  const cb = b[n]
  if (ca > cb) { return 1 }
  if (ca < cb) { return -1 }
  return 0
}

// const calcImp = (w, x, i) => [i, Math.round(1000 * (w[i].length ? (w[i].length - 20) : 0) / (x.length - 20)) / 1000]
const calcImp = (w, x, i) => [i, Math.round(1000 * w[i] / x) / 1000]

const calc = (dataGz, w, n) => dataGz.map(calcImp.bind(null, w)).sort(cmp.bind(null, 1))

const press = (dataLike, r, x, i) => {
  // if (i === r) { return 0 }
  if (i === r) { return '' }
  let it
  if (x.length > dataLike[r].length) {
    it = x + dataLike[r]
  } else {
    it = dataLike[r] + x
  }
  return gzipSync(it)
}

class Booya {
  constructor (json) {
    if (!json || !json.length) { return }
    this.dataOrig = sortKeys({ json }, { deep: true }).json
    this.dataLike = this.dataOrig.map((x) => JSON.stringify(x).replace(re, '').toLowerCase())
    this.dataGz = this.dataLike.map(gzipSync)
    this.sorted = false
  }

  add (item) {
    if (!item) { return }
    const it = sortKeys({ item }, { deep: true }).item
    this.dataOrig.push(it)
    const slim = JSON.stringify(it).replace(re, '').toLowerCase()
    this.dataLike.push(slim)
    this.dataGz.push(gzipSync(slim))
    this.sorted = false
  }

  doit (f) {
    if (!this.dataLike || !this.dataLike.length) {
      this.sorted = false
      return
    }
    // if (this.sorted) { return } // should also depend on f arg
    const ret = this.dataLike
      .map((y, r) => this.dataLike.map(press.bind(null, this.dataLike, r)))
      .map(calc.bind(null, this.dataGz))
      .map((x, i) => [x[1][1], i, x[1][0]])
      .sort(cmp.bind(null, 0))
    this.sorted = f ? ret.filter((x) => x[0] < f) : ret
  }

  prepareDisplay (pairsOnly) {
    if (!this.sorted) { return }
    let ret2 = this.sorted
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

    if (pairsOnly) {
      const ret3 = []
      let c
      let d

      let c1
      let d1
      ret2.forEach((x) => {
        c = x[1]
        c1 = x[2]
        ret2.forEach((y) => {
          d = y[2]
          d1 = y[1]
          if (c === d && c1 === d1) { return ret3.push(x) }
        })
      })
      ret2 = ret3.filter((x) => x[0])
    }

    return ret2.map((x) => x.join(' --- '))
  }
}

module.exports = Booya
