var isYoungerSiblingOf = require('./is-youngerSibling')

// Paths are arrays, where [] is the root node

function Manipulate(path, prop, value) {
  this.path = path
  this.prop = prop
  this.value = value
}

module.exports = Manipulate

Manipulate.prototype.transformAgainst = function (op) {
  if(op instanceof Move) {

    if (op.from == this.path)
      this.path = op.to.concat() // go with the flow man.

    if (isYoungerSiblingOf(this.path, op.to))
      this.path[this.path.length-1]++ // (shift to right)

    if (isYoungerSiblingOf(this.path, op.from))
      this.path[this.path.length-1]-- // (shift to left)
  }
}
