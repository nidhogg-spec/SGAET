import { MongoClient } from 'mongodb';
import assert  from 'assert';
import bcrypt from 'bcrypt';
const v4 = require('uuid').v4;
require('dotenv').config()
import jwt from 'jsonwebtoken';

const jwtsecret= process.env.SECRET_KEY;

const saltRounds=10;
const url= process.env.MONGODB_URI
const dbName= process.env.MONGODB_DB

const coleccion = "Servicio"

const client = new MongoClient(url,{
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

function findServicio(dbo, idServicio, callback) {
    const collection = dbo.collection(coleccion);

    // collection.findOne({idServicio},{projection: {'_id':0,'Nombre':0,'apellido':0,'idUsuario':0,'Celular':0}}, callback);
  }
  function createUser(dbo, email, password,rol, callback) {
    const collection = dbo.collection(coleccion);
    bcrypt.hash(password, saltRounds, function(err, hash) {
        // Store hash in your password DB.
        collection.insertOne(
        {
            idUsuario: v4(),
            email,
            password: hash,
            rol,
        },
        function(err, userCreated) {
            assert.equal(err, null);
            callback(userCreated);
        },
        );
    });
}
async function getData(collection,client){
    console.log("Prueba")
    await collection.findOne({},(err,result)=>{
        if(err){
            throw err
        }
        console.log(result)
        client.close()
    })
    
}
export default  (req, res) => {
    if(req.method === 'GET'){
        client.connect((error)=>{
            // assert.equal(err, null); // Preguntar
            let dbo = client.db(dbName);
            
            let idServicio = req.body.idServicio;
            console.log(req.body)
            let collection = dbo.collection(coleccion);
            // collection.findOne(idServicio)
            collection.find({},{projection:{
                idServicio:1,
                NombreServicio:1,
                TipoServicio:1
            }}).toArray((err,result)=>{
                if(err){
                    throw err
                }
                res.status(200).json({result});
                client.close()
            })
        })
    }else if(req.method === 'POST'){
        client.connect((error)=>{
            // assert.equal(err, null); // Preguntar
            let dbo = client.db(dbName);
            
            let idServicio = req.body.idServicio;
            console.log(req.body)
            let collection = dbo.collection(coleccion);
            // collection.findOne(idServicio)
            collection.findOne({idServicio},(err,result)=>{
                if(err){
                    throw err
                }
                res.status(200).json({result});
                client.close()
            })
        })
    }
};