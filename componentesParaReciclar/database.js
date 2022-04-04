import { MongoClient } from 'mongodb';
// import nextConnect from 'next-connect';

const url='mongodb+srv://lukuma_admin:T7NxWbbGiCZSkYV@lukuma.jtav6.gcp.mongodb.net/inkatourtravelmanagmentsystemdb'

export default async (req, res) => {
  try {
    const db = await MongoClient.connect(url,{
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to the Database');
    
    // const dbo = db.db("inkatourtravelmanagmentsystemdb");
    // const bcrypt = require('bcrypt');
    // const saltRounds = 10;
    // const myPlaintextPassword = 'hola';
    // const someOtherPlaintextPassword = 'adios';
    // const collection = dbo.collection('Usuario');

    // // Load hash from your password DB.
    // bcrypt.compare(myPlaintextPassword, hash, function(err, result) {
    //   // result == true
    // });
    // bcrypt.compare(someOtherPlaintextPassword, hash, function(err, result) {
    //   // result == false
    // });

    // const email = req.body.email;
    // const password = req.body.password;

    // // var prueba1 = collection.findOne({email});

    // // console.log(prueba1)
    // console.log(email)
    // console.log(password)
    // console.log()
    // res.json(collection.findOne({}))
    collection.findOne({"email":'j123@gmail.com'},{projection: {'_id':0,'Nombre':0,'apellido':0,'idUsuario':0,'Celular':0}},function(err, docs){
      res.json(docs)
    })

    
    // collection.find({}).project({'_id':0,'Nombre':0,'apellido':0,'idUsuario':0,'Celular':0}).toArray(function(err, docs) {
    //   console.log("Found the following records");
    //   res.json(docs)
    // });
    
  } catch (e) {
    res.status(500).json({ error: e });
  }
};