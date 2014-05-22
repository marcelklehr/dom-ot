var Manipulate = require('./manipulate')

// Paths are arrays, where [0] is the root node

function ManipulateText(path, diff) {
  this.path = path
  this.diff = diff
}

module.exports = ManipulateText

ManipulateText.prototype.transformAgainst = function (op) {
  if(op instanceof Move) {
    return Manipulate.prototype.transformAgainst.call(this, op)
  }
  if(op instanceof ManipulateText) {
    // XXX: text transform
  }
}
