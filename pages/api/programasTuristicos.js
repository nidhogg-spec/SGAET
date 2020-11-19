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

    switch (req.method) {
        case 'GET':
            
            break;
        case 'POST':
            
            break;
        case 'PUT':
            
            break;
        default:
            break;
    }
}