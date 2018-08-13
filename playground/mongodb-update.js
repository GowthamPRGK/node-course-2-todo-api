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
//   dbo.collection('Todos').findOneAndUpdate({
//       _id: new ObjectID('5b714cf8bb37923b90cfbeb2')
//   },{
//       $set:{
//         completed:false
//       }
//   },{
//       returnOriginal: false
//   }).then((result)=>{
//       console.log(result);      
//   });
    dbo.collection('Users').findOneAndUpdate({
        name:'Yazhini Karnan'
    },{
        $set:{
            name:'Yazhini K'
        },
        $inc:{
            age:1
        }
    },{
        returnOriginal: false
    }).then((result)=>{
        console.log(result);
        
    });

  db.close();
});
