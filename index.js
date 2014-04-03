
exports.create = function(initialData) {
  
}
exports.apply = function(snapshot, op) {}
exports.transform = function(op1, op2, side) {}
exports.compose  = function(op1, op2) {}





function Move(from, to) {
  this.from = from
  this.to = to
}

Move.prototype.transformAgainst = function (op) {
  if(op instanceof Move) {
    if (isDescendantOf(this.fromPath, op.from))
      this.from = Array.prototype.concat.call(op.to, this.from.slice(op.from.length)) // change from to be descendant of op.to instead of in op.from

    if (op.from == this.from && op.to != this.to)
      this.from = Array.prototype.concat.call(op.to) // so effectively, op has no effect

    if (isYoungerSiblingOf(this.from, op.to))
      this.from[this.from.length-1]++ // (shift to right)

    if (isYoungerSiblingOf(this.from, op.from)
      this.from[this.from.length-1]-- // (shift to left)

    if (isYoungerSiblingOf(this.to, op.to))
      this.from[this.from.length-1]++ // (shift to right)

    if (isYoungerSiblingOf(this.to, op.from))
      this.from[this.from.length-1]-- // (shift to left)
  }
}


function Manipulate(path, prop, value) {
  this.path = path
  this.prop = prop
  this.value = value
}

Manipulate.prototype.transformAgainst = function (op) {
  if(op instanceof Move) {

    if (op.from == this.path)
      this.path = op.to.concat() // go with the flow man.

    if (isYoungerSiblingOf(this.path, op.to))
      this.path[this.path.length-1]++ // (shift to right)

    if (isYoungerSiblingOf(this.path, op.from)
      this.path[this.path.length-1]-- // (shift to left)
  }
}




// basically checks if 2 is an ancestor of 1
// or rather, if path2 is a prefix of path1
function isDescendantOf(path1, path2) {
  // if 2 is deeper in the tree than 1, it cannot be an ancestor of 1
  if(path1.length < path2.length)
    return false

  // Now, path1 is definitely longer than path2

  // so, let's check all steps and see if path2 is a prefix of path1
  for(var i=0; i<path2.length; i++) {
    if(path1[i] != path2[i]) return false
  }

  return true // path2 is ancestor of path1!
}

function isYoungerSiblingOf(path1, path2) {
  // check if they are on the same tree level
  if(path2.length != path1.length) return false
  
  // check if they have the same parent
  var parent = path1.concat()
  parent.pop()
  if(!isDescendantOf(path2, parent)) return false

  // check if path1 is younger than path2
  if(path1[path1.length-1] > path2[path2.length-1]) return true
  
  return false
}