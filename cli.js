'use strict'

const Booya = require('.')

const input = require('./jido2018.json').features // .slice(0, 50)
const foo = new Booya(input)
foo.doit()
const b = foo.prepareDisplay()
console.log(JSON.stringify(b, null, '  '))
