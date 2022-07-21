import { NextApiRequest, NextApiResponse } from "next";
import { LoginUser } from "@/src/UseCases/UserManagement-usecases";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  switch (req.method) {
    case "POST":
      try {
        LoginUser(req.body.email, req.body.password).then((result) => {
          res.status(200).json({
            data: result.data,
            message: result.message
          });
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
