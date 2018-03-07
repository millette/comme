'use strict'

const data = require('./jido2018.json').features

// console.log(data.length)

const makeId = (x, i) => {
  ++i
  if (i < 10) {
    x._id = 'n-00' + i
  } else if (i < 100) {
    x._id = 'n-0' + i
  } else {
    x._id = 'n-' + i
  }
  return x
}

const docs = data.map(makeId)
// const docs = data.map((x, i) => ({...x, _id: `n-${i + 1}`}))

console.log(JSON.stringify({docs}))
