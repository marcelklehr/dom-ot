
// basically checks if 2 is an ancestor of 1
// or rather, if path2 is a prefix of path1
module.exports = function isDescendantOf(path1, path2) {
  // if path2 (the supposed ancestor) is deeper or as deep in the tree as
  // path1 (the supposed descendant), it cannot be an ancestor
  if(path1.length <= path2.length)
    return false

  // Now, path1 is definitively longer than path2,
  // so we can safely check all indices of path2 on path1

  // so, let's check all steps and see if path2 is a prefix of path1
  for(var i=0; i<path2.length; i++) {
    if(path1[i] != path2[i]) return false
  }

  return true // path2 is ancestor of path1!
}