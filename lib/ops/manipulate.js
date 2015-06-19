var Move = require('./move')
  , isYoungerSiblingOf = require('./is-youngerSibling')
  , isPrefixOf = require('./is-prefix')
  , nodeAt = require('./node-at')

// Paths are arrays, where [] is the root node
function Manipulate(path, prop, value) {
  this.path = path
  this.prop = prop
  this.value = value
}

module.exports = Manipulate

Manipulate.prototype.transformAgainst = function (op, left) {
  if(op instanceof Move) {
    var path = this.path.slice(0)

    if (op.from) {
      if (isPrefixOf(op.from, this.path)) {
        if(op.to)
          path = Array.prototype.concat(op.to, this.path.slice(op.from.length)) // go with the flow man.
        else
          path = null
      }

      if (isYoungerSiblingOf(this.path, op.from))
        path[this.path.length-1]-- // (shift to left)
    }

    if (op.to) {
      if (isYoungerSiblingOf(this.path, op.to))
        path[this.path.length-1]++ // (shift to right)

      if(isPrefixOf(op.to, this.path))
        if(!left) path[op.to.length-1]++ // right side's gotta budge
    }
  }
}


Manipulate.prototype.apply = function (rootNode) {
  var myNode = nodeAt(this.path, rootNode)

  if(!myNode) throw new Error('Doesn\'t fit! Trying to manipulate a non-existing node.')

  myNode.setAttribute(this.prop, this.value )// XXX: This is preliminary, 'til we know the nature of mutation summary's records
}
