var isYoungerSiblingOf = require('./is-youngerSibling')
  , isDescendantOf = require('./is-descandant')


// Paths are arrays, where [0] is the root node

function Move(from, to, element/*(optional)*/) {
  this.from = from
  this.to = to
  this.element = element
}
module.exports = Move

Move.prototype.transformAgainst = function (op) {
  if(op instanceof Move) {
    if (isDescendantOf(this.fromPath, op.from))
      this.from = Array.prototype.concat.call(op.to, this.from.slice(op.from.length)) // change from to be descendant of op.to instead of in op.from

    if (op.from == this.from && op.to != this.to)
      this.from = Array.prototype.concat.call(op.to) // so effectively, op has no effect

    if (isYoungerSiblingOf(this.from, op.to))
      this.from[this.from.length-1]++ // (shift to right)

    if (isYoungerSiblingOf(this.from, op.from))
      this.from[this.from.length-1]-- // (shift to left)

    if (isYoungerSiblingOf(this.to, op.to))
      this.from[this.from.length-1]++ // (shift to right)

    if (isYoungerSiblingOf(this.to, op.from))
      this.from[this.from.length-1]-- // (shift to left)
  }
}
