// const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb');
var obj = new ObjectID();
console.log(obj);

MongoClient.connect('mongodb://localhost:27017/', (err, db) => {
  if (err) {
    return console.log('Unable to connect to MongoDB server');
  }
  console.log('Connected to MongoDB server');
  var dbo = db.db("TodoApp");
//   dbo.collection('Todos').insertOne({
//     text: 'Something to do',
//     completed: false
//   }, (err, result) => {
//     if (err) {
//       return console.log('Unable to insert todo', err);
//     }
  
//     console.log(JSON.stringify(result.ops, undefined, 2));
//   });
//   dbo.collection('Users').insertOne({
//       name: 'Gowtham K',
//       age: 19,
//       location: 'Malayalapatti'
//   },(err,result)=>{
//       if(err){
//           return console.log('Unable to insert',err);          
//       }
//       console.log(JSON.stringify(result.ops[0]._id.getTimestamp(),undefined,2));
      
//   });

  db.close();
});
