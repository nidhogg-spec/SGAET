//css
import CustomStyles from "../../styles/Servicio.module.css"

// import React,{useState,useEffect} from 'react'
import MaterialTable from "material-table";
import BotonAnadir from "../../components/BotonAnadir/BotonAnadir";
import Modal from "../../components/Modal/Modal"

export default function Home() {
  return (
    <div>
        <div className={CustomStyles.tituloBox}>
            <span className={CustomStyles.titulo}>Servicios</span>
            <BotonAnadir/>
            {/* <Modal/> */}
        </div>
        
      <MaterialTable
      columns={[
        { title: "Adı", field: "name" },
        { title: "Soyadı", field: "surname" },
        { title: "Doğum Yılı", field: "birthYear", type: "numeric" },
        {
          title: "Doğum Yeri",
          field: "birthCity",
          lookup: { 34: "İstanbul", 63: "Şanlıurfa" },
        },
      ]}
      data={[
        {
          name: "Mehmet",
          surname: "Baran",
          birthYear: 1987,
          birthCity: 63,
        },
      ]}
      title="Demo Title"
      />
    </div>
  )
}
