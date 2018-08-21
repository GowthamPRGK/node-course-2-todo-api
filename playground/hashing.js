const {SHA256} = require('crypto-js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

var password = '123abc!';
var id = '122342hh'
var access = 'auth';
var token = jwt.sign({_id:id,access},'abc123').toString();
console.log(token);

// bcrypt.genSalt(15,(err,salt)=>{
//     console.log('salt',salt);
    
//     bcrypt.hash(password,salt,(err,hash)=>{
//         console.log(hash);
        
//     });
// });

// var hashedPassword = '$2a$15$KvZW3kbqTNSr36Qc01.7gOva.AFkteOwVPKTAZwHzfBLixTT7QMj.';
// bcrypt.compare(password,hashedPassword,(err,res)=>{
//     console.log(res);    
// });

// var data = {
//     id:10
// };
// var token = jwt.sign(data,'secret');
// console.log(token);
// var decoded = jwt.verify(token,'secret');
// console.log('DECODED:',decoded);