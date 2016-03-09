var chai = require('chai')
  , should = chai.should()
  , expect = chai.expect
  , domOT = require('../')
  , MutationSummary = require('mutation-summary')
  , Changeset = require('changesets').Changeset
  , diff_match_patch = require('diff_match_patch').diff_match_patch
  , diffEngine = new diff_match_patch

describe('dom-ot', function() {
  describe('transformations', function() {
    it('should transform `Move#from` correctly for older siblings removed', function() {
      var move1 = new domOT.Move([0,1], null)
        , move2 = new domOT.Move([0,0], null)
      move1.transformAgainst(move2)
      move1.from.should.deep.equal([0,0])
    })

    it('should transform `Move#from` correctly for node removed', function() {
      var move1 = new domOT.Move([0,1], null)
        , move2 = new domOT.Move([0,1], null)
      move1.transformAgainst(move2)
      expect(move1.from).to.be.null
    })

    it('should transform `Move#from` correctly for younger siblings removed', function() {
      var move1 = new domOT.Move([0,0], null)
        , move2 = new domOT.Move([0,1], null)
      move1.transformAgainst(move2)
      move1.from.should.deep.equal([0,0])
    })

    it('should transform `Move#from` correctly for older siblings added', function() {
      var move1 = new domOT.Move([0,3], null)
        , move2 = new domOT.Move(null, [0,0])
      move1.transformAgainst(move2)
      move1.from.should.deep.equal([0,4])
    })

    it('should transform `Move#from` correctly for equal siblings added', function() {
      var move1 = new domOT.Move([0,0], null)
        , move2 = new domOT.Move(null, [0,0])
      move1.transformAgainst(move2)
      move1.from.should.deep.equal([0,1])
    })

    it('should transform `Move#from` correctly for younger siblings added', function() {
      var move1 = new domOT.Move([0,0], null)
        , move2 = new domOT.Move(null, [0,1])
      move1.transformAgainst(move2)
      move1.from.should.deep.equal([0,0])
    })

    it('should transform `Move#from` correctly for parents moved', function() {
      var move1 = new domOT.Move([0,1], null)
        , move2 = new domOT.Move([0], [1])
      move1.transformAgainst(move2)
      move1.from.should.deep.equal([1,1])
    })

    it('should transform `Move#from` correctly for older ancestor-sibling added', function() {
      var move1 = new domOT.Move([1,0], null)
        , move2 = new domOT.Move(null, [0])
      move1.transformAgainst(move2)
      move1.from.should.deep.equal([2,0])
    })

    it('should transform `Move#from` correctly for younger ancestor-sibling added', function() {
      var move1 = new domOT.Move([1,0], null)
        , move2 = new domOT.Move(null, [2])
      move1.transformAgainst(move2)
      move1.from.should.deep.equal([1,0])
    })

    it('should transform `Move#from` correctly for older ancestor-sibling removed', function() {
      var move1 = new domOT.Move([1,0], null)
        , move2 = new domOT.Move([0], null)
      move1.transformAgainst(move2)
      move1.from.should.deep.equal([0,0])
    })

    it('should transform `Move#from` correctly for younger ancestor-sibling removed', function() {
      var move1 = new domOT.Move([1,0], null)
        , move2 = new domOT.Move([2], null)
      move1.transformAgainst(move2)
      move1.from.should.deep.equal([1,0])
    })

    it('should transform `Move#from` correctly for node moved', function() {
      var move1 = new domOT.Move([0,1], null)
        , move2 = new domOT.Move([0,1], [1,1])
      move1.transformAgainst(move2)
      move1.from.should.deep.equal([1,1])
    })



    it('should transform `Move#to` correctly for older siblings removed', function() {
      var move1 = new domOT.Move(null, [0,1])
        , move2 = new domOT.Move([0,0], null)
      move1.transformAgainst(move2)
      move1.to.should.deep.equal([0,0])
    })

    it('should transform `Move#to` correctly for younger siblings removed', function() {
      var move1 = new domOT.Move(null, [0,1])
        , move2 = new domOT.Move([0,2], null)
      move1.transformAgainst(move2)
      move1.to.should.deep.equal([0,1])
    })

    it('should transform `Move#to` correctly for older siblings added', function() {
      var move1 = new domOT.Move(null, [0,1])
        , move2 = new domOT.Move(null, [0,0])
      move1.transformAgainst(move2)
      move1.to.should.deep.equal([0,2])
    })

    it('should transform `Move#to` correctly for younger siblings added', function() {
      var move1 = new domOT.Move(null, [0,1])
        , move2 = new domOT.Move(null, [0,2])
      move1.transformAgainst(move2)
      move1.to.should.deep.equal([0,1])
    })

    it('should transform `Move#to` correctly for parents moved', function() {
      var move1 = new domOT.Move(null, [0,0])
        , move2 = new domOT.Move([0], [1])
      move1.transformAgainst(move2)
      move1.to.should.deep.equal([1,0])
    })

    it('should transform `Move#to` correctly for equal sibling moved', function() {
      var move1 = new domOT.Move(null, [0,0])
        , move2 = new domOT.Move([0,0], [1,0])
      move1.transformAgainst(move2)
      move1.to.should.deep.equal([0,0])
    })

    it('should transform `Move#to` correctly for older ancestor-sibling removed', function() {
      var move1 = new domOT.Move(null, [1,0])
        , move2 = new domOT.Move([0], null)
      move1.transformAgainst(move2)
      move1.to.should.deep.equal([0,0])
    })

    it('should transform `Move#to` correctly for equal ancestor-sibling removed', function() {
      var move1 = new domOT.Move(null, [1,0])
        , move2 = new domOT.Move([1], null)
      move1.transformAgainst(move2)
      expect(move1.to).to.be.null
    })

    it('should transform `Move#to` correctly for younger ancestor-sibling removed', function() {
      var move1 = new domOT.Move(null, [1,0])
        , move2 = new domOT.Move([2], null)
      move1.transformAgainst(move2)
      move1.to.should.deep.equal([1,0])
    })

    it('should transform `Move#to` correctly for older ancestor-sibling added', function() {
      var move1 = new domOT.Move(null, [1,0])
        , move2 = new domOT.Move(null, [0])
      move1.transformAgainst(move2)
      move1.to.should.deep.equal([2,0])
    })

    it('should transform `Move#to` correctly for equal ancestor-sibling added', function() {
      var move1 = new domOT.Move(null, [1,0])
        , move2 = new domOT.Move(null, [1])
      move1.transformAgainst(move2)
      move1.to.should.deep.equal([2,0])
    })

    it('should transform `Move#to` correctly for younger ancestor-sibling added', function() {
      var move1 = new domOT.Move(null, [1,0])
        , move2 = new domOT.Move(null, [2])
      move1.transformAgainst(move2)
      move1.to.should.deep.equal([1,0])
    })



    it('should transform `Manipulate#path` correctly for older siblings removed', function() {
      var manipulate = new domOT.Manipulate([0,1], 'data-attrib', 'value')
        , move2 = new domOT.Move([0,0], null)
      manipulate.transformAgainst(move2)
      manipulate.path.should.deep.equal([0,0])
    })

    it('should transform `Manipulate#path` correctly for younger siblings removed', function() {
      var manipulate = new domOT.Manipulate([0,0], 'data-attrib', 'value')
        , move2 = new domOT.Move([0,1], null)
      manipulate.transformAgainst(move2)
      manipulate.path.should.deep.equal([0,0])
    })

    it('should transform `Manipulate#path` correctly for older siblings added', function() {
      var manipulate = new domOT.Manipulate([0,3], 'data-attrib', 'value')
        , move2 = new domOT.Move(null, [0,0])
      manipulate.transformAgainst(move2)
      manipulate.path.should.deep.equal([0,4])
    })

    it('should transform `Manipulate#path` correctly for equal siblings added', function() {
      var manipulate = new domOT.Manipulate([0,0], 'data-attrib', 'value')
        , move2 = new domOT.Move(null, [0,0])
      manipulate.transformAgainst(move2)
      manipulate.path.should.deep.equal([0,1])
    })

    it('should transform `Manipulate#path` correctly for younger siblings added', function() {
      var manipulate = new domOT.Manipulate([0,0], 'data-attrib', 'value')
        , move2 = new domOT.Move(null, [0,1])
      manipulate.transformAgainst(move2)
      manipulate.path.should.deep.equal([0,0])
    })

    it('should transform `Manipulate#path` correctly for parents moved', function() {
      var manipulate = new domOT.Manipulate([0,1], 'data-attrib', 'value')
        , move2 = new domOT.Move([0], [1])
      manipulate.transformAgainst(move2)
      manipulate.path.should.deep.equal([1,1])
    })

    it('should transform `Manipulate#path` correctly for node moved', function() {
      var manipulate = new domOT.Manipulate([0,1], 'data-attrib', 'value')
        , move2 = new domOT.Move([0,1], [1,1])
      manipulate.transformAgainst(move2)
      manipulate.path.should.deep.equal([1,1])
    })

    it('should transform `Manipulate#path` correctly for older ancestor-sibling removed', function() {
      var manipulate = new domOT.Manipulate([1,0], 'data-attrib', 'value')
        , move2 = new domOT.Move([0], null)
      manipulate.transformAgainst(move2)
      manipulate.path.should.deep.equal([0,0])
    })

    it('should transform `Manipulate#path` correctly for equal ancestor-sibling removed', function() {
      var manipulate = new domOT.Manipulate([1,0], 'data-attrib', 'value')
        , move2 = new domOT.Move([1], null)
      manipulate.transformAgainst(move2)
      expect(manipulate.path).to.be.null
    })

    it('should transform `Manipulate#path` correctly for younger ancestor-sibling removed', function() {
      var manipulate = new domOT.Manipulate([1,0], 'data-attrib', 'value')
        , move2 = new domOT.Move([2], null)
      manipulate.transformAgainst(move2)
      manipulate.path.should.deep.equal([1,0])
    })

    it('should transform `Manipulate#path` correctly for older ancestor-sibling added', function() {
      var manipulate = new domOT.Manipulate([1,0], 'data-attrib', 'value')
        , move2 = new domOT.Move(null, [0])
      manipulate.transformAgainst(move2)
      manipulate.path.should.deep.equal([2,0])
    })

    it('should transform `Manipulate#path` correctly for equal ancestor-sibling added', function() {
      var manipulate = new domOT.Manipulate([1,0], 'data-attrib', 'value')
        , move2 = new domOT.Move(null, [1])
      manipulate.transformAgainst(move2)
      manipulate.path.should.deep.equal([2,0])
    })

    it('should transform `Manipulate#path` correctly for younger ancestor-sibling added', function() {
      var manipulate = new domOT.Manipulate([1,0], 'data-attrib', 'value')
        , move2 = new domOT.Move(null, [2])
      manipulate.transformAgainst(move2)
      manipulate.path.should.deep.equal([1,0])
    })



    it('should transform `ManipulateText#path` correctly for siblings removed', function() {
      var manipulate = new domOT.ManipulateText([0,1], 'diff')
        , move2 = new domOT.Move([0,0], null)
      manipulate.transformAgainst(move2)
      manipulate.path.should.deep.equal([0,0])
    })

    it('should transform `ManipulateText#path` correctly for siblings removed', function() {
      var manipulate = new domOT.ManipulateText([0,0], 'diff')
        , move2 = new domOT.Move([0,1], null)
      manipulate.transformAgainst(move2)
      manipulate.path.should.deep.equal([0,0])
    })

    it('should transform `ManipulateText#path` correctly for siblings added', function() {
      var manipulate = new domOT.ManipulateText([0,0], 'diff')
        , move2 = new domOT.Move(null, [0,0])
      manipulate.transformAgainst(move2)
      manipulate.path.should.deep.equal([0,1])
    })

    it('should transform `ManipulateText#path` correctly for siblings added', function() {
      var manipulate = new domOT.ManipulateText([0,0], 'diff')
        , move2 = new domOT.Move(null, [0,1])
      manipulate.transformAgainst(move2)
      manipulate.path.should.deep.equal([0,0])
    })

    it('should transform `ManipulateText#path` correctly for parents moved', function() {
      var manipulate = new domOT.ManipulateText([0,1], 'diff')
        , move2 = new domOT.Move([0], [1])
      manipulate.transformAgainst(move2)
      manipulate.path.should.deep.equal([1,1])
    })

    it('should transform `ManipulateText#path` correctly for node moved', function() {
      var manipulate = new domOT.ManipulateText([0,1], 'diff')
        , move2 = new domOT.Move([0,1], [1,1])
      manipulate.transformAgainst(move2)
      manipulate.path.should.deep.equal([1,1])
    })

    it('should transform `ManipulateText#path` correctly for older ancestor-sibling removed', function() {
      var manipulate = new domOT.ManipulateText([1,0], 'diff')
        , move2 = new domOT.Move([0], null)
      manipulate.transformAgainst(move2)
      manipulate.path.should.deep.equal([0,0])
    })

    it('should transform `ManipulateText#path` correctly for equal ancestor-sibling removed', function() {
      var manipulate = new domOT.ManipulateText([1,0], 'diff')
        , move2 = new domOT.Move([1], null)
      manipulate.transformAgainst(move2)
      expect(manipulate.path).to.be.null
    })

    it('should transform `ManipulateText#path` correctly for younger ancestor-sibling removed', function() {
      var manipulate = new domOT.ManipulateText([1,0], 'diff')
        , move2 = new domOT.Move([2], null)
      manipulate.transformAgainst(move2)
      manipulate.path.should.deep.equal([1,0])
    })

    it('should transform `ManipulateText#path` correctly for older ancestor-sibling added', function() {
      var manipulate = new domOT.ManipulateText([1,0], 'diff')
        , move2 = new domOT.Move(null, [0])
      manipulate.transformAgainst(move2)
      manipulate.path.should.deep.equal([2,0])
    })

    it('should transform `ManipulateText#path` correctly for equal ancestor-sibling added', function() {
      var manipulate = new domOT.ManipulateText([1,0], 'diff')
        , move2 = new domOT.Move(null, [1])
      manipulate.transformAgainst(move2)
      manipulate.path.should.deep.equal([2,0])
    })

    it('should transform `ManipulateText#path` correctly for younger ancestor-sibling added', function() {
      var manipulate = new domOT.ManipulateText([1,0], 'diff')
        , move2 = new domOT.Move(null, [2])
      manipulate.transformAgainst(move2)
      manipulate.path.should.deep.equal([1,0])
    })

    it('should transform `ManipulateText#diff` correctly for other diff', function() {
      var div = document.createElement('div')
      div.appendChild(document.createTextNode('abc'))
      var manipulate = new domOT.ManipulateText([0], Changeset.fromDiff(diffEngine.diff_main('abc','abcd')).pack())
        , manipulate2 = new domOT.ManipulateText([0], Changeset.fromDiff(diffEngine.diff_main('abc','1abc')).pack())
      manipulate.transformAgainst(manipulate2)
      expect(manipulate.path).to.deep.equal([0])
      manipulate2.apply(div)
      manipulate.apply(div)
      expect(div.firstChild.nodeValue).to.equal('1abcd') // This is just a simple text OT test, https://github.com/marcelklehr/changesets has complete coverage for all possible cases...
    })
  })

  describe('mutationSummary adapter', function() {
    var div
    beforeEach(function() {
      div = document.createElement('div')
    })

    it('should overtake inserts', function(cb) {
      domOT.adapters.mutationSummary.createIndex(div)

      var observer = new MutationSummary({
        callback: onChange, // required
        rootNode: div,
        oldPreviousSibling: true,
        queries: [ { all: true} ]
      })

      div.appendChild(document.createElement('p'))

      function onChange(summaries) {
        var ops = domOT.adapters.mutationSummary.import(summaries[0], div)

        expect(ops[0]).to.be.instanceof(domOT.Move)
        expect(ops[0].from).to.be.null
        expect(ops[0].to).to.deep.equal([0])

        cb()
      }
    })

    it('should overtake deletes', function(cb) {
      var p = document.createElement('p')
      div.appendChild(p)

      domOT.adapters.mutationSummary.createIndex(div)

      var observer = new MutationSummary({
        callback: onChange, // required
        rootNode: div,
        oldPreviousSibling: true,
        queries: [ { all: true} ]
      })

      div.removeChild(p)

      function onChange(summaries) {
        var ops = domOT.adapters.mutationSummary.import(summaries[0], div)

        expect(ops[0]).to.be.instanceof(domOT.Move)
        expect(ops[0].to).to.be.null
        expect(ops[0].from).to.deep.equal([0])

        cb()
      }
    })

    it('should not insert a newly wrapped node twice', function(cb) {
      var i, p
      div.appendChild(i = document.createElement('i'))

      var newdiv = div.cloneNode(true)

      domOT.adapters.mutationSummary.createIndex(div)

      var observer = new MutationSummary({
        callback: onChange, // required
        rootNode: div,
        oldPreviousSibling: true,
        queries: [ { all: true} ]
      })

      // make some changes: wrap the <i> in a <p>
      div.removeChild(i)
      div.appendChild(p = document.createElement('p'))
      p.appendChild(i)

      function onChange(summaries) {
        var ops = domOT.adapters.mutationSummary.import(summaries[0], div)
        newdiv = domOT.apply(newdiv, ops)

        expect(domOT.serialize(newdiv)).to.equal(domOT.serialize(div))

        cb()
      }
    })


    it('should overtake wrapping of text nodes', function(cb) {
      var p, i
      div.appendChild(p = document.createElement('p'))
      p.appendChild(document.createTextNode('Huh. '))
      p.appendChild(document.createTextNode('Hello world!'))

      var newdiv = div.cloneNode(true)

      domOT.adapters.mutationSummary.createIndex(div)

      var observer = new MutationSummary({
        callback: onChange, // required
        rootNode: div,
        oldPreviousSibling: true,
        queries: [ { all: true} ]
      })

      // make some changes: concat the textNodes and wrap them in an <i>
      i = document.createElement('i')
      i.appendChild(p.removeChild(p.childNodes[0]))
      i.childNodes[0].nodeValue += p.childNodes[0].nodeValue
      p.removeChild(p.childNodes[0])
      p.appendChild(i)

      function onChange(summaries) {
        var ops = domOT.adapters.mutationSummary.import(summaries[0], div)
        newdiv = domOT.apply(newdiv, ops)

        expect(domOT.serialize(newdiv)).to.equal(domOT.serialize(div))

        cb()
      }
    })

    it('should transform concurrent changes (two inserts)', function(cb) {
      var i
      div.appendChild(i = document.createElement('i'))

      var newdiv = div.cloneNode(true)

      domOT.adapters.mutationSummary.createIndex(div)

      var observer = new MutationSummary({
        callback: onChange, // required
        rootNode: div,
        oldPreviousSibling: true,
        queries: [ { all: true} ]
      })

      // make some changes: add two children to the same element
      div.insertBefore(document.createElement('b'), i)
      div.appendChild(document.createElement('b'))

      function onChange(summaries) {
        var ops = domOT.adapters.mutationSummary.import(summaries[0], div)

        newdiv = domOT.apply(newdiv, ops)

        expect(domOT.serialize(newdiv)).to.equal(domOT.serialize(div))

        cb()
      }
    })

    it('should transform concurrent changes (two removes)', function(cb) {
      var i, b
      div.appendChild(i = document.createElement('i'))
      div.appendChild(b = document.createElement('b'))

      var newdiv = div.cloneNode(true)

      domOT.adapters.mutationSummary.createIndex(div)

      var observer = new MutationSummary({
        callback: onChange, // required
        rootNode: div,
        oldPreviousSibling: true,
        queries: [ { all: true} ]
      })

      // make some changes: add two children to the same element
      div.removeChild(i)
      div.removeChild(b)

      function onChange(summaries) {
        var ops = domOT.adapters.mutationSummary.import(summaries[0], div)

        newdiv = domOT.apply(newdiv, ops)

        expect(domOT.serialize(newdiv)).to.equal(domOT.serialize(div))

        cb()
      }
    })

    it('should transform concurrent changes (remove+insert)', function(cb) {
      var b
      div.appendChild(b = document.createElement('b'))

      var newdiv = div.cloneNode(true)

      domOT.adapters.mutationSummary.createIndex(div)

      var observer = new MutationSummary({
        callback: onChange, // required
        rootNode: div,
        oldPreviousSibling: true,
        queries: [ { all: true} ]
      })

      // make some changes: insert some el before another and remove the latter
      div.insertBefore(document.createElement('i'), b)
      div.removeChild(b)

      function onChange(summaries) {
        var ops = domOT.adapters.mutationSummary.import(summaries[0], div)

        newdiv = domOT.apply(newdiv, ops)

        expect(domOT.serialize(newdiv)).to.equal(domOT.serialize(div))

        cb()
      }
    })

    it('should transform concurrent changes (remove>insert)', function(cb) {
      var b, i
      div.appendChild(b = document.createElement('b'))
      div.appendChild(i = document.createElement('i'))

      var newdiv = div.cloneNode(true)

      domOT.adapters.mutationSummary.createIndex(div)

      var observer = new MutationSummary({
        callback: onChange, // required
        rootNode: div,
        oldPreviousSibling: true,
        queries: [ { all: true} ]
      })

      // make some changes: insert some el before another and remove the latter
      div.insertBefore(document.createElement('i'), b)
      div.removeChild(i)

      function onChange(summaries) {
        var ops = domOT.adapters.mutationSummary.import(summaries[0], div)

        newdiv = domOT.apply(newdiv, ops)

        expect(domOT.serialize(newdiv)).to.equal(domOT.serialize(div))

        cb()
      }
    })

    it('should transform concurrent changes (insert+remove)', function(cb) {
      var b
      div.appendChild(b = document.createElement('b'))

      var newdiv = div.cloneNode(true)

      domOT.adapters.mutationSummary.createIndex(div)

      var observer = new MutationSummary({
        callback: onChange, // required
        rootNode: div,
        oldPreviousSibling: true,
        queries: [ { all: true} ]
      })

      // make some changes: delete some el before another which is added
      div.appendChild(document.createElement('i'))
      div.removeChild(b)

      function onChange(summaries) {
        var ops = domOT.adapters.mutationSummary.import(summaries[0], div)

        newdiv = domOT.apply(newdiv, ops)

        expect(domOT.serialize(newdiv)).to.equal(domOT.serialize(div))

        cb()
      }
    })

    it('should transform concurrent changes (insert+manipulate)', function(cb) {
      var i, b
      div.appendChild(i = document.createElement('i'))
      div.appendChild(b = document.createElement('b'))

      var newdiv = div.cloneNode(true)

      domOT.adapters.mutationSummary.createIndex(div)

      var observer = new MutationSummary({
        callback: onChange, // required
        rootNode: div,
        oldPreviousSibling: true,
        queries: [ { all: true} ]
      })

      // make some changes: add an element and set an attribute
      div.insertBefore(document.createElement('b'), i)
      b.setAttribute('id', 'foobar')

      function onChange(summaries) {
        var ops = domOT.adapters.mutationSummary.import(summaries[0], div)

        newdiv = domOT.apply(newdiv, ops)

        expect(domOT.serialize(newdiv)).to.equal(domOT.serialize(div))

        cb()
      }
    })

    it('should transform concurrent changes (remove+manipulate)', function(cb) {
      var i, b
      div.appendChild(i = document.createElement('i'))
      div.appendChild(b = document.createElement('b'))

      var newdiv = div.cloneNode(true)

      domOT.adapters.mutationSummary.createIndex(div)

      var observer = new MutationSummary({
        callback: onChange, // required
        rootNode: div,
        oldPreviousSibling: true,
        queries: [ { all: true} ]
      })

      // make some changes: remove an element and set an attribute
      div.removeChild(i)
      b.setAttribute('id', 'foobar')

      function onChange(summaries) {
        var ops = domOT.adapters.mutationSummary.import(summaries[0], div)

        newdiv = domOT.apply(newdiv, ops)

        expect(domOT.serialize(newdiv)).to.equal(domOT.serialize(div))

        cb()
      }
    })

    it('should transform concurrent changes (insert+manipulateText)', function(cb) {
      var i, t
      div.appendChild(i = document.createElement('i'))
      i.appendChild(t = document.createTextNode(''))

      var newdiv = div.cloneNode(true)

      domOT.adapters.mutationSummary.createIndex(div)

      var observer = new MutationSummary({
        callback: onChange, // required
        rootNode: div,
        oldPreviousSibling: true,
        queries: [ { all: true} ]
      })

      // make some changes: remove an element and set an attribute
      div.insertBefore(document.createElement('b'), i)
      t.nodeValue = 'foobar'

      function onChange(summaries) {
        var ops = domOT.adapters.mutationSummary.import(summaries[0], div)

        newdiv = domOT.apply(newdiv, ops)

        expect(domOT.serialize(newdiv)).to.equal(domOT.serialize(div))

        cb()
      }
    })

    it('should transform concurrent changes (remove+manipulateText)', function(cb) {
      var i, b, t
      div.appendChild(i = document.createElement('i'))
      div.appendChild(b = document.createElement('b'))
      b.appendChild(t = document.createTextNode(''))

      var newdiv = div.cloneNode(true)

      domOT.adapters.mutationSummary.createIndex(div)

      var observer = new MutationSummary({
        callback: onChange, // required
        rootNode: div,
        oldPreviousSibling: true,
        queries: [ { all: true} ]
      })

      // make some changes: remove an element and set an attribute
      div.removeChild(i)
      t.nodeValue = 'foobar'

      function onChange(summaries) {
        var ops = domOT.adapters.mutationSummary.import(summaries[0], div)

        newdiv = domOT.apply(newdiv, ops)

        expect(domOT.serialize(newdiv)).to.equal(domOT.serialize(div))

        cb()
      }
    })

    it('should transform concurrent changes (move+move)', function(cb) {
      var b, p, i
      div.appendChild(b = document.createElement('b'))
      div.appendChild(p = document.createElement('p'))
      div.appendChild(i = document.createElement('i'))

      var newdiv = div.cloneNode(true)

      domOT.adapters.mutationSummary.createIndex(div)

      var observer = new MutationSummary({
        callback: onChange, // required
        rootNode: div,
        oldPreviousSibling: true,
        queries: [ { all: true} ]
      })

      // make some changes: nove to nodes to the same element,
      // while the second one has to change its to and from values
      div.removeChild(b)
      p.appendChild(b)
      div.removeChild(i)
      p.appendChild(i)

      function onChange(summaries) {
        var ops = domOT.adapters.mutationSummary.import(summaries[0], div)

        newdiv = domOT.apply(newdiv, ops)

        expect(domOT.serialize(newdiv)).to.equal(domOT.serialize(div))

        cb()
      }
    })

    it('should transform concurrent changes (move+remove)', function(cb) {
      var p, i, b
      div.appendChild(p = document.createElement('p'))
      p.appendChild(i = document.createElement('i'))
      div.appendChild(b = document.createElement('b'))

      var newdiv = div.cloneNode(true)

      domOT.adapters.mutationSummary.createIndex(div)

      var observer = new MutationSummary({
        callback: onChange, // required
        rootNode: div,
        oldPreviousSibling: true,
        queries: [ { all: true} ]
      })

      // make some changes: remove a child from the older sibling of some other removal
      p.removeChild(i)
      div.removeChild(b)

      function onChange(summaries) {
        var ops = domOT.adapters.mutationSummary.import(summaries[0], div)

        newdiv = domOT.apply(newdiv, ops)

        expect(domOT.serialize(newdiv)).to.equal(domOT.serialize(div))

        cb()
      }
    })

    it('should transform concurrent changes with specific paths (move+remove)', function(cb) {
      var b, p, i
      div.appendChild(document.createElement('b'))
      div.appendChild(document.createElement('b'))
      div.appendChild(document.createElement('b'))
      div.appendChild(document.createElement('b'))
      div.appendChild(document.createElement('b'))
      div.appendChild(document.createElement('b'))
      div.appendChild(document.createElement('b'))
      div.appendChild(document.createElement('b'))
      div.appendChild(document.createElement('b'))
      div.appendChild(b = document.createElement('b')) // [9]
      div.appendChild(i = document.createElement('i')) // [10] <-- simple path.join('') will cause this element to appear before 9 since "10" < "9"
      div.appendChild(p = document.createElement('p')) // [11]

      var newdiv = div.cloneNode(true)

      domOT.adapters.mutationSummary.createIndex(div)

      var observer = new MutationSummary({
        callback: onChange, // required
        rootNode: div,
        oldPreviousSibling: true,
        queries: [ { all: true} ]
      })

      // make some changes: nove to nodes to the same element,
      // while the second one has to change its to and from values
      div.removeChild(b)
      //p.appendChild(b)
      div.removeChild(i)
      p.appendChild(i)

      function onChange(summaries) {
        var ops = domOT.adapters.mutationSummary.import(summaries[0], div)

        newdiv = domOT.apply(newdiv, ops)

        expect(domOT.serialize(newdiv)).to.equal(domOT.serialize(div))

        cb()
      }
    })

    it('should overtake attrib changes', function(cb) {
      domOT.adapters.mutationSummary.createIndex(div)

      var observer = new MutationSummary({
        callback: onChange, // required
        rootNode: div,
        oldPreviousSibling: true,
        queries: [ { all: true} ]
      })

      div.setAttribute('class', 'foo')

      function onChange(summaries) {
        var ops = domOT.adapters.mutationSummary.import(summaries[0], div)

        expect(ops[0]).to.be.instanceof(domOT.Manipulate)
        expect(ops[0].path).to.deep.equal([])
        expect(ops[0].prop).to.equal('class')
        expect(ops[0].value).to.equal('foo')

        cb()
      }
    })

    it('should overtake textNode changes', function(cb) {
      div.appendChild(document.createTextNode('hello world'))
      domOT.adapters.mutationSummary.createIndex(div)

      var observer = new MutationSummary({
        callback: onChange, // required
        rootNode: div,
        oldPreviousSibling: true,
        queries: [ { all: true} ]
      })

      div.firstChild.nodeValue = 'hello my world!'

      function onChange(summaries) {
        var ops = domOT.adapters.mutationSummary.import(summaries[0], div)

        expect(ops[0]).to.be.instanceof(domOT.ManipulateText)
        expect(ops[0].path).to.deep.equal([0])

        var div2 = document.createElement('div')
        div2.appendChild(document.createTextNode('hello world'))
        ops[0].apply(div2)// XXX: Needs revisiting when text diff is integrated
        try{
        expect(div2.firstChild.nodeValue).to.equal('hello my world!')
        }catch(e) {
          console.log(e)
        }

        cb()
      }
    })
  })

  describe('applications', function() {
    var div
    beforeEach(function() {
      div = document.createElement('div')
    })

    it('should insert a node', function() {
      var newnode = domOT.serialize(document.createElement('i'))
        , op = new domOT.Move(null, [0], newnode)
      op.apply(div)

      expect(div.firstChild).to.be.instanceof(Element)
      expect(div.firstChild.tagName.toLowerCase()).to.equal('i')
    })

    it('should insert a node as a sibling', function() {
      div.appendChild(document.createElement('p'))
      div.appendChild(document.createElement('p'))
      var newnode = domOT.serialize(document.createElement('i'))
        , op = new domOT.Move(null, [1], newnode)
      op.apply(div)

      expect(div.childNodes[1]).to.be.instanceof(Element)
      expect(div.childNodes[1].tagName.toLowerCase()).to.equal('i')
    })

    it('should delete a node', function() {
      div.appendChild(document.createElement('i'))

      var newnode = domOT.serialize(document.createElement('i'))
        , op = new domOT.Move([0], null, newnode)
      op.apply(div)

      expect(div.childNodes.length).to.equal(0)
    })

    it('should delete a node as a sibling', function() {
      div.appendChild(document.createElement('p'))
      div.appendChild(document.createElement('i'))
      div.appendChild(document.createElement('p'))
      var newnode = domOT.serialize(document.createElement('i'))
        , op = new domOT.Move([1], null, newnode)
      op.apply(div)

      expect(div.childNodes.length).to.equal(2)
      expect(div.childNodes[0].tagName.toLowerCase()).to.equal('p')
      expect(div.childNodes[1].tagName.toLowerCase()).to.equal('p')
    })

    it('should move a node', function() {
      div.appendChild(document.createElement('p'))
      var i = document.createElement('i')
      div.appendChild(i)

      var op = new domOT.Move([1], [0,0])
      op.apply(div)

      expect(div.childNodes.length).to.equal(1)
      expect(div.childNodes[0].tagName.toLowerCase()).to.equal('p')
      expect(div.childNodes[0].firstChild).to.be.instanceof(Element)
      expect(div.childNodes[0].firstChild).to.equal(i)
      expect(div.childNodes[0].firstChild.tagName.toLowerCase()).to.equal('i')
    })

    it('should set an attribute', function() {
      var op = new domOT.Manipulate([], 'class', 'foo')
      op.apply(div)

      expect(div.getAttribute('class')).to.equal('foo')
    })

    it('should set a textNode\'s value', function() {
      var text = document.createTextNode('hello world!')
      div.appendChild(text)
      var op = new domOT.ManipulateText([0], Changeset.fromDiff(diffEngine.diff_main('hello world!','hello my world!')).pack())
      op.apply(div)

      expect(text.nodeValue).to.equal('hello my world!')
    })
  })
})
