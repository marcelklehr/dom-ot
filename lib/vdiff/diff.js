/**
 * Computes the differences between to vnodes
 */
module.exports = function diff(a, b) {
  var ops = []
  walk(a, b, ops, [0])
  return ops
}

function walk(a, b, ops, currentPath) {
  if(a === b) return
}

var identify =
module.exports.identify = function(a, b, preventRecusion) {
  if (!a || !b) return 0;
  if (a.type !== b.type) return 0;
  if (isVText(a)) {
    if (!isVText(b)) return 0;
    // Note that we initially don't care what the text content of a node is,
    // the mere fact that it's the same tag and "has text" means it's roughly
    // equal, and then we can find out the true text difference later.
    return preventRecursion ? true : e1.data === e2.data;
  }
  if (a.tagName !== b.tagName) return 0;
  
  var score = 0 // if they are the same => socre:=1
  
  if (a.children.length == b.children.length) return 1;
  else score += 0.5

  for (var i = a.children.length - 1; i >= 0; i--) {
    if (preventRecursion) {
      score = score && (b.children[i] && a.children[i].tagName === b.children[i].tagName)? score+(1/a.children.length) : score-(1/a.children.length);
    } else {
      // note: we only allow one level of recursion at any depth. If 'preventRecursion'
      //       was not set, we must explicitly force it to true for child iterations.
      score += identify(a.children[i], b.children[i], true)/a.children.length;
    }
  }
  return score
}