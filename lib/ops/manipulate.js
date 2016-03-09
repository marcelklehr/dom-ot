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
var Move = require('./move')
  , isYoungerSiblingOf = require('./is-youngerSibling')
  , isYoungerOrEqualSiblingOf = isYoungerSiblingOf.isYoungerOrEqualSiblingOf
  , isPrefixOf = require('./is-prefix')
  , nodeAt = require('domnode-at-path')

// Paths are arrays, where [] is the root node
function Manipulate(path, prop, value) {
  this.path = path
  this.prop = prop
  this.value = value
  this.type = 'Manipulate'
}

module.exports = Manipulate

Manipulate.prototype.transformAgainst = function (op, left) {
  if(op instanceof Move && this.path) {
    var path = this.path.slice(0)
      , level

    if (op.from) {
      if (isPrefixOf(op.from, this.path)) {
        if(op.to)
          path = Array.prototype.concat(op.to, this.path.slice(op.from.length)) // go with the flow man.
        else
          path = null
      }

      if ((level = isYoungerSiblingOf(this.path, op.from)) !== false)
        path[level]-- // (shift to left)
    }

    if (op.to) {
      if ((level = isYoungerOrEqualSiblingOf(this.path, op.to)) !== false)
        if(this.path[level] === op.to[level]) {
          if(!left) path[level]++ // (shift to right)
        }else{
          path[level]++
        }
    }

    this.path = path
  }
}

/**
 * Incorporate the changes of an earlier operation
 */
Manipulate.prototype.merge = function(op) {
  if(op instanceof Manipulate && op.path.join() === this.path.join() && op.prop === this.prop) {
    return this
  }else{
    return
  }
}

Manipulate.prototype.apply = function (rootNode, index) {
  if(!this.path) return
  var myNode = nodeAt(this.path, rootNode)

  if(!myNode) throw new Error('Doesn\'t fit! Trying to manipulate a non-existing node: '+this.path.join(','))

  myNode.setAttribute(this.prop, this.value)
}
