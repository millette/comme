import test from 'ava'

const { yup } = require('.')

test('jido2018-new-sample-150-1.json', t => {
  const iii = require('./jido2018-new-sample-150-1.json').features
  const r = yup(iii)
  t.is(r.length, 9)
  t.is(r[1].x.from.item.properties.url.slice(0, 31), r[1].x.to.item.properties.url.slice(0, 31))
  t.is(r[1].x.from.item.properties.organizers, r[1].x.to.item.properties.organizers)
  t.is(r[2].x.from.item.properties.url, r[2].x.to.item.properties.url)
})

test('jido2018-new-sample-150-2.json', t => {
  const iii = require('./jido2018-new-sample-150-2.json').features
  const r = yup(iii)
  t.is(r.length, 52)

  t.deepEqual(r[1].x.from.item.geometry, r[1].x.to.item.geometry)
  t.is(r[1].x.from.item.properties.url.slice(0, 31), r[1].x.to.item.properties.url.slice(0, 31))
  t.is(r[1].x.from.item.properties.organizers, r[1].x.to.item.properties.organizers)

  t.deepEqual(r[3].x.from.item.geometry, r[3].x.to.item.geometry)

  t.is(r[4].x.from.item.properties.place, r[4].x.to.item.properties.place)
})
