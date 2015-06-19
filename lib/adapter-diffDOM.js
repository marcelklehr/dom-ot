var Manipulate = require('./ops/Manipulate')
  , ManipulateText = require('./ops/ManipulateText')
  , Move = require('./ops/Move')

var ADD_ATTRIBUTE = 0,
    MODIFY_ATTRIBUTE = 1,
    REMOVE_ATTRIBUTE = 2,
    MODIFY_TEXT_ELEMENT = 3,
    RELOCATE_GROUP = 4,
    REMOVE_ELEMENT = 5,
    ADD_ELEMENT = 6,
    REMOVE_TEXT_ELEMENT = 7,
    ADD_TEXT_ELEMENT = 8,
    REPLACE_ELEMENT = 9,
    MODIFY_VALUE = 10,
    MODIFY_CHECKED = 11,
    MODIFY_SELECTED = 12,
    ACTION = 13,
    ROUTE = 14,
    OLD_VALUE = 15,
    NEW_VALUE = 16,
    ELEMENT = 17,
    GROUP = 18,
    FROM = 19,
    TO = 20,
    NAME = 21,
    VALUE = 22,
    TEXT = 23,
    ATTRIBUTES = 24,
    NODE_NAME = 25,
    COMMENT = 26,
    CHILD_NODES = 27,
    CHECKED = 28,
    SELECTED = 29;

exports.import = function(op, hooks) {
  var action = op[ACTION]
    , route = op[ROUTE] // XXX: convert path
    , to = op[TO]

  switch(action) {
    case ADD_ATTRIBUTE:
      return new Manipulate(route, op[NAME], op[VALUE])

    case MODIFY_ATTRIBUTE:
      return new Manipulate(route, op[NAME], op[VALUE])

    case REMOVE_ATTRIBUTE:
      return new Manipulate(route, op[NAME], null)

    case MODIFY_TEXT_ELEMENT:
      return new ManipulateText(route, hooks.text_diff(op[OLD_VALUE], op[NEW_VALUE])) // XXX: https://github.com/fiduswriter/diffDOM/issues/6 -- also, how should text content be referenced?

    case REMOVE_TEXT_ELEMENT:
      return new Move(route, null)

    case ADD_TEXT_ELEMENT:
      return new Move(null, op[TO/route], op[ELEMENT]?) //XXX: Don't know how this op looks like exactly

    case RELOCATE_GROUP:
      return new Move(route, op[TO]) //XXX: Don't know how this op looks like exactly

    case REMOVE_ELEMENT:
      return new Move(route, null)

    case ADD_ELEMENT:
      return new Move(null, route, op[ELEMENT])

    case REPLACE_ELEMENT:
      return // XXX: How does this work exactly?

    case MODIFY_VALUE: // wtf?
      return

    case MODIFY_CHECKED:
      return

    case MODIFY_SELECTED:
      return
  }
}

exports.export = function(op) {

}
