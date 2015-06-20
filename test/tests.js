var chai = require('chai')
  , should = chai.should()
  , expect = chai.expect
  , domOT = require('../')
  , MutationSummary = require('./lib/mutation-summary')

describe('dom-ot', function() {
  describe('transformations', function() {
    it('should transform `Move#from` correctly for siblings removed', function() {
      var move1 = new domOT.Move([0,1], null)
        , move2 = new domOT.Move([0,0], null)
      move1.transformAgainst(move2)
      move1.from.should.deep.equal([0,0])
    })
    
    it('should transform `Move#from` correctly for siblings removed', function() {
      var move1 = new domOT.Move([0,0], null)
        , move2 = new domOT.Move([0,1], null)
      move1.transformAgainst(move2)
      move1.from.should.deep.equal([0,0])
    })
    
    it('should transform `Move#from` correctly for siblings added', function() {
      var move1 = new domOT.Move([0,0], null)
        , move2 = new domOT.Move(null, [0,0])
      move1.transformAgainst(move2)
      move1.from.should.deep.equal([0,1])
    })
    
    it('should transform `Move#from` correctly for siblings added', function() {
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
    
    it('should transform `Move#from` correctly for node moved', function() {
      var move1 = new domOT.Move([0,1], null)
        , move2 = new domOT.Move([0,1], [1,1])
      move1.transformAgainst(move2)
      move1.from.should.deep.equal([1,1])
    })
    
    it('should transform `Move#to` correctly for siblings removed', function() {
      var move1 = new domOT.Move(null, [0,1])
        , move2 = new domOT.Move([0,0], null)
      move1.transformAgainst(move2)
      move1.to.should.deep.equal([0,0])
    })
    
    it('should transform `Move#to` correctly for siblings removed', function() {
      var move1 = new domOT.Move(null, [0,1])
        , move2 = new domOT.Move([0,2], null)
      move1.transformAgainst(move2)
      move1.to.should.deep.equal([0,1])
    })
    
    it('should transform `Move#to` correctly for siblings added', function() {
      var move1 = new domOT.Move(null, [0,1])
        , move2 = new domOT.Move(null, [0,0])
      move1.transformAgainst(move2)
      move1.to.should.deep.equal([0,2])
    })
    
    it('should transform `Move#to` correctly for siblings added', function() {
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
    
    it('should transform `Move#to` correctly for node moved', function() {
      var move1 = new domOT.Move(null, [0,0])
        , move2 = new domOT.Move([0,0], [1,0])
      move1.transformAgainst(move2)
      move1.to.should.deep.equal([0,0])
    })
    
    it('should transform `Manipulate#path` correctly for siblings removed', function() {
      var manipulate = new domOT.Manipulate([0,1], 'data-attrib', 'value')
        , move2 = new domOT.Move([0,0], null)
      manipulate.transformAgainst(move2)
      manipulate.path.should.deep.equal([0,0])
    })
    
    it('should transform `Manipulate#path` correctly for siblings removed', function() {
      var manipulate = new domOT.Manipulate([0,0], 'data-attrib', 'value')
        , move2 = new domOT.Move([0,1], null)
      manipulate.transformAgainst(move2)
      manipulate.path.should.deep.equal([0,0])
    })
    
    it('should transform `Manipulate#path` correctly for siblings added', function() {
      var manipulate = new domOT.Manipulate([0,0], 'data-attrib', 'value')
        , move2 = new domOT.Move(null, [0,0])
      manipulate.transformAgainst(move2)
      manipulate.path.should.deep.equal([0,1])
    })
    
    it('should transform `Manipulate#path` correctly for siblings added', function() {
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
  })
  
  describe('mutationSummary adapter', function() {
    var div
    beforeEach(function() {
      div = document.createElement('div')
    })
    
    it('should overtake inserts', function(cb) {
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
        ops[0].apply(div2)
        expect(div2.firstChild.nodeValue).to.equal('hello my world!')

        cb()
      }
    })
  })
})