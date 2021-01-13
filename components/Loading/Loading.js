import React, { useState, useEffect } from "react";

import styles from "./Loading.module.css";

const LoadingComp = (props ={ Loading:false }) => {
  return <>{props.Loading ? (<><div className={styles.fondo}><div className={styles.loader}/></div></>) : (<></>)}</>;
};

export default LoadingComp;
