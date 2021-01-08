// import { MongoClient } from 'mongodb';
// import assert  from 'assert';
// import bcrypt from 'bcrypt';
// const v4 = require('uuid').v4;
// require('dotenv').config()
// import jwt from 'jsonwebtoken';

// const jwtsecret= process.env.SECRET_KEY;

// const saltRounds=10;
// const url= process.env.MONGODB_URI
// const dbName= process.env.MONGODB_DB

// //cadena de conexion a la base de datos
// const client = new MongoClient(url,{
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//   });

// //--------------------------------------------------------------------//

// function findUser(dbo, email, callback) {
//     const collection = dbo.collection('Usuario');

//     collection.findOne({email},{projection: {'_id':0,'Nombre':0,'apellido':0,'idUsuario':0,'Celular':0}}, callback);
//   }

// function createUser(dbo, email, password,rol, callback) {
//     const collection = dbo.collection('Usuario');
//     bcrypt.hash(password, saltRounds, function(err, hash) {
//         // Store hash in your password DB.
//         collection.insertOne(
//         {
//             idUsuario: v4(),
//             email,
//             password: hash,
//             rol,
//         },
//         function(err, userCreated) {
//             assert.equal(err, null);
//             callback(userCreated);
//         },
//         );
//     });
// }
// export default (req, res) => {
//     if(req.method== 'POST'){
//         //logueo
//         try{
//             //verificar si hay correo y password sino no puede proceder
//             assert.notEqual(null, req.body.email, 'Email required')
//             assert.notEqual(null, req.body.password, 'Password required')
//         }catch (bodyError){
//             res.status(403).json({error: true, message: bodyError.message});
//         }
//         //verificar si el email existe ya en la base de datos
//         client.connect(function(err){
//             assert.equal(null,err);
//             console.log('Connected to MognoDB server =>');

//             const dbo = client.db(dbName);
//             const email = req.body.email;
//             const password = req.body.password;
//             const rol = req.body.rol;

//             findUser(dbo, email, function(err, user){
//                 if(err){
//                     res.status(500).json({error: true, message: 'Error finding User'})
//                     return;
//                 }
//                 if(!user){
//                     //creamos usuario
//                     createUser(dbo,email,password,rol,function(creationResult){
//                         if(creationResult.ops.lenght === 1){
//                             const user = creationResult.ops[0];
//                             const token = jwt.sign(
//                                 {userId: userId, email: user.email}, jwtsecret,
//                                 {
//                                     expiresIn: 3000, //50 minutos en seg
//                                 },
//                             );
//                             res.status(200).json({token});
//                             return;
//                         }
//                     });
//                 } else{
//                     //existe el usuario
//                     res.status(403).json({error: true, message: 'Existe el Email'});
//                     return;
//                 }
//             })
//         })
//     }
// };