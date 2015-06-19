var isYoungerSiblingOf = require('./is-youngerSibling')
  , isPrefixOf = require('./is-prefix')
  , nodeAt = require('./node-at')


// Paths are arrays, where [] is the root node

// If from is null, it's an insert
// If to is null, it's a removal
// element will hold the element to insert (or remove if you need invertabilty)
function Move(from, to, element/*(optional)*/) {
  this.from = from
  this.to = to
  this.element = element
}
module.exports = Move

Move.prototype.transformAgainst = function (op, left) {
  if(op instanceof Move) {
    var from = this.from && this.from.slice(0)
      , to = this.to && this.to.slice(0)

    if(this.from) {

      if(op.from) {
        if (isPrefixOf(op.from, this.from)) {
          if(op.to)
            from = Array.prototype.concat.call(op.to, this.from.slice(op.from.length)) // change from to be descendant of op.to instead of in op.from
          else
            from = null
        }

        if (isYoungerSiblingOf(this.from, op.from))
          from[this.from.length-1]-- // (shift to left)
      }

      if(op.to) {
        if (isYoungerSiblingOf(this.from, op.to))
          from[this.from.length-1]++ // (shift to right)

        if(isPrefixOf(op.to, this.from))
          if(!left) from[op.to.length-1]++
      }

    }

    if (this.to) {

      if(op.from) {
        if (isYoungerSiblingOf(this.to, op.from))
          to[this.to.length-1]-- // (shift to left)

        if (isPrefixOf(op.from, this.to) && op.from.length < this.to.length) {
          if(op.to)
            to = Array.prototype.concat.call(op.to, this.to.slice(op.from.length))
          else
            to = null
        }
      }

      if(op.to) {
        if (isYoungerSiblingOf(this.to, op.to))
          to[this.to.length-1]++ // (shift to right)

        if(isPrefixOf(op.to, this.to))
          if(!left) to[op.to.length-1]++ // the right side's gotta budge
      }

    }

    this.from = from
    this.to = to
  }
}

Move.prototype.apply = function(rootNode) {
  var myNode

  if (this.from) {
    myNode = nodeAt(this.from, rootNode)
    var oldParent = nodeAt(this.from.slice(0, this.from.length-1), rootNode)
    oldParent.removeChild(myNode)
  } else {
    myNode = this.element // XXX: Unserialization needed. probably.
  }

  if (this.to) {
    var newSibling = nodeAt(this.to, rootNode)
    var newParent = nodeAt(this.to.slice(0, this.to.length-1), rootNode)

    if(!newParent) throw new Error('Doesn\'t fit! Designated parent for insertion doesn\'t exist.')

    if(newSibling) {
      newParent.insertBefore(myNode, newSibling)
    }
    else if(newParent.childNodes.length == this.to[this.to.length-1]) {
      newParent.appendChild(myNode)
    } else {
      throw new Error('Doesn\'t fit! Trying to insert a node at a non-existing location.')
    }
  }
}
