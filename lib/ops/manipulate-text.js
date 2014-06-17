var Manipulate = require('./manipulate')
  , nodeAt = require('./node-at')

// Paths are arrays, where [0] is the root node

function ManipulateText(path, diff) {
  this.path = path
  this.diff = diff
}

module.exports = ManipulateText

ManipulateText.prototype.transformAgainst = function (op) {
  if(op instanceof Move) {
    return Manipulate.prototype.transformAgainst.call(this, op)
  }
  if(op instanceof ManipulateText) {
    // XXX: text transform
  }
}

ManipulateText.prototype.apply = function (rootNode) {
  var targetNode = nodeAt(this.path, rootNode)
  
  targetNode.nodeValue = this.diff // XXX: Preliminary, we need diffs!
}
