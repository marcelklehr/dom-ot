var domSerialize = require('serialize-dom')

exports.create = function(initialData) {

}

exports.apply = function(snapshot, ops) {
  unpackOps(ops)
  .forEach(function(op) {
    op.apply(snapshot)
  })
  return snapshot
}

exports.transform = function(ops1, ops2, side) {
  unpackOps(ops1).forEach(function(op1) {
    unpackOps(ops2).forEach(function(op2) {
      op1.transformAgainst(op2, ('left'==side))
    })
  })
}

exports.compose = function(ops1, ops2) {
  exports.transform(ops2, ops1)
  return ops1.concat(ops2)
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

var unpackOps = exports.unpackOps = function(unpackOps) {
  return unpackOps.map(function(op) {
    switch(op.type) {
      case 'Move':
        return new exports.Move(op.from, op.to, op.element)
      case 'Manipulate':
        return new exports.Manipulate(op.path, op.prop, op.value)
      case 'ManipulateText':
        return new exports.ManipulateText(op.path, op.diff)
      default:
        throw new Error('Unknown op type: '+op.type)
    }
  })
}

exports.Move = require('./lib/index').Move
exports.Manipulate = require('./lib/index').Manipulate
exports.ManipulateText = require('./lib/index').ManipulateText
exports.adapters = require('./lib/index').adapters