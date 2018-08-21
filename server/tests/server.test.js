const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');

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
        .expect((res)=>{
            expect(res.body.todos.length).toBe(2);
        })
        .end(done);
    });
});

describe('GET /todos/:id', () => {
    it('should return todo doc', (done) => {
        
      request(app)
        .get(`/todos/${todos[0]._id.toHexString()}`)
        .expect(200)
        .expect((res) => {
            
          expect(res.body.todo.text).toBe(todos[0].text);
        })
        .end(done);
    });
    it(' Should return 404 if todo not found',(done)=>{
        request(app)
        .get('/todos/5b729e57b927fa4470be7b67')
        .expect(404)
        .end(done);
    });
    it(' Should return 404 if todo not found',(done)=>{
        request(app)
        .get('/todos/123')
        .expect(404)
        .end(done);
    });
});

describe('DELETE /todos/is',()=>{
    it('should remove a todo',(done)=>{
        request(app)
        .delete(`/todos/${todos[0]._id.toHexString()}`)
        .expect(200)
        .expect((res) => {
            
          expect(res.body.docs.text).toBe(todos[0].text);
        })
        .end(done);
    });
    it(' Should return 404 if todo not found',(done)=>{
        request(app)
        .delete('/todos/5b729e57b927fa4470be7b67')
        .expect(404)
        .end(done);
    });
    it(' Should return 404 if todo id is not valid',(done)=>{
        request(app)
        .delete('/todos/123')
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
        .patch(`/todos/${todos[0]._id.toHexString()}`)
        .send(ch)
        .expect(200)
        .expect((res)=>{
            expect(res.body.todo.text).toBe(ch.text);
            expect(res.body.todo.completed).toBeA('boolean').toBe(true);
            expect(res.body.todo.completedAt).toBeA('number');
        })
        .end(done);        
    });
    it('Should update the todo',(done)=>{
        var ch = {
            text:"Hello World",
            completed:false
        };
        request(app)
        .patch(`/todos/${todos[0]._id.toHexString()}`)
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