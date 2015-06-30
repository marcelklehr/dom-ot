var Manipulate = require('./manipulate')
  , Move = require('./move')
  , nodeAt = require('./node-at')
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

ManipulateText.prototype.apply = function (rootNode, index, dry) {
  if(!this.path || dry) return
  var targetNode = nodeAt(this.path, rootNode)

  targetNode.nodeValue = changesets.apply(targetNode.nodeValue, this.diff)
}
