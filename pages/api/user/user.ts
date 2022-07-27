import { withIronSessionApiRoute } from "iron-session/next";
import { LONG_SECRET_KEY } from "@/utils/config";
import { LoginUserReturnUser } from "@/src/UseCases/UserManagement-usecases";

export default withIronSessionApiRoute(
  async function loginRoute(req, res) {
    const session = req.session;
    if (!session.user) {
      res.send({ ok: false });
      return;
    }
    res.send({ user: session.user });
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
