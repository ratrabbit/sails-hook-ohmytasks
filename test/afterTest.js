var Sails = require('sails').Sails;
const path = require('path');
const sinon = require('sinon');
const should = require('should');
const Promise = require('bluebird');

 describe('After Test ::', function() {

     var sails;
     before(function (done) {

         this.timeout(40000);
         const spy = sinon.spy();
         Sails().lift({
           hooks: {
             "sails-hook-ohmytasks": require('../'),
             "grunt": false
           },
           ohmytasks: {
             onLift: function () {
             },
             before: function(sails){
               return Promise.resolve();
             },
             after: function(sails, cb){
               spy(sails);
               return cb();
             },
             toDo: [],
           },
           log: {level: "error"}
         },function (err, _sails) {
           if (err) return done(err);
           sails = _sails;

           spy.calledWith(sails).should.be.true();
           return done();
         });
     });
     after(function (done) {
         if (sails) {
             return sails.lower(done);
         }
         return done();
     });
     it ('sails does not crash', function() {
         return true;
     });

 });
