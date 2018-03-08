'use strict'

const Booya = require('.')

const input = require('./jido2018.json').features
const foo = new Booya(input)
foo.doit()
const b = foo.prepareDisplay(true)
console.log(JSON.stringify(b, null, '  '))
