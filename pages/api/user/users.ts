import { withIronSessionApiRoute } from "iron-session/next";
import { ironOptions, LONG_SECRET_KEY } from "@/utils/config";
import { GetUserById } from "@/src/UseCases/UserManagement-usecases";
import { TipoUsuario, userInterface } from "@/utils/interfaces/db";
import { connectToDatabase } from "@/utils/API/connectMongo-v2";
import { Collection, Db } from "mongodb";
import { dbColeccionesFormato } from "@/utils/interfaces/db";
import { NextApiRequest, NextApiResponse } from "next";
import { generarIdNuevo } from "@/utils/API/generarId";
import { v4 } from "uuid";

export default withIronSessionApiRoute(async function loginRoute(req, res) {
    const session = req.session;
    if (!session.user) {
        res.send({ ok: false });
        return;
    }
    const userDB = await GetUserById(session.user.idUser).catch((err) => {
        console.error(err);
        res.send({ ok: false });
        return;
    });
    if (!userDB || (userDB as userInterface).TipoUsuario !== TipoUsuario.Administrador) {
        res.send({ ok: false });
        return;
    }
    switch (req.method) {
        case "GET":
            await obtenerUsuarios(req, res);
            break;
        case "POST":
            switch (req.body.accion) {
                case "create":
                    await crearUsuario(req, res);
                    break;
                case "update":
                    await actualizarUsuario(req, res);
                    break;
                default: 
                    res.status(404).send( { ok: false });
            }
            break;
        default:
            res.status(404).send({ ok: false });
            break;
    }
}, ironOptions);


const obtenerUsuarios = async (req: NextApiRequest, res: NextApiResponse<any>) => {
    await connectToDatabase().then(async connectedObject => {
        const coleccion = dbColeccionesFormato.User;
        const db: Db = connectedObject.db;
        const collection: Collection<any> = db.collection(coleccion.coleccion);
        const result = await collection.find({}).toArray();
        const filtro = result.filter((usuario: userInterface) => usuario.Estado === "Activo");
        console.log(filtro);
        res.send({
            ok: true,
            data: filtro
        });
    });
}



const actualizarUsuario = async (req: NextApiRequest, res: NextApiResponse<any>) => {
    const coleccion = dbColeccionesFormato.User;
    const usuario: userInterface = req.body.data;
    const idUsuario: string = req.body.idUsuario;
    await connectToDatabase().then(async connectedObject => {
        const db: Db = connectedObject.db;
        const collection: Collection<any> = db.collection(coleccion.coleccion);
        try {
            collection.updateOne(
                {
                    [coleccion.keyId]: idUsuario
                },
                {
                    $set: usuario
                }
            );
        } catch (error) {
            res.status(500).json({
                error: true,
                message: `Error al actualizar ${error}`
            });
        }
    })
}


const crearUsuario = async (req: NextApiRequest, res: NextApiResponse<any>) => {
    const coleccion = dbColeccionesFormato.User;
    const usuario: userInterface = req.body.data;
    console.log(usuario);
    const nuevoUsuario: userInterface = {
        ...usuario,
        IdUser: v4()
    };

    await connectToDatabase().then(async connectedObject => {
        const db: Db = connectedObject.db;
        const collection: Collection<any> = db.collection(coleccion.coleccion);
        try {
            const result = await collection.insertOne(nuevoUsuario);
            res.status(200);
        } catch (error: any) {
            console.log(`error : ${error.message}`);
        }
    });
}

