import { MongoClient } from 'mongodb';
require('dotenv').config()

const url= process.env.MONGODB_URI
const dbName= process.env.MONGODB_DB
const coleccion = "Proveedor";
const client = new MongoClient(url,{
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

function getData(dbo,coleccion,callback){
    const collection = dbo.collection(coleccion);
    collection.find({}).toArray(callback);
}
function getData2(dbo,callback){
    const collection = dbo.collection("Proveedor");
    collection.find({}).toArray(callback);
}

export default (req, res) =>{
    if(req.method == 'POST'){
        if(req.body.accion=="findOne"){
            client.connect(function(err){
                console.log('Connected to MognoDB server =>');
                const dbo = client.db(dbName);
                const collection = dbo.collection(coleccion);
                collection.findOne({idProveedor:req.body.idProveedor},(err,result)=>{
                    if(err){
                        res.status(500).json({error:true, message: 'un error .v'})
                        client.close()
                        return;
                    }
                    res.status(200).json({result});
                    client.close()
                })
            })
        }else if(req.body.accion=="create"){
            client.connect(function(err){
                console.log('Connected to MognoDB server =>');
                const dbo = client.db(dbName);
                const collection = dbo.collection(coleccion);
                collection.insertOne(req.body.data,(err,result)=>{
                    if(err){
                        res.status(500).json({error:true, message: 'un error .v'})
                        client.close()
                        return;
                    }
                    console.log("Insercion satifactoria");
                    res.status(200).json({message:"Todo bien, todo correcto, Insercion satifactoria"});
                    client.close()
                })
            })
        }else if(req.body.accion=="update"){
            client.connect(function(err){
                console.log('Connected to MognoDB server =>');
                const dbo = client.db(dbName);
                const collection = dbo.collection(coleccion);
                let dataActu={
                    $set: req.body.data
                }
                collection.updateOne({idProveedor:req.body.idProveedor},dataActu,(err,result)=>{
                    if(err){
                        res.status(500).json({error:true, message: 'un error .v'})
                        client.close()
                        return;
                    }
                    console.log("Actualizacion satifactoria");
                    res.status(200).json({message:"Todo bien, todo correcto,  Actualizacion satifactoria"});
                    client.close()
                })
            })
        }else if(req.body.accion=="delete"){
            client.connect(function(err){
                console.log('Connected to MognoDB server =>');
                const dbo = client.db(dbName);
                const collection = dbo.collection(coleccion);
                collection.deleteOne({idProveedor:req.body.idProveedor},(err,result)=>{
                    if(err){
                        res.status(500).json({error:true, message: 'un error .v'})
                        client.close()
                        return;
                    }
                    console.log("Deleteacion satifactoria");
                    res.status(200).json({message:"Todo bien, todo correcto, Deleteacion satifactoria "});
                    client.close()
                })
            })
        }
    }
    if(req.method == 'GET'){
        client.connect(function(err){
            console.log('Connected to MognoDB server =>');
            const dbo = client.db(dbName);

            getData2(dbo, function(err, data){
                if(err){
                    res.status(500).json({error:true, message: 'un error .v'})
                    return;
                }
                res.status(200).json({data})
                client.close;
            })
        })
    }
}

