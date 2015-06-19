
// basically checks if 2 is an ancestor of 1
// or rather, if path1 is a prefix of path2
module.exports = function isPrefixOf(path1, path2) {
  // if path1 (the supposed ancestor) is deeper or as deep in the tree as
  // path2 (the supposed descendant), it cannot be an ancestor
  if(path2.length < path1.length)
    return false

  // Now, path2 is longer than or as long as path1,
  // so we can safely check all indices of path1 on path2

  // so, let's check all steps and see if path1 is a prefix of path2
  for(var i=0; i<path1.length; i++) {
    if(path1[i] != path2[i]) return false
  }

  return true // path1 is prefix of path1!
}
