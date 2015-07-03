/**
 * dom-ot - Operational transform library for DOM operations
 * Copyright (C) 2015 Marcel Klehr <mklehr@gmx.net>
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 *  along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

var domSerialize = require('serialize-dom')
  , nodeAt = require('./lib/ops/node-at')
  , pathTo = require('./lib/path-to')
  , Changeset = require('changesets').Changeset
  , ManipulateText = require('./lib/ops/manipulate-text')

exports.create = function(initialData) {

}

exports.apply = function(snapshot, ops) {
  snapshot = snapshot.cloneNode(true)
  unpackOps(ops)
  .forEach(function(op) {
    op.apply(snapshot)
  })
  return snapshot
}

exports.transform = function(ops1, ops2, side) {
  return unpackOps(ops1).map(function(op1) {
    unpackOps(ops2).forEach(function(op2) {
      op1.transformAgainst(op2, ('left'==side))
    })
    return op1
  })
}

exports.compose = function(ops1, ops2) {
  //exports.transform(ops2, ops1)
  return ops1.concat(ops2)
}

exports.transformCursor = function(range, ops, rootNode) {
  range = range.cloneRange()
  if(rootNode.contains(range.startContainer) && range.startContainer.nodeValue) {
    var cs = Changeset.create()
            .retain(range.startOffset)
            .insert('|')
            .retain(range.startContainer.nodeValue.length-range.startOffset)
            .end()
            .pack()
    var cursorOps = [new ManipulateText(pathTo(range.startContainer, rootNode), cs)]
    cursorOps = exports.transform(cursorOps, ops, 'right')
    var cursorOp = cursorOps[0]
    var start = nodeAt(cursorOp.path, rootNode)
    var startLength = countInitialRetains(cursorOp.diff)
  }
  if(rootNode.contains(range.endContainer) && range.endContainer.nodeValue) {
    var cs = Changeset.create()
            .retain(range.endOffset)
            .insert('|')
            .retain(range.endContainer.nodeValue.length-range.endOffset)
            .end()
            .pack()
    var cursorOps = [new ManipulateText(pathTo(range.endContainer, rootNode), cs)]
    cursorOps = exports.transform(cursorOps, ops, 'right')
    var cursorOp = cursorOps[0]
    var end = nodeAt(cursorOp.path, rootNode)
    var length = countInitialRetains(cursorOp.diff)
  }

  try {
    if(!start) range.collapse(false)
    else range.setStart(start, length)
    
    if(!end) range.collapse(true)
    else range.setEnd(end, length)
  }catch(e) {
  
  }
  
  try {
    if(!end) range.collapse(true)
    else range.setEnd(end, length)
    
    if(!start) range.collapse(false)
    else range.setStart(start, length)
  }catch(e) {
  
  }
  
  return range
}

function countInitialRetains(cs) {
  var length = 0
  var ops = Changeset.unpack(cs)
  for(var i=0; i<ops.length; i++) {
    if(ops[i].input === ops[i].output) length += ops[i].length
    else break
  }
  return length
}

exports.serialize = function(snapshot) {
  return domSerialize(snapshot)
}

exports.deserialize = function(data) {
  if('undefined' == typeof document) {
  
  }else{
    var div = document.createElement('div')
    div.innerHTML = data
    return div.firstChild
  }
}

var unpackOps = exports.unpackOps = function(unpackOps) {
  return unpackOps.map(function(op) {
    switch(op.type) {
      case 'Move':
        return new exports.Move(op.from, op.to, op.element)
      case 'Manipulate':
        return new exports.Manipulate(op.path, op.prop, op.value)
      case 'ManipulateText':
        return new exports.ManipulateText(op.path, op.diff)
      default:
        throw new Error('Unknown op type: '+op.type)
    }
  })
}

exports.Move = require('./lib/index').Move
exports.Manipulate = require('./lib/index').Manipulate
exports.ManipulateText = require('./lib/index').ManipulateText
exports.adapters = require('./lib/index').adapters