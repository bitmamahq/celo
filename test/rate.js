/* eslint handle-callback-err: "off"*/

process.env.NODE_ENV = 'test'

// const Rate = require('../app/models/rate')
// const faker = require('faker')
const chai = require('chai')
const chaiHttp = require('chai-http')
const server = require('../server')
// eslint-disable-next-line no-unused-vars
const should = chai.should()

chai.use(chaiHttp)

describe('*********** RATE ***********', () => {
  describe('/GET rates', () => {
    it('it should GET all the rates', (done) => {
      chai
        .request(server)
        .get('/rates')
        .end((err, res) => {
          res.should.have.status(200)
          res.body.should.be.an('object')
          res.body.docs.should.be.a('array')
          done()
        })
    })
  })

  describe('/GET/:peer rate', () => {
    it('it should GET a rate by the given peer', (done) => {
      const realPeer = 'usdngn'
      // const fakePeer = 'myname'
      chai
        .request(server)
        .get(`/rates/${realPeer}`)
        .end((error, res) => {
          res.should.have.status(200)
          res.body.should.be.a('object')
          res.body.should.have.property('msg')
          res.body.msg.should.have.property('ticker').eql(realPeer)
          res.body.msg.should.have.property('name').eql('ngnCusdBuyRate')
          res.body.msg.should.have.property('rate')
          done()
        })
    })

    it('it should not GET a rate for the given peer', (done) => {
      const fakePeer = 'myname'
      chai
        .request(server)
        .get(`/rates/${fakePeer}`)
        .end((error, res) => {
          res.should.have.status(400)
          res.body.should.be.a('object')
          res.body.should.have.property('errors')
          res.body.errors.should.have.property('msg')
          done()
        })
    })
  })
})
