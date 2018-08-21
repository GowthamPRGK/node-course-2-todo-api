const {ObjectID} = require('mongodb');
const {Todo} = require('./../../models/todo');
const {User} = require('./../../models/user');
const jwt = require('jsonwebtoken');
const userOneId = new ObjectID();
const userTwoId = new ObjectID();

const users = [{
    _id: userOneId,
    email: 'gowthamkarnan.prg@gmail.com',
    password: 'userOnePass',
    tokens:[{
        access: 'auth',
        token: jwt.sign({_id:userOneId,access: 'auth'},'abc123').toString()

    }]
},{
    _id:userTwoId,
    email:'gowthamkongu@gmail.com',
    password:'userTwoPass'
}]

const todos = [{
    _id: new ObjectID(),
    text:'Text number 1'
},{
    _id: new ObjectID(),
    text:'Text number 2',
    completed: true,
    completedAt: 3330
}];

const populateTodos = function(done){
    this.timeout(15000);
    Todo.remove({}).then(()=>{
        return Todo.insertMany(todos);
    }).then(()=> done());
};
const populateUsers = function(done){
    this.timeout(15000);
    User.remove({}).then(()=>{
        var userOne = new User(users[0]).save();
        var userTwo = new User(users[1]).save();
        return Promise.all([userOne,userTwo])
    }).then(()=>done());
}

module.exports = {todos,populateTodos,users,populateUsers};