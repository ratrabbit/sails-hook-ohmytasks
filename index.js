const include = require('include-all');
const async = require('async');
const path = require('path').resolve;
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

    initialize: function(cb){
      sails.on('lifted', sails.config.ohmytasks.onLift);
      var tasks = include({
        dirname: path(sails.config.paths.config, '../', sails.config.ohmytasks.dirname),
        filter: /(.+)\.js$/,
        excludeDirs: /^\.(git|svn)$/,
        depth: 1
      });
      sails.config.bootstrap = function(callback){
        sails.config.ohmytasks.before(sails,function(err){
          if(err){
            return callback(err);
          }
          async.each(sails.config.ohmytasks.toDo, function(item,cbeach){
            //tasks[task](sails,cbeach);
            if(!item.order){
              async.each(item.tasks, function(task,cbtask){
                tasks[task](sails,cbtask);
              },cbeach);
              return;
            }
            var wfaux = [function(cbwf){
              return cbwf(null,sails);
            }];
            item.tasks.map(function(task){
              wfaux.push(tasks[task]);
            });
            async.waterfall(wfaux,cbeach);
          },function(err){
            if(err){
              return callback(err);
            }
            sails.config.ohmytasks.after(sails, callback);
          });
        });
      }
      return cb();
    }
  };
}
