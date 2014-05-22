

exports.create = function(initialData) {

}

exports.apply = function(snapshot, op) {

}

exports.transform = function(op1, op2, side) {
  op1.transformAgainst(op2, ('left'==side))
}

exports.compose  = function(op1, op2) {
  
}

exports.Move = require('./lib/index').Move
exports.Manipulate = require('./lib/index').Manipulate
