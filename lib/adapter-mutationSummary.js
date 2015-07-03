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
var Manipulate = require('./ops/manipulate')
var ManipulateText = require('./ops/manipulate-text')
var Move = require('./ops/move')
var isPrefixOf = require('./ops/is-prefix')
var pathTo = require('./path-to')
var serialize = require('serialize-dom')
var Changeset = require('changesets').Changeset
  , diff_match_patch = require('diff_match_patch').diff_match_patch
  , diffEngine = new diff_match_patch

exports.import = summaryToOplist


/*
Create a new MutationSummary Observer that will call
your callback with a sumary, each time a change matching one of your queries
is made to node in your rootNode.

Feed the summary to this function to create an oplist.

```
var observer = new MutationSummary({
  callback: handleChanges, // required
  rootNode: myDiv, // (defaults to window.document)
  observeOwnChanges: false // (defaults to false)
  oldPreviousSibling: false // defaults to false -- I don't understand this
  queries: [
    { ... }
  ]
});
```

You will probably want to know about all changes:

```
{ all: true }
```

A summary in this case would look like the following:

```
{
  added: [ array of <node> ],
  removed: [ array of <node> ],
  reparented: [ array of <node> ],
  reordered: [ array of <node> ],
  attributeChanged: {
    attributeName1: [ array of <element> ],
    attributeName2: [ array of <element> ], ...
  },
  characterDataChanged: [array of <node>],

  getOldAttribute: function(element, attrName) { … }, // previous attribute value
  getOldCharaterData: function(node) { … }, // text before re-setting text
  getOldParentNode: function(node) { ... }, // parent before (re)moving
  getOldPreviousSibling: function(node) { ... } // position before reordering
}
```

*/

function summaryToOplist(summary, rootNode) {
  var oplist = []

  summary.projection.processChildlistChanges()

  
  if (Array.isArray(summary.removed)) {
    summary.removed.forEach(function(node) {
      var oldParent = summary.getOldParentNode(node)
      if(oldParent && !rootNode.contains(oldParent)) {
        // my parent doesn't exist anymore, so it has prolly been removed
        // ergo this delete operation is pointless
        return
      }
      oplist.push(new Move(node.domOT_path, null, serialize(node)))
    })
  }
  
  if (Array.isArray(summary.reparented)) {
    summary.reparented.forEach(function(node) {
      var oldParent = summary.getOldParentNode(node)
        , oldPath = node.domOT_path
      
      if(oldParent && !rootNode.contains(oldParent)) {
        // my parent doesn't exist anymore, so it has prolly been removed
        // ergo, this can be treated as an insert (this is the worst case and prolly needs fixing!)
        oldPath = null
      }
      oplist.push(new Move(oldPath, pathTo(node, rootNode), serialize(node)))
    })
  }

  if (Array.isArray(summary.reordered)) {
    summary.reordered.forEach(function(node) {
      var oldParent = summary.getOldParentNode(node)
      if(oldParent && !rootNode.contains(oldParent)) {
        // parent was removed, ergo this is op pointless
        return
      }
      oplist.push(new Move(node.domOT_path, pathTo(node, rootNode)))
    })
  }

  if (Array.isArray(summary.added)) {
    summary.added
    //.reverse()// traverse added elements in reverse order, because MutationSummary puts children first for some reason
    .forEach(function(node) {
      oplist.push(new Move(null, pathTo(node, rootNode), serialize(node)))
    })
  }
  
  // Convergence over intention preservation
  // e.g. <div>hello <i>world</i></div> -> <div>hello <b><i>world</i></b></div>
  // Since Move(nul, [0,1]) already contains <i>world</i> we remove the repanting of <i>world</i>
  // We could also try to extract <i>world</i> from Move(nul, [0,1]), but that'd be more complex
  oplist = oplist.filter(function(op1) {
    // Don't insert this node if its parent is already being inserted
    if(oplist.some(function(op2) {
      if(op2 === op1) return false
      return isPrefixOf(op2.to, op1.to)
    })) {
      if(op1.from) {
        op1.to = null
        return true
      }
      else return false
    }
    return true
  })
  
  oplist.sort(sortOps)
  
  // transform non-inserts against Inserts/Moves in the order of operations
  oplist.forEach(function(op) {
    if(op.from || op.path) {
      for(var i=0; i<oplist.length; i++) {
        var op2 = oplist[i]
          , path = (op.from || op.path) && (op.from || op.path).join('')
          , path2 = op2.to && op2.to.join('')
        if(path && path2 && path > path2) {
          op.transformAgainst(op2)
        }
      }
    }
  })
  
  // transfrom moves and manipulates against (re)moves
  oplist.forEach(function(op) {
    if(op.from || op.path) {
      for(var i=0; i<oplist.length; i++) {
        var op2 = oplist[i]
          , path = (op.from || op.path) && (op.from || op.path).join('')
          , path2 = op2.from && op2.from.join('')
        if(path && path2 && path > path2) {
          op.transformAgainst(op2)
        }
      }
    }
  })

  if(summary.attributeChanged) {
    for(var attr in summary.attributeChanged) {
      summary.attributeChanged[attr].forEach(function(node) {
        oplist.push(new Manipulate(pathTo(node, rootNode), attr, node.getAttribute(attr)))
      })
    }
  }

  if(Array.isArray(summary.characterDataChanged)) {
    summary.characterDataChanged.forEach(function(node) {
      var diff = diffEngine.diff_main(summary.getOldCharacterData(node), node.nodeValue)
        , changeset = Changeset.fromDiff(diff).pack()
      oplist.push(new ManipulateText(pathTo(node, rootNode), changeset))
    })
  }

  oplist.sort(sortOps)
  
  

  return oplist
}

function sortOps(op1, op2) {
  var path1 = (op1.path || op1.to || op1.from).map(strPad.bind(null, '00000')).join('') // XXX: Hard limit: Can't correctly sort ops with path elements longer than 5 digits
  var path2 = (op2.path || op2.to || op2.from).map(strPad.bind(null, '00000')).join('')
  return path1 == path2? 0 : (path1 > path2? 1 : -1)
}

function strPad(paddingValue, str) {
   return String(paddingValue + str).slice(-paddingValue.length);
}

exports.createIndex = function(rootNode) {
  setIndex(rootNode, [])
}

function setIndex(node, path) {
  node.domOT_path = path
  if(node.childNodes) {
    for(var i=0; i<node.childNodes.length; i++) {
      setIndex(node.childNodes[i], path.concat([i]))
    }
  }
}
