import { MongoClient } from 'mongodb';
import assert  from 'assert';
import bcrypt from 'bcrypt';
import v4 from ('uuid').v4;
import jwt from 'jsonwebtoken';

const jwtsecret='SUPERSECRET2020'

const saltRounds=10;
const url='mongodb+srv://lukuma_admin:T7NxWbbGiCZSkYV@lukuma.jtav6.gcp.mongodb.net'
const dbName='inkatourtravelmanagmentsystemdb'

//cadena de conexion a la base de datos
const client = new MongoClient(url,{
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
// const collection = dbo.collection('Usuario');
//--------------------------------------------------------------------//

function findUser(dbo, email, callback) {
    const collection = dbo.collection('Usuario');
    collection.findOne({email}, callback);
  }

function createUser(dbo, email, password, callback) {
    const collection = dbo.collection('Usuario');
    bcrypt.hash(password, saltRounds, function(err, hash) {
        // Store hash in your password DB.
        collection.insertOne(
        {
            userId: v4(),
            email,
            password: hash,
        },
        function(err, userCreated) {
            assert.equal(err, null);
            callback(userCreated);
        },
        );
    });
}
export default (req, res) => {
    if(req.method== 'POST'){
        //logueo
        try{
            //verificar si hay correo y pasdword sino no puede proceder
            assert.notEqual(null, req.body.Correo, 'Email required')
            assert.notEqual(null, req.body.Password, 'Password required')
        }catch (bodyError){
            res.status(403).json({error: true, message: bodyError.message});
        }
        //verificar si el email existe ya en la base de datos
        db.connect(function(err){
            assert.equal(null,err);
            console.log('Connected to MognoDB server =>');

            const dbo = client.db(dbName);
            const email = req.body.Correo;
            const password = req.body.Password;

            findUser(dbo, email, function(err, user){
                if(err){
                    res.status(500).json({error: true, message: 'Error finding User'})
                    return;
                }
                if(!user){
                    //creamos usuario
                    createUser(dbo,email,password,function(creationResult){
                        if(creationResult.ops.lenght === 1){
                            const user = creationResult.ops[0];
                            const token = jwt.sign(
                                {userId: userId, email: user.email}, jwtsecret,
                                {
                                    expiresIn: 3000, //50 minutos en seg
                                },
                            );
                            res.status(200).json({token});
                            return;
                        }
                    });
                } else{
                    //existe el usuario
                    res.status(403).json({error: true, message: 'Existe el Email'});
                    return;
                }
            })
        })
    }
};