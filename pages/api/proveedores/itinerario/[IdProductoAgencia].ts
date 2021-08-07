import { NextApiRequest, NextApiResponse } from "next";
import { connectToMongoAtlas } from "@/utils/API/conexionMongo";

export default async (req: NextApiRequest, res: NextApiResponse) => {
    switch (req.method) {
        case 'GET':
            get(req, res);
            break;
        case 'PUT':
            put(req,res);
            break;

        default:
            res.status(404).json({"error":"No existe una accion para el metodo solicitado"})
            break;
    }
}

async function get(req: NextApiRequest, res: NextApiResponse) {
    // const idProvAgente = req.query["idProvAgente"];
    const IdProductoAgencia = req.query["IdProductoAgencia"];
    let data_ProductoAgencia = await connectToMongoAtlas().then(async (anyDb) => { 
        return await anyDb?.collection("ProductoAgencias").findOne({"IdProductoAgencia":IdProductoAgencia})
    })
    if (data_ProductoAgencia) {        
        if(data_ProductoAgencia.itinerario){
            res.json({"data":data_ProductoAgencia.itinerario});
        }else{
            res.json({"data":{
                resumen: "",
                itinerario: [],
                incluye: [],
                noIncluye: [],
            }});
        }        
    }else{
        res.status(400).json({"error": "No existe el IdProductoAgencia"});
    }
}
async function put(req: NextApiRequest, res: NextApiResponse) {
    const IdProductoAgencia = req.query["IdProductoAgencia"];
    const itinerario_ProductoAgencia = req.body["itinerario"];
    let data_ProductoAgencia = await connectToMongoAtlas().then(async (anyDb) => { 
        return await anyDb?.collection("ProductoAgencias").updateOne({"IdProductoAgencia":IdProductoAgencia},{$set:{
            "itinerario":itinerario_ProductoAgencia
        }})
    })
    if(data_ProductoAgencia)
        res.status(200).send(`${data_ProductoAgencia?.result}`)
    else
        res.status(400).json({"error": "No se pudo actualizar"});
}