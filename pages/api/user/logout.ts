import { withIronSessionApiRoute } from "iron-session/next";
import { LONG_SECRET_KEY } from "@/utils/config";
import { LoginUserReturnUser } from "@/src/usecases/user/UserManagement-usecases";

export default withIronSessionApiRoute(
  async function loginRoute(req, res) {
    req.session.destroy();
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
