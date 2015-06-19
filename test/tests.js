var chai = require('chai')
  , should = chai.should()
  , domOT = require('../')

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
  })
})