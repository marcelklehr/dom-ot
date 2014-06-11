var Move = require('./move')
  , isYoungerSiblingOf = require('./is-youngerSibling')
  , nodeAt = require('./node-at')

// Paths are arrays, where [] is the root node

function Manipulate(path, prop, value) {
  this.path = path
  this.prop = prop
  this.value = value
}

module.exports = Manipulate

Manipulate.prototype.transformAgainst = function (op) {
  if(op instanceof Move) {

    if (op.from) {
      if (op.from == this.path)
        this.path = op.to.concat() // go with the flow man.

      if (isYoungerSiblingOf(this.path, op.from))
        this.path[this.path.length-1]-- // (shift to left)
    }

    if (op.to) {
      if (isYoungerSiblingOf(this.path, op.to))
        this.path[this.path.length-1]++ // (shift to right)
    }
  }
}


Manipulate.prototype.apply = function (rootNode) {
  var myNode = nodeAt(this.path, rootNode)

  if(!myNode) throw new Error('Doesn\'t fit! Trying to manipulate a non-existing node.')

  myNode[this.prop] = this.value // XXX: This is preliminary, 'til we know the nature of mutation summary's records
}
