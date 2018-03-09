import test from 'ava'

const Booya = require('.')

const input = require('./jido2018.json').features

test('wrong ctor() args', t => {
  const foo = new Booya()
  t.falsy(foo.prepareDisplay())
  t.falsy(foo.prepareDisplay(true))
})

test('wrong ctor() args + doit()', t => {
  const foo = new Booya()
  foo.doit()
  t.falsy(foo.prepareDisplay())
  t.falsy(foo.prepareDisplay(true))
})

test('before running doit()', t => {
  const foo = new Booya(input)
  t.falsy(foo.prepareDisplay())
  t.falsy(foo.prepareDisplay(true))
})

test('after running doit()', t => {
  const foo = new Booya(input)
  foo.doit()
  t.is(foo.prepareDisplay().length, 406)
  t.is(foo.prepareDisplay(true).length, 146)
})

/*
test('after running doit(1.45)', t => {
  const foo = new Booya(input)
  foo.doit(1.45)
  t.is(foo.prepareDisplay().length, 348)
  t.is(foo.prepareDisplay(true).length, 130)
})

test('after running doit(1.2)', t => {
  const foo = new Booya(input)
  foo.doit(1.2)
  t.is(foo.prepareDisplay().length, 43)
  t.is(foo.prepareDisplay(true).length, 36)
})
*/

test('add() v0', t => {
  const foo = new Booya(input.slice(0, -1))
  foo.doit()
  t.is(foo.prepareDisplay().length, 405)
  t.is(foo.prepareDisplay(true).length, 144)

  foo.add()
  t.is(foo.prepareDisplay().length, 405)
  t.is(foo.prepareDisplay(true).length, 144)

  foo.doit()
  t.is(foo.prepareDisplay().length, 405)
  t.is(foo.prepareDisplay(true).length, 144)
})

test('add() v1', t => {
  const foo = new Booya(input.slice(0, -1))
  foo.doit()
  t.is(foo.prepareDisplay().length, 405)
  t.is(foo.prepareDisplay(true).length, 144)

  foo.add(input[input.length - 1])
  t.falsy(foo.prepareDisplay())
  t.falsy(foo.prepareDisplay(true))

  foo.doit()
  t.is(foo.prepareDisplay().length, 406)
  t.is(foo.prepareDisplay(true).length, 146)
})

test('add() v2', t => {
  const foo = new Booya(input.slice(1))
  foo.doit()
  t.is(foo.prepareDisplay().length, 405)
  t.is(foo.prepareDisplay(true).length, 148)

  foo.add(input[0])
  t.falsy(foo.prepareDisplay())
  t.falsy(foo.prepareDisplay(true))

  foo.doit()
  t.is(foo.prepareDisplay().length, 406)
  t.is(foo.prepareDisplay(true).length, 148)
})
