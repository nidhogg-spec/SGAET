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



export default  (req, res) => {
    let client = new MongoClient(url,{
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
    if(req.method === 'GET'){
        client.connect((error)=>{
            // assert.equal(err, null); // Preguntar
            let dbo = client.db(dbName);
            
            let idServicio = req.body.idServicio;
            // console.log(req.body)
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
    }else if(req.method == 'POST'){
        if(req.body.type=='modalFindOne'){
            client.connect((error)=>{
                // assert.equal(err, null); // Preguntar
                let dbo = client.db(dbName);
                let idServicio = req.body.idServicio;
                console.log(req.body)
                let collection = dbo.collection(coleccion);
                collection.findOne({idServicio},(err,result)=>{
                    if(err){
                        res.status(500).json({error:true, message: 'un error .v'})
                        return;
                    }
                    res.status(200).json({result});
                    client.close()
                })
            })
        }else{
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
        
    }
};