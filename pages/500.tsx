import React, { useState, useEffect } from "react";
import errorPages_style from "@/globalStyles/modules/errorPages.module.css";

export default function error_500() {
  return (
    <div className={`${errorPages_style.mainContainer}`}>
      <div className={`${errorPages_style.fof}`}>
        <h1>Error 500</h1>
        <span> Error en solicitud</span>
      </div>
    </div>
  );
}

export async function getStaticProps() {
  return {
    props: {
      publicPage: true
    }
  };
}
