// import { NextApiRequest, NextApiResponse } from "next";
// import { LoginUser } from "@/src/UseCases/UserManagement-usecases";

// export default async (req: NextApiRequest, res: NextApiResponse) => {
//   switch (req.method) {
//     case "POST":
//       try {
//         LoginUser(req.body.email, req.body.password).then((result) => {
//           res.status(200).json({
//             data: result.data,
//             message: result.message
//           });
//         });
//       } catch (err) {
//         res.status(500).json({
//           message: err
//         });
//       }

//       break;

//     default:
//       res.status(405).send(`Method ${req.method} not allowed`);
//       break;
//   }
// };

import { withIronSessionApiRoute } from "iron-session/next";
import { LONG_SECRET_KEY } from "@/utils/config";
import { LoginUserReturnUser } from "@/src/UseCases/UserManagement-usecases";

export default withIronSessionApiRoute(
  async function loginRoute(req, res) {
    const result = await LoginUserReturnUser(req.body.email, req.body.password);
    if (result.status != 200) {
      res.status(result.status).json({
        message: result.message,
        data: result.data,
        errorList: result.errorList,
        error: result.error,
        status: result.status
      });
      return;
    }
    req.session.user = {
      //@ts-ignore
      idUser: result.data.idUser,
      //@ts-ignore
      email: result.data.email,
      //@ts-ignore
      tipoUsuario: result.data.tipoUsuario
    };
    await req.session.save();
    res.send({ ok: true });
  },
  {
    cookieName: "SGAET",
    password: LONG_SECRET_KEY,
    // secure: true should be used in production (HTTPS) but can't be used in development (HTTP)
    cookieOptions: {
      secure: process.env.NODE_ENV === "production"
    }
  }
);
