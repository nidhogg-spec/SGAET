import { MongoClient } from 'mongodb';
// import nextConnect from 'next-connect';

const url='mongodb+srv://lukuma_admin:T7NxWbbGiCZSkYV@lukuma.jtav6.gcp.mongodb.net/inkatourtravelmanagmentsystemdb'

export default async (req, res) => {
  try {
    const db = await MongoClient.connect(url,{
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    const dbo = db.db("inkatourtravelmanagmentsystemdb");

    const collection = dbo.collection('Usuario');

    collection.find({}).project({'_id':0,'Nombre':0,'apellido':0,'idUsuario':0,'Celular':0}).toArray(function(err, docs) {
      console.log("Found the following records");
      res.json(docs)
    });
    
  } catch (e) {
    res.status(500).json({ error: e });
  }
};