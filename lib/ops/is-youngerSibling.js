var isPrefixOf = require('./is-prefix')
module.exports = function isYoungerSiblingOf(path1, path2) {
  // check if they are on the same tree level
  if(path2.length != path1.length) return false

  // check if they have the same parent
  var parent = path1.concat()
  parent.pop()
  if(!isPrefixOf(parent, path2)) return false

  // check if path1 is younger than path2
  if(path1[path1.length-1] > path2[path2.length-1]) return true

  return false
}
