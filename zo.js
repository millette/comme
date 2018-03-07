'use strict'

// npm
// const { compareTwoStrings, findBestMatch } = require('string-similarity')
const { findBestMatch } = require('string-similarity')
// const jsl = require('js-levenshtein')
// const memoize = require('lodash.memoize')
// const fl = memoize(require('fast-levenshtein').get, (a, b) => a + b)
// const fl = require('fast-levenshtein').get
// const fms = require('find-most-similar').findMostSimilar

const data = require('./jido2018.json').features // .slice(0, 25) // .sort()

// const places = data.map((x) => [x.properties.place, x.properties.program, x.geometry.coordinates.join(), x.geometry.coordinates.join(), x.properties.url || ''].join(' --- ').toLowerCase())
const placesPlaces = data.map((x) => (x.properties.place || '').toLowerCase())
const placesProgram = data.map((x) => (x.properties.program || '').toLowerCase())
const placesUrl = data.map((x) => x.properties.url || x.properties.urlOrig || '')
const placesCoords = data.map((x) => x.geometry.coordinates.join())
const placesOrgs = data.map((x) => (x.properties.organizers || '').toLowerCase())

/*
const az = places.map((x) => {
  return {
    x,
    fbm: findBestMatch(x, places)
  }
})
*/

const facet = (p, i2) => {
  console.error(i2, p.length, typeof p, p[0])
  const az = []

  // let r

  p.forEach((x, i) => {
    const placesCopy = p.slice()
    // console.error(i, x, placesCopy.length, placesCopy.filter(Boolean).length)
    // const y = placesCopy[i]
    // if (placesCopy[i] !== x) { console.error(placesCopy[i], x) }
    placesCopy[i] = ''
    az.push({ x, fbm: findBestMatch(x, placesCopy).bestMatch }) // .filter(Boolean)
  })

  /*
  const placesCopy = p.slice()

  let x
  while ((x = placesCopy.pop()) && placesCopy.length) {
    az.push({ x, fbm: findBestMatch(x, placesCopy) }) // .bestMatch
  }
  */

  return az
}

// const out = facet(placesPlaces)
// console.log(JSON.stringify(out))

const them = [
  placesPlaces,
  placesProgram,
  placesUrl,
  placesCoords,
  placesOrgs
]

const out = them.map(facet)

// const rets = []
let r
let mult
const len = out[0].length
for (r = 0; r < len; ++r) {
  mult = out[0][r].fbm.rating * out[1][r].fbm.rating * out[2][r].fbm.rating * out[3][r].fbm.rating * out[4][r].fbm.rating
  console.log(r, Math.round(100 * mult), out[0][r].x, out[1][r].x, out[2][r].x)
}

/*
// places
console.log(JSON.stringify(out[0][0]))
console.log(JSON.stringify(out[0][1]))
console.log()

// programs
console.log(JSON.stringify(out[1][0]))
console.log(JSON.stringify(out[1][1]))
console.log()

// urls
console.log(JSON.stringify(out[2][0]))
console.log(JSON.stringify(out[2][1]))
console.log()

// coords
console.log(JSON.stringify(out[3][0]))
console.log(JSON.stringify(out[3][1]))
console.log()

// orgs
console.log(JSON.stringify(out[4][0]))
console.log(JSON.stringify(out[4][1]))
*/

/*
const cmp = (a, b) => {
  const ca = a.fbm.rating
  const cb = b.fbm.rating
  if (ca > cb) { return 1 }
  if (ca < cb) { return -1 }
  return 0
}

const out = az.sort(cmp)

console.log(JSON.stringify(out))
*/

/*
const mat = []
const idx = {}
const idxRev = {}

const cfg = { useCollator: true }

places.forEach((x, i) => {
  idx[x] = i
  idxRev[i] = x
  const flIt = memoize((y) => fl(y, x, cfg))
  mat.push(places.map(flIt)) // .join()
})
*/

// console.log(mat)

/*
let x
let y
const len = mat.length

console.log(len)
const outs = {}

for (y = 0; y < len; ++y) {
  outs[idxRev[y]] = {}
  // console.log('y', y, idxRev[y])
  for (x = 0; x < len; ++x) {
    outs[idxRev[y]][idxRev[x]] = mat[x][y]
    // console.log('x', x, idxRev[x])
  }

}

console.log(outs)
*/

/*
const elComp = (a, b) => {
  const n = Math.floor(places.length / 2)
  const fa = mat[n][idx[a]]
  const fb = mat[n][idx[b]]
  if (fa > fb) { return 1 }
  if (fa < fb) { return -1 }
  return 0
}

console.log(
  places
    .sort(elComp)
    .join('\n')
  )
*/

/*
const compImp = (m, a, b) => {
  const l = m(a, b)
  if (!a) { return -1 }
  if (!b) { return 1 }
  console.log('m-a:', a)
  console.log('m-b:', b)
  const ma = m(a)
  console.log('ma:', ma)
  const mb = m(b)
  console.log('mb:', mb)
  if (m(a) > m(b)) { return 1 }
  if (m(a) < m(b)) { return -1 }
  return 0
}

const comp = {
  jsl: compImp.bind(null, jsl),
  fl: compImp.bind(null, fl)
}

const jslSorted = places.sort(comp.jsl)

console.log(jslSorted)
*/

/*
const fl1 = fl('mikailovitch', 'Mikhaïlovitch', { useCollator: true })

console.log('fl1:', fl1)
*/

/*
const zo = (x, i) => {
  console.error('doing ', i)
  data[i].fms = fms(x, places)
}

places.forEach(zo)

console.log(JSON.stringify(data))
*/
