const {mongoose}= require('./../server/db/mongoose');
const {ObjectID} = require('mongodb');

const {Todo} = require('./../server/models/todo');
console.log('hello');

Todo.remove({}).then((result)=>{
    console.log(result);    
});