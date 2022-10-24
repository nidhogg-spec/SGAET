import { SystemLogUsecase } from "@/src/application/usecases/systemLog.usecase";
import { validateCreateSystemLogBodyParam } from "@/utils/API/validation/systemLog.validation";
import { ironOptions } from "@/utils/config";
import { systemLogInterface } from "@/utils/interfaces/db";
import { withIronSessionApiRoute } from "iron-session/next";
import moment from "moment";
import { NextApiRequest, NextApiResponse } from "next";
import * as uuid from "uuid";

export default withIronSessionApiRoute(async function reservaCottizacionHttp(
  req: NextApiRequest,
  res: NextApiResponse
) {
  switch (req.method) {
    case "GET":
      await obtenerSystemLog(req, res);
      return;
      break;
    case "POST":
      await crearSystemLog(req, res);
      return;
      break;
    default:
      res.status(404).send("This method doeesn exist");
      return;
      break;
  }
},
ironOptions);

async function obtenerSystemLog(req: NextApiRequest, res: NextApiResponse) {
  const systemLogUsecase = new SystemLogUsecase();
  const result = await systemLogUsecase.list();
  res.status(200).send(result);
}

async function crearSystemLog(req: NextApiRequest, res: NextApiResponse) {
  const session = req.session;
  if (!session.user) {
    res.send({ message: "their is no valit session" });
    return;
  }
  let systemLogInput = req.body.systemLog;
  if (!systemLogInput) {
    res.status(400).send({
      status: 400,
      message: "systemLog not founded"
    });
    return;
  }
  const [systemLogInputreqBody, errors, status] =
    validateCreateSystemLogBodyParam(systemLogInput);
  if (!systemLogInputreqBody) {
    res.status(400).send({
      status: status,
      message: errors
    });
    return;
  }
  const log: systemLogInterface = {
    ...systemLogInputreqBody,
    User: {
      Email: session.user.email,
      IdUser: session.user.idUser,
      TipoUsuario: session.user.tipoUsuario
    },
    Estado: 1,
    IdSystemLog: uuid.v1(),
    CreatedAt: moment().format()
  };

  const systemLogUsecase = new SystemLogUsecase();
  const result = await systemLogUsecase.create(log);
  res.status(200).send(result);
}
