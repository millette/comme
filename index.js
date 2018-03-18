'use strict'

// npm
const sortKeys = require('sort-keys')
// const memoize = require('lodash.memoize')

// core
const zlib = require('zlib')

const gzFloor = zlib.gzipSync('', {}).length

const re = /("[a-z_-]+?":|[" ,{}[\]-]+?|https:\/\/|http:\/\/)/g
const re2 = / +/g

const o2s = (o) => JSON.stringify(o).toLowerCase().replace(re, ' ').replace(re2, ' ').trim()

/*
const o2s = (o) => {
  const ret = typeof o === 'object' ? JSON.stringify(o) : o
  return ret.toLowerCase().replace(re, ' ').replace(re2, ' ').trim()
}
*/

// const shrinkRatio = memoize((x) => x && (x.length / (zlib.gzipSync(x, {}).length - gzFloor)))
const shrinkRatio = (x) => x && (x.length / (zlib.gzipSync(x, {}).length - gzFloor))

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
  const inputTmp = typeof input[0] === 'string' ? input.map((x) => ({x})) : input.slice()
  const sar = shrinkAllRatio(sortKeys({ inputTmp }, { deep: true }).inputTmp.map(o2s))
  const dones = []
  const balb = new Map()
  sar.forEach(({ from, compare }) => balb.set(from, { ...compare[0], item: input[compare[0].to] }))
  const rets = []
  balb.forEach(({ to, sim }, from) => {
    if (to === from) { return }
    if (dones.indexOf(from) !== -1) { return }
    dones.push(from, to)
    const za = balb.get(to)
    if (from === za.to) {
      rets.push({
        sim,
        from: { item: input[from], id: from },
        to: { item: input[to], id: to }
      })
    }
  })
  return rets
}

const yup = (iii, cnt = 50) => {
  const similars = []
  let last
  let len = iii.length
  while (cnt && last !== len) {
    last = len
    --cnt
    run(iii).forEach((x, n) => {
      iii[x.to.id] = {}
      similars.push({ x, n, cnt })
    })
    len = iii.filter((x, i) => Object.keys(x).length).length
  }
  return similars
}

module.exports = { run, yup }
