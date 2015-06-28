var isPrefixOf = require('./is-prefix')
module.exports = function isYoungerSiblingOf(path1, path2) {
  // check if path2 is on a higher tree level
  if(path2.length > path1.length) return false

  // check if they have the same parent
  var parent = path1.concat()
  do {
    parent.pop()
    if(isPrefixOf(parent, path2) && parent.length < path2.length) {
      if(path1[parent.length] > path2[parent.length] && parent.length+1 === path2.length)
        return parent.length
    }
  } while(parent.length);

  return false
}

module.exports.isYoungerOrEqualSiblingOf = function isYoungerOrEqualSiblingOf(path1, path2) {
  // check if path2 is on a higher tree level
  if(path2.length > path1.length) return false

  // check if they have the same parent
  var parent = path1.concat()
  do {
    parent.pop()
    if(isPrefixOf(parent, path2) && parent.length < path2.length) {
      if(path1[parent.length] >= path2[parent.length] && parent.length+1 === path2.length)
        return parent.length
    }
  } while(parent.length);

  return false
}