var Sails = require('sails').Sails;
const path = require('path');
const sinon = require('sinon');
const should = require('should');
 describe('Basic tests ::', function() {

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
               console.log("HELLO, IM UP");
             },
             before: function(sails, cb){
               console.log("BEFORE");
               return cb();
             },
             after: function(sails, cb){
               spy(sails);
               console.log("AFTER");
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
