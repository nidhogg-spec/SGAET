import React, { useState, useEffect } from "react";
import errorPages_style from "@/globalStyles/modules/errorPages.module.css";


export default function error_500() {

  return (
    <div className={`${errorPages_style.mainContainer}`}>
      <div className={`${errorPages_style.fof}`}>
        		<h1>Error 404</h1>
            <span>Esta pagina no existe</span>
    	</div>
    </div>
  );
}

export async function getStaticProps() {
  return {
    props: {
      publicPage: true
    }
  }
}

