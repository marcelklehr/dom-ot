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
var Manipulate = require('./manipulate')
  , Move = require('./move')
  , nodeAt = require('domnode-at-path')
  , changesets = require('changesets')

// Paths are arrays, where [] is the root node

function ManipulateText(path, diff) {
  this.path = path
  this.diff = diff
  this.type = 'ManipulateText'
}

module.exports = ManipulateText

ManipulateText.prototype.transformAgainst = function (op, left) {
  if(!this.path) return
  if(op instanceof Move) {
    return Manipulate.prototype.transformAgainst.call(this, op)
  }
  if(op instanceof ManipulateText && op.path.join() == this.path.join()) {
    this.diff = changesets.transform(this.diff, op.diff, left? 'left': 'right')
  }
}

ManipulateText.prototype.merge = function(op) {
  if(op instanceof ManipulateText && op.path.join() === this.path.join()) {
    this.diff = changesets.compose(this.diff, op.diff)
    return this
  }else {
    return
  }
}

ManipulateText.prototype.apply = function (rootNode, index, dry) {
  if(!this.path || dry) return
  var targetNode = nodeAt(this.path, rootNode)
  if(!targetNode) throw new ReferenceError('Node not found: '+this.path.join(','))
  targetNode.nodeValue = changesets.apply(targetNode.nodeValue, this.diff)
}
