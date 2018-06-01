const include = require('include-all');
const async = require('async');
const path = require('path').resolve;
const Promise = require('bluebird');

module.exports = function(sails){
  return {
    defaults : {
      ohmytasks: {
        order: [],
        before: function(sails, next){
          return next();
        },
        onLift: function(){
          return;
        },
        after: function(sails, next){
          return next();
        },
        dirname: 'test/ohmytasks'
      },

    },

    //initialize: function(cb){
    //  sails.on('lifted', sails.config.ohmytasks.onLift);
    //  var tasks = include({
    //    dirname: path(sails.config.paths.config, '../', sails.config.ohmytasks.dirname),
    //    filter: /(.+)\.js$/,
    //    excludeDirs: /^\.(git|svn)$/,
    //    depth: 1
    //  });
    //  sails.config.bootstrap = function(callback){
    //    sails.config.ohmytasks.before(sails,function(err){
    //      if(err){
    //        return callback(err);
    //      }
    //      async.each(sails.config.ohmytasks.toDo, function(item,cbeach){
    //        //tasks[task](sails,cbeach);
    //        if(!item.order){
    //          async.each(item.tasks, function(task,cbtask){
    //            tasks[task](sails,cbtask);
    //          },cbeach);
    //          return;
    //        }
    //        var wfaux = [function(cbwf){
    //          return cbwf(null,sails);
    //        }];
    //        item.tasks.map(function(task){
    //          wfaux.push(tasks[task]);
    //        });
    //        async.waterfall(wfaux,cbeach);
    //      },function(err){
    //        if(err){
    //          return callback(err);
    //        }
    //        sails.config.ohmytasks.after(sails, callback);
    //      });
    //    });
    //  }
    //  return cb();
    //}

    initialize: function(cb){
      sails.on('lifted', sails.config.ohmytasks.onLift);
      var tasks = include({
        dirname: path(sails.config.paths.config, '../', sails.config.ohmytasks.dirname),
        filter: /(.+)\.js$/,
        excludeDirs: /^\.(git|svn)$/,
        depth: 1
      });

      sails.config.bootstrap = function(callback){
        return sails.config.ohmytasks.before(sails)
        .then(() => {
          let fullTask = new Promise(function(resolve) {
            return resolve([sails]);
          });
          const asyncTasks = [];
          return Promise.each(sails.config.ohmytasks.toDo, function (item) {
            return Promise.each(item.tasks, function (task) {
              if (!item.order) {
                asyncTasks.push(new Promise(function(resolve) {
                  return resolve(tasks[task]([sails]));
                }));
              } else {
                fullTask = fullTask.then((listArgs) => {
                  return tasks[task](listArgs);
                });
              }
            });
          })
          .then(() => {
            return Promise.all(asyncTasks);
          })
          .then(() => {
            return fullTask;
          })
          .catch((err) => {
            console.log(err);
            throw err;
          })
          .then(() => {
            return sails.config.ohmytasks.after(sails, callback);
          })
        })
        .catch((err) => {
          return callback(err);
        })
      }
      return cb();
    }
  };
}
