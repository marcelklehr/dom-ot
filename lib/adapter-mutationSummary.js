var Manipulate = require('./ops/manupulate')
var Move = require('./ops/move')
module.exports = summaryToOplist


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

  if (Array.isArray(summary.added)) {
    summary.added.forEach(function(node) {
      oplist.push(new Move(null, pathTo(node, rootNode), node))
    })
  }

  if (Array.isArray(summary.removed)) {
    summary.added.forEach(function(node) {
      var oldSibling = summary.getOldPreviousSibling()
        , oldPath

      if(oldSibling) {
        // My older brother
        oldPath = pathTo(oldSibling, rootNode)
        oldPath[oldPath.length-1]++
      }else {
        // I was the oldest
        oldPath = pathTo(summary.getOldParentNode())
        oldPath.push(0)
      }
      oplist.push(new Move(oldPath, null, node))
    })
  }

  if (Array.isArray(summary.reparented)) {
    summary.reparented.forEach(function(node) {
      var oldSibling = summary.getOldPreviousSibling()
        , oldPath

      if(oldSibling) {
        // My older brother
        oldPath = pathTo(oldSibling, rootNode)
        oldPath[oldPath.length-1]++
      }else {
        // I was the oldest
        oldPath = pathTo(summary.getOldParentNode())
        oldPath.push(0)
      }
      oplist.push(new Move(oldPath, pathTo(node, rootNode)))
    })
  }

  if (Array.isArray(summary.reordered)) {
    summary.reordered.forEach(function(node) {
      var oldSibling = summary.getOldPreviousSibling()
        , newPath = pathTo(node, rootNode)
        , oldPath

      if(oldSibling) {
        // My older brother
        oldPath = pathTo(oldSibling, rootNode)
        oldPath[oldPath.length-1]++
      }else {
        // I was the oldest
        oldPath = pathTo(summary.getOldParentNode())
        oldPath.push(0)
      }
      oplist.push(new Move(oldPath, newPath))
    })
  }

  if(summary.attributeChanged) {
    for(var attr in summary.attributeChanged) {
      summary.attributeChanged[attr].forEach(forEachNode)
    }
    function forEachNode(node) {
      oplist.push(new Manipulate(pathTo(node, rootNode), attr, node.getAttribute(attr)))
    }
  }

  if(Array.isArray(summary.characterDataChanged)) {
    summary.characterDataChanged.forEach(function(node) {
      oplist.push(new ManipulateText(pathTo(node, rootNode), node.nodeValue)) // XXX: diff!
    })
  }
}

function pathTo(node, root) {
  if(!root) throw new Error('No root node specified.')

  if(node === root) return []

  if(!root.contains(node)) {
    throw new Error('Cannot determine path. Node is not a descendant of root node.')
  }

  // The number of older siblings equals my index in the list of childNodes
  var myIndex = 0, n = node
  while(n.previousSibling) {
    n = n.previousSibling
    myIndex++
  }

  var parentPath = pathTo(node.parentNode, root)
  parentPath.push(myIndex)
}
