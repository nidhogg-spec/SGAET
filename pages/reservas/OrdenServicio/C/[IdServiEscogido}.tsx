import { withIronSessionSsr } from "iron-session/next";
import { ironOptions } from "@/utils/config";

export default function Index() {
  return <>ToDelete</>;
}

export const getServerSideProps = withIronSessionSsr(
  // @ts-ignore
  async function getServerSideProps({ req, res, query }) {
    const user = req.session.user;
    if (!user) {
      return {
        redirect: {
          permanent: false,
          destination: "/login"
        }
      };
    }
    //---------------------------------------------------------------------------------------------------------------------
    return {};
  },
  ironOptions
);
