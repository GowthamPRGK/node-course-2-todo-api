var env = process.env.NODE_ENV || 'development';

if(env ==='development'){
    process.env.PORT=3000;
    process.env.MONGODB_URI = 'mongodb://localhost:27017/TodoApp';
}else if(env ==='test'){
    process.env.PORT = 3000;
    process.env.MONGODB_URI = 'mongodb://localhost:27017/TodoAppTest';
}

const _ = require('lodash');
const {ObjectID} = require('mongodb')
var express = require('express');
var bodyParser = require('body-parser');

var {mongoose} = require('./db/mongoose');
var {Todo}=require('./models/todo');
var {User}=require('./models/user');

var app = express();
const port = process.env.PORT;

app.use(bodyParser.json());

app.post('/todos',(req,res)=>{
    var todo = new Todo({
        text: req.body.text
    });
    todo.save().then((doc)=>{
        res.send(doc);
    },(e)=>{
        res.status(400).send(e);
    });
});
app.get('/todos',(req,res)=>{ 
    Todo.find().then((todos)=>{
        res.send({todos});
    },(e)=>{
        res.status(400).send(e);
    });
});

app.get('/todos/:id',(req,res)=>{
    var id = req.params.id;
    if(!ObjectID.isValid(id)){
        return res.status(404).send('Not a valid ID')
    }
    Todo.findById(id).then((todo)=>{
        if(!todo){
            return res.status(404).send('No data found');
        }
        res.send({todo});
    }).catch((e)=>{
        res.status(400).send('Yedhuku');
    });
    
});

app.delete('/todos/:id',(req,res)=>{
    var id = req.params.id;
    if(!ObjectID.isValid(id)){
        return res.status(404).send('INvalidd ID');
    }
    Todo.findByIdAndRemove(id).then((docs)=>{
        if(!docs){
            return res.status(404).send('No data found')
        }
        res.send({docs});
    }).catch((e)=>{
        
        res.status(404).send('');
    });
});

app.patch('/todos/:id',(req,res)=>{
    var id = req.params.id;
    var body = _.pick(req.body,['text','completed']);
    if(!ObjectID.isValid(id)){
        return res.status(404).send('INvalidd ID');
    }
    if(_.isBoolean(body.completed) && body.completed){
        body.completedAt = new Date().getTime();
    }else{
        body.completed = false;
        body.completedAt = null;
    }
    Todo.findByIdAndUpdate(id,{$set: body},{new: true}).then((todo)=>{
        if(!todo){
            return res.status(404).send('No data found');
        }
        res.send({todo});
    }).catch((e)=>{
        res.status(400).send('Yedhuku');
    });
});

app.listen(port,()=>{
    console.log(`Started up at port ${port}`);
    
});

module.exports={app};