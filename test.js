import test from 'ava'

const run = require('.')

const iii = require('./jido2018.json').features
const iii2 = require('./jido2018-new.json').features

test('similar sets in jido2018.json', t => {
  const r = run(iii)
  t.is(r.length, 15)
})

test('similar sets in jido2018-new.json', t => {
  const r = run(iii2)
  t.is(r.length, 15)
})
