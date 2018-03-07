'use strict'

// npm
const sortKeys = require('sort-keys')
const memoize = require('lodash.memoize')

// core
const zlib = require('zlib')
const gzipSync = memoize(zlib.gzipSync)

const re = /".+?":/g

const dataOrig = sortKeys(require('./jido2018.json'), { deep: true }).features
const data = dataOrig.map((x) => JSON.stringify(x).replace(re, '').toLowerCase())

const dataShrunk = data.map(gzipSync)

const cmp = (n, a, b) => {
  const ca = a[n]
  const cb = b[n]
  if (ca > cb) { return 1 }
  if (ca < cb) { return -1 }
  return 0
}

const press = (r, x, i) => i === r ? '' : gzipSync((x.length > data[r].length) ? (x + data[r]) : (data[r] + x))
const calcImp = (w, x, i) => [i, Math.round(1000 * (w[i].length ? (w[i].length - 20) : 0) / (x.length ? (x.length - 20) : 0)) / 1000]
const calc = (w, n) => dataShrunk.map(calcImp.bind(null, w)).sort(cmp.bind(null, 1))

const sorted = data
  .map((y, r) => data.map(press.bind(null, r)))
  .map(calc)
  .map((x, i) => [x[1][1], i, x[1][0]])
  .sort(cmp.bind(null, 0))
  .map((x) => {
    const ret = x.slice()
    const iData = dataOrig[x[1]]
    const nData = dataOrig[x[2]]
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

console.log(JSON.stringify(sorted, null, '  '))
