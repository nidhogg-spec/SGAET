import {MongoClient} from 'mongodb'
import assert  from 'assert';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const jwtSecret = 'SUPERSECRET2020';

// const saltRounds = 10;
const url='mongodb+srv://lukuma_admin:T7NxWbbGiCZSkYV@lukuma.jtav6.gcp.mongodb.net'
const dbName='inkatourtravelmanagmentsystemdb'

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
  console.log(hash)
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
        if (err) {
          res.status(500).json({error: true, message: 'Error finding User'});
          return;
        }
        if (!user) {
          res.status(404).json({error: true, message: 'User not found'});
          return;
        } else {
          authUser(db, email, password, user.password, function(err, match) {
            // console.log(user.password)
            // console.log(password)
            // console.log(email)
            // console.log(match)
            if (err) {
              res.status(500).json({error: true, message: 'Auth Failed'});
            }
            if (match) {
              console.log(match)
              const token = jwt.sign(
                {userId: user.userId, email: user.email},
                jwtSecret,
                {
                  expiresIn: 3000, //50 minutes
                },
              );
              res.status(200).json({token});
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