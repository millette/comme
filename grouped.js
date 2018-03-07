'use strict'

// npm
const groupBy = require('lodash.groupby')

const data = require('./jido2018.json') // .features // .slice(0, 25) // .sort()

// console.log(data.features[0])

const byCoords = groupBy(data.features, (x) => x.geometry.coordinates.join())
const byPlaces = groupBy(data.features, (x) => x.properties.place)
const byPrograms = groupBy(data.features, (x) => x.properties.program)
const byUrls = groupBy(data.features, (x) => x.properties.url || x.properties.urlOrig)
const byOrgs = groupBy(data.features, (x) => x.properties.organizers)

const dup = (x) => x[1].length > 1

const lll = (a, b) => {
  const ca = a[1].length
  const cb = b[1].length
  // console.log('ca, cb:', ca, cb)
  if (ca > cb) { return 1 }
  if (ca < cb) { return -1 }
  return 0
}

const run = (aaa) => {
  const out1 = []
  for (let r in aaa) { out1.push([r, aaa[r]]) }
  return out1
    .filter(dup)
    .sort(lll)
}

// console.log(JSON.stringify(run(byCoords), null, '  '))
// console.log(JSON.stringify(run(byPlaces), null, '  '))
// console.log(JSON.stringify(run(byPrograms), null, '  '))
// console.log(JSON.stringify(run(byUrls), null, '  '))
// console.log(JSON.stringify(run(byOrgs), null, '  '))

console.log('coords:', run(byCoords).length)
console.log('places:', run(byPlaces).length)
console.log('programs:', run(byPrograms).length)
console.log('urls:', run(byUrls).length)
console.log('orgs:', run(byOrgs).length)
