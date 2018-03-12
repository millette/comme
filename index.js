'use strict'

// npm
const sortKeys = require('sort-keys')
const memoize = require('lodash.memoize')

// core
const zlib = require('zlib')

// const iii = require('./jido2018.json').features
// const iii = require('./jido2018-new.json').features

const gzFloor = zlib.gzipSync('', {}).length

const re = /("[a-z_-]+?":|[" ,{}[\]-]+?|https:\/\/|http:\/\/)/g
const re2 = / +/g
const o2s = (o) => JSON.stringify(o).toLowerCase().replace(re, ' ').replace(re2, ' ').trim()

const shrinkRatio = memoize((x) => x && (x.length / (zlib.gzipSync(x, {}).length - gzFloor)))

const shrinkPairRatio = (a, b) => shrinkRatio((a > b) ? (a + b) : (b + a))

const shrinkWithRatio = (items, item) => items
  .map(shrinkPairRatio.bind(null, item))
  .map((sim, to) => ({ sim, to }))
  .sort((a, b) => {
    const ca = a.sim
    const cb = b.sim
    if (ca > cb) { return -1 }
    if (ca < cb) { return 1 }
    return 0
  })
  .slice(1)

const shrinkAllRatio = (items) => items
  .map(shrinkWithRatio.bind(null, items))
  .map((compare, from) => ({ from, compare }))
  .sort((a, b) => {
    const ca = a.compare[0].sim
    const cb = b.compare[0].sim
    if (ca > cb) { return -1 }
    if (ca < cb) { return 1 }
    return 0
  })

const run = (input) => {
  const sar = shrinkAllRatio(sortKeys({ input }, { deep: true }).input.map(o2s))
  const dones = []
  const balb = new Map()
  sar.forEach(({ from, compare }) => balb.set(from, { ...compare[0], item: input[compare[0].to] }))

  balb.forEach(({ to, sim }, from) => {
    if (to === from) { return }
    if (dones.indexOf(from) !== -1) { return }
    dones.push(from, to)
    const za = balb.get(to)
    if (from === za.to) {
      console.log(from, JSON.stringify(input[from]))
      console.log(to, JSON.stringify(input[to]))
      console.log()
    }
  })
}

// run(iii)
module.exports = run
