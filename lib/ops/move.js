var isYoungerSiblingOf = require('./is-youngerSibling')
  , isPrefixOf = require('./is-prefix')
  , nodeAt = require('./node-at')


// Paths are arrays, where [] is the root node

// If from is null, it's an insert
// If to is null, it's a removal
// element will hold the html to insert (or remove if you need invertabilty)
function Move(from, to, element/*(optional)*/) {
  this.from = from
  this.to = to
  this.element = element
  this.type = 'Move'
}
module.exports = Move

Move.prototype.transformAgainst = function (op, left) {
  if(op instanceof Move) {
    var from = this.from && this.from.slice(0)
      , to = this.to && this.to.slice(0)
      , level

    if(this.from) {

      if(op.from) {
        if (isPrefixOf(op.from, this.from)) {
          if(op.to)
            from = Array.prototype.concat.call(op.to, this.from.slice(op.from.length)) // change from to be descendant of op.to instead of in op.from
          else
            from = null
        }

        if ((level = isYoungerSiblingOf(this.from, op.from)) !== false)
          from[level]-- // (shift to left)
      }

      if(op.to) {
        if ((level = isYoungerSiblingOf(this.from, op.to)) !== false)
          if(!left) from[level]++ // (shift to right)
      }

    }

    if (this.to) {

      if(op.from) {
        if ((level = isYoungerSiblingOf(this.to, op.from)) !== false)
          to[level]-- // (shift to left)

        if (isPrefixOf(op.from, this.to) && op.from.length < this.to.length) {
          if(op.to)
            to = Array.prototype.concat.call(op.to, this.to.slice(op.from.length))
          else
            to = null
        }
      }

      if(op.to) {
        if ((level = isYoungerSiblingOf(this.to, op.to)) !== false)
          to[this.to.length-1]++ // (shift to right)
      }

    }

    this.from = from
    this.to = to
  }
}

Move.prototype.apply = function(rootNode, index, dry) {
  var myNode
  if(dry) return this.applyDry(rootNode, index)

  if (this.from) {
    myNode = nodeAt(this.from, rootNode)
    var oldParent = nodeAt(this.from.slice(0, this.from.length-1), rootNode)
    oldParent.removeChild(myNode)
  } else {
    var tempDiv = rootNode.ownerDocument.createElement('div')
    tempDiv.innerHTML = this.element // Unserialize
    myNode = tempDiv.firstChild
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
  
  if(index) this.applyDry(rootNode)
}

Move.prototype.applyDry = function(rootNode) {
  if(this.to) {
    var parentPath = this.to.slice(0, this.to.length-1)
      , parent = nodeAt(parentPath, rootNode)
      , node = nodeAt(this.to, rootNode)
    
    var parentPathString = parentPath.join('')

    // set new location + set new location for child nodes
    setIndex(node, this.to.join(''))

    // shift all after this.to
    for(var i=0; i<parent.childNodes.length; i++) {
      setIndex(parent.childNodes[i], parentPathString+i)
    }
  }
}


function setIndex(node, path) {
  node.domOT_path = path
  if(node.childNodes) {
    for(var i=0; i<node.childNodes.length; i++) {
      node.childNodes[i].domOT_path = path+i
      setIndex(node.childNodes[i], path+i)
    }
  }
}