# dom-ot
The DOM changes. You can [capture](https://github.com/marcelklehr/mutation-summary) those changes and [sync](https://github.com/marcelklehr/gulf) multiple documents in real-time using this library to transform the changes for automagic conflict resolution.

Sounds awesome? It is. To learn more about operational transformation, go to [wikipedia](http://en.wikipedia.org/wiki/Operational_transformation) or check out this [guide to textual ot](http://github.com/marcelklehr/changesets#usage). Also, check out [gulf-contenteditable](https://github.com/marcelklehr/gulf-contenteditable) for a ready-made wrapper.

[![browser support](https://ci.testling.com/marcelklehr/dom-ot.png)](https://ci.testling.com/marcelklehr/dom-ot)

## Install

```
npm install dom-ot
```

## API

### domOT
The object you get from `require('dom-ot')` is a full-featured shareJS ottype. This allows you to use dom-ot together with [shareJS](https://github.com/share/sharejs) or the more unixy [gulf](https://github.com/marcelklehr/gulf). The shareJS interface will deal only with edits. An edit is essentially an array of operations.

### new domOT.Move(fromPath, toPath, [serializedNode])
This operation allows you to move a node from one path to another. Set `fromPath` to null to insert a node into the tree (which should be passed as `serializedNode`, serialized with [vdom-serialize](http://github.com/marcelklehr/vdom-serialize)).
Set `toPath` to null, to remove a node from the tree.

### new domOT.Manipulate(path, attribute, [value])
This operation allows you to set an attribute named `attribute` of a given node at `path` to a specific `value`. Omit value to remove the attribute.

### new domOT.ManipulateText(path, diff)
This operation allows you to modify the `nodeValue` of a text node, by specifying a diff (which should be a packed [changeset](https://github.com/marcelklehr/changesets)).

### Operation#transformAgainst(op, [left])
Transforms this operation *in-place* against another one, so that it assumes the changes of the other one have already happened. Use `left` to break ties.

### Operation#apply(rootNode, [index])
Apply an operation on a document, specified by `rootNode`. Optionally, you may set `index` to `true`, to automatically index nodes for importing MutationSummaries (see the mutationSummary adapter).

### domOT.adapters
Usually you will not create these operations by hand: Fortunately there's a handy adapter that will turn [MutationObserver summaries](https://github.com/rafaelw/mutation-summary) into dom-ot edits. Currently there's only an import method available that allows you to convert mutation summaries into dom-ot edits, but not the other way around. I simply couldn't find a use case for that, so that's it.

#### domOT.adapters.mutationSummary

##### domOT.adapters.mutationSummary.import(summary, rootNode)
 * `summary` is a summary object as returned by MutationSummary
 * `rootNode` is the rootNode that was observed
Before installing a MutationObserver with MutationSummary and importing the changes with this function, you will need to run an indexing function on the rootNode, so that the adapter can figure out where the nodes were before. Also, you need to continuously index newly inserted or moved nodes. You can set the optional `index` param of `<Operation>#apply` to `true`, to do this automatically and efficiently.

##### domOT.adapters.mutationSummary.createIndex(rootNode)
Creates an index for all children of rootNode which is necessary for `import()` to work.

## Tests
Run `browserify test/tests.js > bundle.js`, then open `test/index.html` in the browser of your choice.

## Legal
(c) 2015 by Marcel Klehr

Licensed under the terms of the LGPL. See `LICENSE.txt` in the root directory of this project.
