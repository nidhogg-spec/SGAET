import { withIronSessionApiRoute } from "iron-session/next";
import { ironOptions, LONG_SECRET_KEY } from "@/utils/config";
import { GetUserById } from "@/src/application/usecases/user/UserManagement-usecases";
import { userInterface } from "@/utils/interfaces/db";

export default withIronSessionApiRoute(async function loginRoute(req, res) {
  switch (req.method) {
    case "GET":
      const session = req.session;
      if (!session.user) {
        res.send({ ok: false });
        return;
      }
      const userDB = await GetUserById(session.user.idUser).catch((err) => {
        console.error(err);
        res.send({ ok: false });
      });
      if (!userDB) {
        res.send({ ok: false });
      }

      res.send({
        ok: true,
        user: {
          Nombre: (userDB as userInterface).Nombre,
          Apellido: (userDB as userInterface).Apellido,
          Email: (userDB as userInterface).Email,
          TipoUsuario: (userDB as userInterface).TipoUsuario,
          Estado: (userDB as userInterface).Estado,
          IdUser: (userDB as userInterface).IdUser
        }
      });
      break;

    default:
      res.status(404).send({ ok: false });
      break;
  }
}, ironOptions);
