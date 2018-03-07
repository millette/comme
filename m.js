'use strict'

const jheson = require('jheson')

// const data = require('./jido2018.json').features

// console.log(Object.keys(jheson))

jheson.moldMethods('two.json')
  .then((x) => console.log(JSON.stringify(x, null, '  ')))
  .catch(console.error)
