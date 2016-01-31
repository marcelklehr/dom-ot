/**
 * dom-ot - Operational transform library for DOM operations
 * Copyright (C) 2015 Marcel Klehr <mklehr@gmx.net>
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Lesser General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public License
 *  along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */
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
