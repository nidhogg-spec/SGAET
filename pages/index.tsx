import { GetServerSideProps } from "next";
import Router from "next/router";
import { useEffect } from "react";

export default function index() {
  // Make sure we're in the browser
  // useEffect(() => {
  //   const { pathname } = Router;
  //   if (pathname === "/") {
  //     Router.push("/home");
  //   }
  // }, []);
  return <></>;
}

export function getServerSideProps<GetServerSideProps>() {
  return {
    redirect: {
      permanent: false,
      destination: "/home"
    }
  };
}
