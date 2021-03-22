/* eslint handle-callback-err: "off"*/

process.env.NODE_ENV = 'test'

// const Transaction = require('../app/models/transaction')
// const faker = require('faker')
const chai = require('chai')
const chaiHttp = require('chai-http')
const server = require('../server')
// eslint-disable-next-line no-unused-vars
const should = chai.should()

chai.use(chaiHttp)

// let newObj = {
//   srcCurrency: 'cusd',
//   destCurrency: 'ngn',
//   srcAmount: 100,
//   bankCode: '005',
//   bankName: 'Stanbic IBTC',
//   bankAccountNumber: '0000111447'
// }
const txObj = {
  srcCurrency: 'ghs',
  destCurrency: 'celo',
  srcAmount: '5000',
  currencyPair: 'usdghs',
  country: 'Ghana'
}
// let transactionId = ''

describe('*********** TRANSACTION ***********', () => {
  describe('/POST transaction', () => {
    it('it should create a new transaction', (done) => {
      chai
        .request(server)
        .post('/transactions')
        .send(txObj)
        .end((err, res) => {
          res.should.have.status(201)
          // res.body.should.be.an('string')
          res.body.txData.srcCurrency.should.be.eql('ghs')
          res.body.txData.destCurrency.should.be.eql('celo')
          res.body.txData.srcAmount.should.be.eql(5000)
          res.body.txData.currencyPair.should.be.eql('celoghs')
          res.body.txData.country.should.be.eql('Ghana')

          // res.body.name.should.be.a('string').eql('usdghs')

          //   res.body.status.should.be.a('string').eql('pending')
          //   transactionId = res.body._id
          done()
        })
    })
    // it('it should not create a new transaction without key value', (done) => {
    //   delete newObj.srcCurrency
    //   chai
    //     .request(server)
    //     .post('/transactions')
    //     .send(newObj)
    //     .end((err, res) => {
    //       res.should.have.status(422)
    //       res.body.should.be.a('object')
    //       res.body.should.have.property('errors')
    //       done()
    //     })
    // })
  })
  //   describe('/GET/:id transaction', () => {
  //     it('it should GET a transaction by the given id', (done) => {
  //       chai
  //         .request(server)
  //         .get(`/transactions/${transactionId}`)
  //         .end((error, res) => {
  //           res.should.have.status(200)
  //           res.body.should.be.a('object')
  //           res.body.should.have.property('status')
  //           res.body.should.have.property('_id').eql(transactionId)
  //           done()
  //         })
  //     })

  //     it('it should not GET a transaction due to bad id', (done) => {
  //       chai
  //         .request(server)
  //         .get(`/transactions/${transactionId}tkrlwkwmkakjs`)
  //         .end((error, res) => {
  //           res.should.have.status(422)
  //           res.body.should.be.a('object')
  //           res.body.should.have.property('errors')
  //           res.body.errors.should.have.property('msg').eql('ID_MALFORMED')
  //           done()
  //         })
  //     })
  //   })
  //   describe('/GET confirm/:id transaction', () => {
  //     it('it should CONFIRM a transaction by the given id', (done) => {
  //       chai
  //         .request(server)
  //         .get(`/transactions/confirm/${transactionId}`)
  //         .end((error, res) => {
  //           res.should.have.status(200)
  //           res.body.should.be.a('object')
  //           res.body.should.have.property('status').eql('processing')
  //           res.body.should.have.property('_id').eql(transactionId)
  //           done()
  //         })
  //     })

  //     it('it should not CONFIRM transaction because it has been confirmed already', (done) => {
  //       chai
  //         .request(server)
  //         .get(`/transactions/confirm/${transactionId}`)
  //         .end((error, res) => {
  //           res.should.have.status(400)
  //           res.body.should.be.a('object')
  //           res.body.should.have.property('errors')
  //           res.body.errors.should.have.property('msg').eql('IN_PROCESS')
  //           done()
  //         })
  //     })

  //     it('it should not CONFIRM a transaction due to bad id', (done) => {
  //       chai
  //         .request(server)
  //         .get(`/transactions/${transactionId}tkrlwkwmkakjs`)
  //         .end((error, res) => {
  //           res.should.have.status(422)
  //           res.body.should.be.a('object')
  //           res.body.should.have.property('errors')
  //           res.body.errors.should.have.property('msg').eql('ID_MALFORMED')
  //           done()
  //         })
  //     })
  //   })

  //   after(() => {
  //     Transaction.findByIdAndRemove(transactionId, (err) => {
  //       if (err) {
  //         console.log(err)
  //       }
  //     })
  //   })
})
