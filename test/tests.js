var chai = require('chai')
  , should = chai.should()
  , expect = chai.expect
  , domOT = require('../')
  , MutationSummary = require('mutation-summary')

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
        expect(div2.firstChild.nodeValue).to.equal('hello my world!')

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
      var op = new domOT.Move(null, [0], '<i></i>')
      op.apply(div)
      
      expect(div.firstChild).to.be.instanceof(Element)
      expect(div.firstChild.tagName.toLowerCase()).to.equal('i')
    })
    
    it('should insert a node as a sibling', function() {
      div.appendChild(document.createElement('p'))
      div.appendChild(document.createElement('p'))
      var op = new domOT.Move(null, [1], '<i></i>')
      op.apply(div)
      
      expect(div.childNodes[1]).to.be.instanceof(Element)
      expect(div.childNodes[1].tagName.toLowerCase()).to.equal('i')
    })
    
    it('should delete a node', function() {
      div.appendChild(document.createElement('i'))
    
      var op = new domOT.Move([0], null, '<i></i>')
      op.apply(div)
      
      expect(div.childNodes.length).to.equal(0)
    })
    
    it('should delete a node as a sibling', function() {
      div.appendChild(document.createElement('p'))
      div.appendChild(document.createElement('i'))
      div.appendChild(document.createElement('p'))
      var op = new domOT.Move([1], null, '<i></i>')
      op.apply(div)
      
      expect(div.childNodes.length).to.equal(2)
      expect(div.childNodes[0].tagName.toLowerCase()).to.equal('p')
      expect(div.childNodes[1].tagName.toLowerCase()).to.equal('p')
    })
    
    it('should move a node', function() {
      div.appendChild(document.createElement('p'))
      div.appendChild(document.createElement('i'))
      
      var op = new domOT.Move([1], [0,0], '<i></i>')
      op.apply(div)
      
      expect(div.childNodes.length).to.equal(1)
      expect(div.childNodes[0].tagName.toLowerCase()).to.equal('p')
      expect(div.childNodes[0].firstChild).to.be.instanceof(Element)
      expect(div.childNodes[0].firstChild.tagName.toLowerCase()).to.equal('i')
    })
    
    it('should move a node', function() {
      div.appendChild(document.createElement('p'))
      var i = document.createElement('i')
      div.appendChild(i)
      
      var op = new domOT.Move([1], [0,0], '<i></i>')
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
      var op = new domOT.ManipulateText([0], 'hello my world!') // XXX: Needs revisiting when text diff is integrated
      op.apply(div)
      
      expect(text.nodeValue).to.equal('hello my world!')
    })
  })
})