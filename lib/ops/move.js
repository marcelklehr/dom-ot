/**
 * dom-ot - Operational transform library for DOM operations
 * Copyright (C) 2015 Marcel Klehr <mklehr@gmx.net>
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Lesser General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public License
 *  along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */
var isYoungerSiblingOf = require('./is-youngerSibling')
  , isYoungerOrEqualSiblingOf = isYoungerSiblingOf.isYoungerOrEqualSiblingOf
  , isPrefixOf = require('./is-prefix')
  , nodeAt = require('domnode-at-path')

// Paths are arrays, where [] is the root node

// If from is null, it's an insert
// If to is null, it's a removal
// element will hold the html to insert (or remove if you need invertabilty)
// `to` should not be transformed against `from`, i.e. `to` paths expect
// a tree where `from` is already removed!
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
        if ((level = isYoungerOrEqualSiblingOf(this.from, op.to)) !== false)
          if(this.from[level] === op.to[level]) {
            if(!left) from[level]++ // (shift to right)
          }else{
            from[level]++
          }
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
        if ((level = isYoungerOrEqualSiblingOf(this.to, op.to)) !== false)
          if(this.to[level] === op.to[level]){
            if(!left) to[level]++ // (shift to right)
          }else{
            to[level]++
          }
      }

    }

    this.from = from
    this.to = to
  }
}

/**
 * Merge an older operation with this one
 */
Move.prototype.merge = function(op) {
  if(op instanceof Move && op.to.join() === this.from.join()) {
    this.from = op.from
    return this
  }else {
    return
  }
}

Move.prototype.apply = function(rootNode, index, dry) {
  var myNode
  if(dry) return this.applyDry(rootNode, index)

  if (this.from) {
    myNode = nodeAt(this.from, rootNode)
    var oldParent = nodeAt(this.from.slice(0, this.from.length-1), rootNode)
    if(!myNode) throw new ReferenceError('Node not found: '+this.from.join(','))
    oldParent.removeChild(myNode)
  } else {
    myNode = require('../../').deserialize(this.element, rootNode.ownerDocument)
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

    // set new location + set new location for child nodes
    setIndex(node, this.to)

    // shift all after this.to
    for(var i=0; i<parent.childNodes.length; i++) {
      setIndex(parent.childNodes[i], parentPath.concat([i]))
    }
  }
}


function setIndex(node, path) {
  node.domOT_path = path
  if(node.childNodes) {
    for(var i=0; i<node.childNodes.length; i++) {
      setIndex(node.childNodes[i], path.concat([i]))
    }
  }
}
