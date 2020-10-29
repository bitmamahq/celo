/* eslint handle-callback-err: "off"*/

process.env.NODE_ENV = 'test'

const Rate = require('../app/models/rate')
const faker = require('faker')
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
})
