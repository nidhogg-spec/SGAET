import { MongoClient } from 'mongodb';
require('dotenv').config()

const url= process.env.MONGODB_URI
const dbName= process.env.MONGODB_DB

const client = new MongoClient(url,{
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
function getData2(dbo,callback){
    const collection = dbo.collection("ProductoTransFerroviario");
    collection.find({}).toArray(callback);
}

export default (req, res) =>{
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
