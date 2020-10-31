/* eslint handle-callback-err: "off"*/

process.env.NODE_ENV = 'test'

const Transaction = require('../app/models/transaction')
const faker = require('faker')
const chai = require('chai')
const chaiHttp = require('chai-http')
const server = require('../server')
// eslint-disable-next-line no-unused-vars
const should = chai.should()

chai.use(chaiHttp)

let newObj = {
  srcCurrency: 'cusd',
  destCurrency: 'ngn',
  srcAmount: 100,
  bankCode: '005',
  bankName: 'Stanbic IBTC',
  bankAccountNumber: '0000111447'
}

let newTrxId = ''

describe('*********** TRANSACTION ***********', () => {
  describe('/POST transaction', () => {
    it('it should create a new transaction', (done) => {
      chai
        .request(server)
        .post('/transactions')
        .send(newObj)
        .end((err, res) => {
          res.should.have.status(201)
          res.body.should.be.an('object')
          res.body.status.should.be.a('string').eql('pending')
          done()
        })
    })
  })
})
