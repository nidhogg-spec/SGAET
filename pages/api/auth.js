import {MongoClient} from 'mongodb'
import assert  from 'assert';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
require('dotenv').config()

const jwtSecret = process.env.SECRET_KEY;

// const saltRounds = 10;
const url= process.env.MONGODB_URI
const dbName= process.env.MONGODB_DB

const client = new MongoClient(url, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

function findUser(db, email, callback) {
  const collection = db.collection('Usuario');
  collection.findOne({email},{projection: {'_id':0,'Nombre':0,'apellido':0,'idUsuario':0,'Celular':0}}, callback);
}

function authUser(db, email, password, hash, callback) {
  bcrypt.compare(password, hash, callback);
}

export default (req, res) => {
  if (req.method === 'POST') {
    //login
    try {
      assert.notEqual(null, req.body.email, 'Email required');
      assert.notEqual(null, req.body.password, 'Password required');
    } catch (bodyError) {
      res.status(403).send(bodyError.message);
    }

    client.connect(function(err) {
      assert.equal(null, err);
      console.log('Connected to MongoDB server =>');
      const db = client.db(dbName);
      const email = req.body.email;
      const password = req.body.password;

      findUser(db, email, function(err, user) {
        console.log(user)
        if (err) {
          res.status(500).json({error: true, message: 'Error finding User'});
          return;
        }
        if (!user) {
          res.status(404).json({error: true, message: 'User not found'});
          return;
        } else {
          authUser(db, email, password, user.password, function(err, match) {
            if (err) {
              res.status(500).json({error: true, message: 'Auth Failed'});
            }
            if (match) {
              const rolToken = user.rol;
              const token = jwt.sign(
                {userId: user.userId, email: user.email, rol: user.rol},
                jwtSecret,
                {
                  expiresIn: 3000, //50 minutes
                })
              res.status(200).json({token,rolToken});
              return;
            } else {
              res.status(401).json({error: true, message: 'Auth Failed'});
              return;
            }
          });
        }
      });
    });
  } else {
    // Handle any other HTTP method
    res.statusCode = 401;
    res.end();
  }
};