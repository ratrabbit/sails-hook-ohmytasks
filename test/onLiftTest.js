var Sails = require('sails').Sails;
const path = require('path');
const sinon = require('sinon');
const should = require('should');
 describe('Lift Test ::', function() {

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
               spy();
             },
             before: function(sails, cb){
               return cb();
             },
             after: function(sails, cb){
               return cb();
             },
             toDo: [],
           },
           log: {level: "error"}
         },function (err, _sails) {
           if (err) return done(err);
           sails = _sails;
           spy.calledOnce.should.be.true();
           return done();
         });
     });
     after(function (done) {
         if (sails) {
             return sails.lower(done);
         }
         return done();
     });

     // Test that Sails can lift with the hook in place
     it ('sails does not crash', function() {
         return true;
     });

 });
