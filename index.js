var domSerialize = require('dom-serialize')

exports.create = function(initialData) {

}

exports.apply = function(snapshot, ops) {
  ops
  .forEach(function(op) {
    op.apply(snapshot)
  })
}

exports.transform = function(ops1, ops2, side) {
  ops1.forEach(function(op1) {
    ops2.forEach(function(op2) {
      op1.transformAgainst(op2, ('left'==side))
    })
  })
}

exports.transformCursor = function(cursor, op) {
  // https://developer.mozilla.org/en-US/docs/Web/API/Range/setStart
}

exports.serialize = function(snapshot) {
  return domSerialize(snapshot)
}

exports.deserialize = function(data) {
  if('undefined' == typeof document) {
  
  }else{
    var div = document.createElement('div')
    div.innerHTML = data
    return div.firstChild
  }
}

exports.Move = require('./lib/index').Move
exports.Manipulate = require('./lib/index').Manipulate
exports.ManipulateText = require('./lib/index').ManipulateText
exports.adapters = require('./lib/index').adapters