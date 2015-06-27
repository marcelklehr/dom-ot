var Manipulate = require('./manipulate')
  , Move = require('./move')
  , nodeAt = require('./node-at')

// Paths are arrays, where [] is the root node

function ManipulateText(path, diff) {
  this.path = path
  this.diff = diff
  this.type = 'ManipulateText'
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

ManipulateText.prototype.apply = function (rootNode, index) {
  var targetNode = nodeAt(this.path, rootNode)

  targetNode.nodeValue = this.diff // XXX: Preliminary, we need diffs!
}
