/**
 * dom-ot - Operational transform library for DOM operations
 * Copyright (C) 2015 Marcel Klehr <mklehr@gmx.net>
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 *  along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */
module.exports = function pathTo(node, root) {
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

  return parentPath
}