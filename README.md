[![forthebadge](http://forthebadge.com/images/badges/built-by-codebabes.svg)](https://jaque.me/)

[![DevDependencies](https://david-dm.org/ratrabbit/sails-hook-ohmytasks/dev-status.svg)](https://david-dm.org/ratrabbit/sails-hook-ohmytasks)
[![GitHub version](https://badge.fury.io/gh/ratrabbit%2Fsails-hook-ohmytasks.svg)](https://badge.fury.io/gh/ratrabbit%2Fsails-hook-ohmytasks)
[![npm](https://img.shields.io/npm/dw/ohmytasks.svg)](https://www.npmjs.com/package/sails-hook-ohmytasks)
[![Github All Releases](https://img.shields.io/github/downloads/ratrabbit/sails-hook-ohmytasks/total.svg?style=flat-square)](https://github.com/ratrabbit/sails-hook-ohmytasks)

# sails-hook-ohmytasks
Hook for running tasks before lift

In `config/ohmytasks.js`
```js
{
  toDo: [], //this is a list of tasks to be executed

  before: function(sails, next){
  },
  //function to be executed before task execution

  onLift: function(){
  },
  //function to execute on lifted event

  after: function(sails, next){
  },
  //function to be executed after task execution

  dirname: 'folder-with-tasks'
  //defaults to ohmytasks, place this dir under root folder
}
```
toDo expects a list of JSON's like this
```js
{
  tasks: ['name-of-task']
}
```
 to be executed asynchronously or if tasks need to be executed in order:
```js
{
  tasks: ['task1', 'task2', ...],
  order: true
}
```
the tasks are executed in the order specified in the list, and pass arguments to next task.

The name of each task refers to a file inside the folder specified in the config, each file should have the following structure:
```js
module.exports = function(sails, arg1, arg2, callback){

  //task code
  // return callback(err, sails, other-args);
  // or
  // return callback(err); if order was not specified
}
```  

## Example
In `config/ohmytasks.js`
```js
module.exports.ohmytasks = {

  toDo: [
    {
      tasks: ['task1']
    },
    {
      tasks: ['task2', 'task3'],
      order: true
    }
  ],

  before: function(sails, cb){
    console.log("----------- Loading config -----------\n");
    return cb();
  },

  onLift: function(){
    console.log("----------- Lift -----------\n");
  },

  after: function(sails, cb){
    console.log("----------- Done -----------\n");
    return cb();
  },

  dirname: 'ohmytasks'

}
```

with tasks definitions:

`ohmytasks/task1.js`

```js
module.exports = function(sails, next){
  console.log("async task");
  return next();
};
```
`ohmytasks/task2.js`

```js
module.exports = function(sails, next){
  console.log("first task");
  return next(null, sails, "foo");
};
```

`ohmytasks/task3.js`

```js
module.exports = function(sails, text, next){
  console.log("second task");
  console.log(text)
  return next(new Error("i don't wanna lift"));
};
```

The output will be something like:

```plain
  ----------- Loading config -----------
  first task
  async task
  second task
  foo

  // error description
  i don't wanna lift
```

Since `task2.js` returns an error, sails won't lift and will throw the error.

## Notes
- This hook overrides `sails.config.bootstrap` so any logic there must be in one task or in before and after function definitions.
- Only tasks inside the dirname folder will be loaded, other folders inside dirname will be ignored.
