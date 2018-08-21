const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');
const {User} = require('./../models/user');

const {app} = require('../server');
const {Todo} = require('../models/todo');
const {todos,populateTodos,users,populateUsers} = require('./seed/seed');

beforeEach(populateUsers);
beforeEach(populateTodos);

setTimeout(()=>{
    console.log('hrllo');
    
},(3000));
describe('POST /todos',()=>{
    
    it('should create a  new todo',(done)=>{
        var text = 'PRGs engineer';

        request(app)
        .post('/todos')
        .set('x-auth',users[0].tokens[0].token)
        .send({text})
        .expect(200)
        .expect((res)=>{
            expect(res.body.text).toBe(text);
        })
        .end((err,res)=>{
            if(err){
                return done(err);
            }
            
            Todo.find({text}).then((todos)=>{
                expect(todos.length).toBe(1);
                expect(todos[0].text).toBe(text);
                done();
            }).catch((e)=>done(e));
        });
    });
    it('Should not create a object for invalid data',(done)=>{
        var text = "";
        request(app)
        .post('/todos')
        .set('x-auth',users[0].tokens[0].token)
        .send({text})
        .expect(400)
        .end((err,res)=>{
            if(err){
                return done(err);
            }
            Todo.find().then((todos)=>{
                expect(todos.length).toBe(2);
                done();
            }).catch((e)=>done(e));
        });
    });
    it('should return the objects using the get method',(done)=>{
        request(app)
        .get('/todos')
        .expect(200)
        .set('x-auth',users[0].tokens[0].token)
        .expect((res)=>{
            expect(res.body.todos.length).toBe(1);
        })
        .end(done);
    });
});
describe('GET /todos',()=>{
    it('should return all the todos of the user',(done)=>{
        request(app)
        .get('/todos')
        .set('x-auth',users[0].tokens[0].token)
        .expect(200)
        .expect((res)=>{
            expect(res.body.todos.length).toBe(1);
        })
        .end(done);
    });
})
describe('GET /todos/:id', () => {
    it('should return todo doc', (done) => {
        
      request(app)
        .get(`/todos/${todos[0]._id.toHexString()}`)
        .set('x-auth',users[0].tokens[0].token)
        .expect(200)
        .expect((res) => {
            
          expect(res.body.todo.text).toBe(todos[0].text);
        })
        .end(done);
    });
    it('should not return todo doc crated by other user', (done) => {
        
        request(app)
          .get(`/todos/${todos[1]._id.toHexString()}`)
          .set('x-auth',users[0].tokens[0].token)
          .expect(404)
          .end(done);
      });
    it(' Should return 404 if todo not found',(done)=>{
        request(app)
        .get('/todos/5b729e57b927fa4470be7b67')
        .set('x-auth',users[0].tokens[0].token)
        .expect(404)
        .end(done);
    });
    it(' Should return 404 if todo not found',(done)=>{
        request(app)
        .get('/todos/123')
        .set('x-auth',users[0].tokens[0].token)
        .expect(404)
        .end(done);
    });
});

describe('DELETE /todos/is',()=>{
    it('should remove a todo',(done)=>{
        request(app)
        .delete(`/todos/${todos[1]._id.toHexString()}`)
        .set('x-auth',users[1].tokens[0].token)
        .expect(200)
        .expect((res) => {
            
          expect(res.body.docs.text).toBe(todos[1].text);
        })
        .end(done);
    });
    it('should not remove a todo created by other users',(done)=>{
        var hexId = todos[0]._id.toHexString();
        request(app)
        .delete(`/todos/${hexId}`)
        .set('x-auth',users[1].tokens[0].token)
        .expect(404)
        .end((err,res)=>{
            if(err){
                return done(err)
            }
            Todo.findById(hexId).then((todo)=>{
                expect(todo).toExist();
                done();
            }).catch((e)=>done(e));
        });
    });
    it(' Should return 404 if todo not found',(done)=>{
        request(app)
        .delete('/todos/5b729e57b927fa4470be7b67')
        .set('x-auth',users[1].tokens[0].token)
        .expect(404)
        .end(done);
    });
    it(' Should return 404 if todo id is not valid',(done)=>{
        request(app)
        .delete('/todos/123')
        .set('x-auth',users[1].tokens[0].token)
        .expect(404)
        .end(done);
    });
});
describe('PATCH /todos/:id',()=>{
    it('Should update the todo',(done)=>{
        var ch = {
            text:"Hello World",
            completed:true
        };
        request(app)
        .patch(`/todos/${todos[1]._id.toHexString()}`)
        .set('x-auth',users[1].tokens[0].token)
        .send(ch)
        .expect(200)
        .expect((res)=>{
            expect(res.body.todo.text).toBe(ch.text);
            expect(res.body.todo.completed).toBeA('boolean').toBe(true);
            expect(res.body.todo.completedAt).toBeA('number');
        })
        .end(done);        
    });
    it('Should not update the todo created by other users',(done)=>{
        var ch = {
            text:"Hello World",
            completed:true
        };
        request(app)
        .patch(`/todos/${todos[1]._id.toHexString()}`)
        .set('x-auth',users[0].tokens[0].token)
        .send(ch)
        .expect(404)
        .end(done);        
    });
    it('Should update the todo',(done)=>{
        var ch = {
            text:"Hello World",
            completed:false
        };
        request(app)
        .patch(`/todos/${todos[0]._id.toHexString()}`)
        .set('x-auth',users[0].tokens[0].token)
        .send(ch)
        .expect(200)
        .expect((res)=>{
            expect(res.body.todo.text).toBe(ch.text);
            expect(res.body.todo.completed).toBeA('boolean').toBe(false);
            expect(res.body.todo.completedAt).toNotExist();
        })
        .end(done);        
    });
});



