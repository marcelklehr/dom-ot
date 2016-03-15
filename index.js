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

var virtualize = require('vdom-virtualize')
  , serialize = require('vdom-serialize')
  , nodeAt = require('domnode-at-path')
  , pathTo = require('path-to-domnode')
  , Changeset = require('changesets').Changeset
  , ManipulateText = require('./lib/ops/manipulate-text')

exports.create = function(initialData) {
  var requireJSDOM = 'jsdom-no-contextify'
    , jsdom = require(requireJSDOM).jsdom
  var document = jsdom(initialData||'<div>Hello world</div>')
  return document.body.firstChild
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
  var start, end, newrange = {}
  if(rootNode.contains(range.startContainer) && range.startContainer.nodeValue) {
    start = transformCaret({container: range.startContainer, offset: range.startOffset}, ops, rootNode)
    newrange.startContainer = start.container
    newrange.startOffset = start.offset
  }
  else {
    newrange.startContainer = range.startContainer
    newrange.startOffset = range.startOffset
  }
  if(rootNode.contains(range.endContainer) && range.endContainer.nodeValue) {
    end = transformCaret({container: range.endContainer, offset: range.endOffset}, ops, rootNode)
    newrange.endContainer = end.container
    newrange.endOffset = end.offset
  }
  else {
    newrange.endContainer = range.endContainer
    newrange.endOffset = range.endOffset
  }

  return newrange
}

function transformCaret(caret, ops, rootNode) {
  var cs = Changeset.create()
          .retain(caret.offset)
          .insert('|')
          .retain(caret.container.nodeValue.length-caret.offset)
          .end()
          .pack()
  var cursorOps = [new ManipulateText(pathTo(caret.container, rootNode), cs)]
  cursorOps = exports.transform(cursorOps, ops, 'right')
  var cursorOp = cursorOps[0]
  var container = nodeAt(cursorOp.path, rootNode)
  var offset = countInitialRetains(cursorOp.diff)
  return {container: container, offset: offset}
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
  return serialize(virtualize(snapshot))
}

exports.deserialize = function(data, document) {
  var virtual = JSON.parse(data)
  if(!document) {
    if('undefined' == typeof window) {
      var requireJSDOM = 'jsdom-no-contextify'
        , jsdom = require(requireJSDOM).jsdom
      document = jsdom('<div></div>')
    }else{
      document = window.document
    }
  }
  return devirtualize(document, virtual)
}

function devirtualize(document, virtual) {
  var node
  if(typeof virtual.tagName !== 'undefined') {
    if(virtual.namespace) {
      node = document.createElementNS(virtual.namespace, virtual.tagName)
    }else{
      node = document.createElement(virtual.tagName)
    }
  }
  if(typeof virtual.text !== 'undefined') {
    node = document.createTextNode(virtual.text)
  }
  if(virtual.properties) {
    for(var prop in virtual.properties) {
      if(prop == 'attributes') {
        for(var attr in virtual.properties.attributes) {
          node.setAttribute(attr, virtual.properties.attributes[attr])
        }
      }else {
        if('object' === typeof virtual.properties[prop]) {
          for(var p in virtual.properties[prop]) {
            node[prop][p] = virtual.properties[prop][p]
          }
        }else{
          node[prop] = virtual.properties[prop]
        }
      }
    }
  }
  if(virtual.children) {
    virtual.children
    .map(devirtualize.bind(null, document))
    .forEach(function(n) {
      node.appendChild(n)
    })
  }
  return node
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
