'use strict'

const fs = require('fs')

const { yup } = require('.')

// const so = yup(require('./collectionsechantillon.json'))
// const so = yup(require('./oeuvresdonneesouvertes.json'))

// console.log(JSON.stringify(yup(so), null, '  '))

let now = Date.now()
// const fc = fs.readFileSync('mtlwifi_bornes.csv', 'utf-8')
const fc = fs.readFileSync('requetes311-4000.csv', 'utf-8')

console.error(Date.now() - now, fc.length)
now = Date.now()
const lines = fc.split('\n').filter(Boolean)
console.error(Date.now() - now, lines.length)
now = Date.now()

// const so = lines.map((x) => ({ x }))
// console.error(Date.now() - now, so.length)

// console.log(JSON.stringify(yup(so), null, '  '))
console.log(JSON.stringify(yup(lines), null, '  '))
now = Date.now()
console.error(Date.now() - now)
