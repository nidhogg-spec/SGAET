import { NextApiRequest, NextApiResponse } from "next";
import { RegisterUser } from "@/src/usecases/user/UserManagement-usecases";
import {
  TipoDocumento,
  TipoUsuario,
  userInterface
} from "@/utils/interfaces/db";
import * as uuid from "uuid";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  switch (req.method) {
    case "POST":
      let errors = [];
      if (!req.body.Email)
        errors.push("El email es requerido para el registro");
      if (!req.body.Password)
        errors.push("La contraseña es requerida para el registro");
      if (!req.body.Nombre)
        errors.push("El nombre es requerido para el registro");
      if (!req.body.Apellido)
        errors.push("El apellido es requerido para el registro");
      if (!req.body.TipoUsuario)
        errors.push("El tipo de usuario es requerido para el registro");
      if (Object.values(TipoUsuario).includes(req.body.TipoUsuario))
        errors.push("El tipo de usuario es incorrecto");
      if (errors.length > 0) {
        res.status(400).json({
          message: "Error en el registro",
          data: errors,
          status: 400
        });
        return;
      }

      const user: userInterface = {
        IdUser: uuid.v4(),
        Email: req.body.Email,
        Password: req.body.Password,
        Nombre: req.body.Nombre,
        Apellido: req.body.Apellido,
        TipoUsuario: req.body.TipoUsuario,
        Estado: 1
      };

      try {
        RegisterUser(user).then((result) => {
          if (result.status === 400) {
            res.status(400).json({
              data: result.data,
              message: result.message
            });
            return;
          }
          res.status(200).json(result);
        });
      } catch (err) {
        res.status(500).json({
          message: err
        });
      }

      break;

    default:
      res.status(405).send(`Method ${req.method} not allowed`);
      break;
  }
};
