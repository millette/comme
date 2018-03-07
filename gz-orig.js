'use strict'

// npm
const sortKeys = require('sort-keys')
const memoize = require('lodash.memoize')
// const jheson = require('jheson')

// core
const zlib = require('zlib')
const gzipSync = memoize(zlib.gzipSync)

const re = /".+?":/g

const dataOrig = sortKeys(require('./jido2018.json'), { deep: true }).features
const data = dataOrig
  .map(JSON.stringify)
  .map((x) => x.replace(re, '').toLowerCase())

// console.log(data[0])
// process.exit()

const dataShrunk = data.map(gzipSync)
console.log('LEN:', dataShrunk.length)

const withs = data.map((y, r) => data.map((x, i) => {
  let t
  const lx = x.length
  const ld = data[r].length
  if (i === r) { return '' }
  if (lx > ld) {
    t = x + data[r]
  } else {
    t = data[r] + x
  }
  return gzipSync(t)
}))

const all = []

withs.forEach((w, n) => {
  const one = []
  dataShrunk.forEach((x, i) => {
    const lx = x.length ? (x.length - 20) : 0
    const lw = w[i].length ? (w[i].length - 20) : 0
    // const p = Math.round(10000 * lw / lx) / 10000
    const p = lw / lx
    // console.log(n, i, p)
    one.push([i, p])
    // console.log(lx, lw, Math.round(100 * lw / lx) / 100, i)
  })
  all.push(one.sort((a, b) => {
    const ca = a[1]
    const cb = b[1]
    if (ca > cb) { return 1 }
    if (ca < cb) { return -1 }
    return 0
  }))
})

/*
const sorted = all.sort((a, b) => {
  const ca = a[1][1]
  const cb = b[1][1]
  if (ca > cb) { return 1 }
  if (ca < cb) { return -1 }
  return 0
})

console.log(JSON.stringify(sorted, null, '  '))
*/

// const closest = all.map((x, i) => [i, x[1][1]])
// console.log(JSON.stringify(closest, null, '  '))

const sets = []

all.forEach((x, i) => {
  const [n, p] = x[1]
  // if (p > 1.6) { return }
  // console.log(i, n, p)
  // const iData = dataOrig[i]
  // const nData = dataOrig[n]
  // console.log(`${p}: ${i} similar to ${n}`)
  // console.log(`${p}: ${iData.properties.place} (${i}) similar to ${nData.properties.place} (${n})`)
  // sets.push([p, i, n, iData.properties.place, nData.properties.place])
  sets.push([p, i, n])
  /*
  console.log('Similarity:', p)
  console.log(i, iData)
  console.log(n, nData)
  console.log()
  */
})

const sorted = sets
  .sort((a, b) => {
    const ca = a[0]
    const cb = b[0]
    if (ca > cb) { return 1 }
    if (ca < cb) { return -1 }
    return 0
  })
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
    if (iData.properties.url !== nData.properties.url) {
      ret.push(iData.properties.url + '*')
    } else {
      ret.push(iData.properties.url)
      ret.push(nData.properties.url)
    }
    return ret
  })
  .map((x) => x.join(' --- '))

console.log(JSON.stringify(sorted, null, '  '))

/*
const cmp = (a, b) => {
  const ca = a.length
  const cb = b.length
  if (ca > cb) { return 1 }
  if (ca < cb) { return -1 }
  return 0
}

const sorted = dataShrunk.sort(cmp)

sorted.forEach((x) => console.log(x.length))
*/