describe('GET /users/me',()=>{
    it('Should return the user is the authenicaion is successful',(done)=>{
        request(app)
        .get('/users/me')
        .set('x-auth',users[0].tokens[0].token)
        .expect(200)
        .expect((res)=>{
            expect(res.body._id).toBe(users[0]._id.toHexString());
            expect(res.body.email).toBe(users[0].email);
        })
        .end(done);
    });
    it('should return 401 if failed authentication',(done)=>{
        request(app)
        .get('/users/me')
        .expect(401)
        .expect((res)=>{
            expect(res.body).toEqual({});
        })
        .end(done);
    });
});

describe('POST /users',()=>{
    it('should creat a user',(done)=>{
        var email = 'karnan@gmail.com';
        var password = '123abd!';
        request(app)
        .post('/users')
        .send({email,password})
        .expect(200)
        .expect((res)=>{
            expect(res.header['x-auth']).toExist();
            expect(res.body._id).toExist();
            expect(res.body.email).toBe(email);
        })
        .end((err)=>{
            if(err)
            {
                return done(err);
            }
            User.findOne({email}).then((user)=>{
                expect(user).toExist();
                expect(user.password).toNotBe(password);
                done();
            }).catch((e)=>done(e));
        });
    });
    it('should return validation error',(done)=>{
        var email = 'gowtham'
        var password = 'abc';
        request(app)
        .post('/users')
        .send({email,password})
        .expect(401)
        .end(done)
    });
    it('should not create a user if email already exixt',(done)=>{
        var email = users[0].email;
        var password = '123abd!';
        request(app)
        .post('/users')
        .send({email,password})
        .expect(401)
        .end(done)
    });
});

describe('POST /users/login', () => {
    it('should login user and return auth token', (done) => {
      request(app)
        .post('/users/login')
        .send({
          email: users[1].email,
          password: users[1].password
        })
        .expect(200)
        .expect((res) => {
          expect(res.headers['x-auth']).toExist();
        })
        .end((err, res) => {
          if (err) {
            return done(err);
          }
  
          User.findById(users[1]._id).then((user) => {
            expect(user.tokens[1]).toInclude({
              access: 'auth',
              token: res.headers['x-auth']
            });
            done();
          }).catch((e) => done(e));  
        });
    });
  
    it('should reject invalid login', (done) => {
      request(app)
        .post('/users/login')
        .send({
          email: users[1].email,
          password: users[1].password + '1'
        })
        .expect(400)
        .expect((res) => {
          expect(res.headers['x-auth']).toNotExist();
        })
        .end((err, res) => {
          if (err) {
            return done(err);
          }
  
          User.findById(users[1]._id).then((user) => {
            expect(user.tokens.length).toBe(1);
            done();
          }).catch((e) => done(e));
        });
    });
  });
  
  describe('DELETE /users/me/token',()=>{
    it('should remove auth token on logout',(done)=>{
        request(app)
        .delete('/users/me/token')
        .set('x-auth',users[0].tokens[0].token)
        .expect(200)
        .end((err,res)=>{
            if(err){
                return done(err);
            }
            User.findById(users[0]._id).then((user)=>{
                expect(user.tokens.length).toBe(0);
                done();
            }).catch((e)=>done(e));
        });
    });
  });