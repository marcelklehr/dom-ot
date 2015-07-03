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
// Paths are arrays, where [] is the root node
module.exports = nodeAt
function nodeAt(path, rootNode) {
  // Returns undefined if the node could not be found
  if(!rootNode) return

  if(path.length == 0) {
    return rootNode
  }

  var firstIndex = path[0]

  // Node#childNodes is a liste of *all* child nodes, including CharacterData
  // Element#children contains elements only.
  var curNode = rootNode.childNodes[firstIndex]

  return nodeAt(path.slice(1), curNode)
}
