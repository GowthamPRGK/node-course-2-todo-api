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
  // dbo.collection('Todos').find({_id: new ObjectID('5b6c373df21ce3ba3ff290c3')}).toArray().then((docs)=>{
  //     console.log('Todos');
  //     console.log(JSON.stringify(docs,undefined,2));      
  // },(err)=>{
  //     console.log('Unable to fetch data',err);
  // });
//   dbo.collection('Todos').find().count().then((count)=>{
//     console.log(`Todos count ${count}`);     
// },(err)=>{
//     console.log('Unable to fetch data',err);
// });
//   dbo.collection('Todos').findOneAndDelete({completed:false}).then((result)=>{
//     console.log(JSON.stringify(result,undefined,2));
    
//   },(err)=>{
//     console.log(err);
    
//   });
  dbo.collection('Users').deleteMany({name:'Gowtham K'}).then((result)=>{
    console.log(JSON.stringify(result,undefined,2));
    
  });


  db.close();
});
