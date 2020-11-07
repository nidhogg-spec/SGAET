//css
import CustomStyles from "../../styles/Servicio.module.css";

// import React,{useState,useEffect} from 'react'
import MaterialTable from "material-table";
import BotonAnadir from "../../components/BotonAnadir/BotonAnadir";
import Modal from "../../components/Modal/Modal";

export default function Home() {
  let Columnas = [
    { title: "Adı", field: "name" },
    { title: "Soyadı", field: "surname" },
    { title: "Doğum Yılı", field: "birthYear", type: "numeric" },
    {
      title: "Doğum Yeri",
      field: "birthCity",
      lookup: { 34: "İstanbul", 63: "Şanlıurfa" },
    },
  ];

  let Datos = [
    {
      name: "Mehmet",
      surname: "Baran",
      birthYear: 1987,
      birthCity: 63,
    },
  ];
  const url= process.env.MONGODB_URI
  console.log(process.env)
  // console.log(process)
  return (
    <div>
      <div className={CustomStyles.tituloBox}>
        <span className={CustomStyles.titulo}>Servicios</span>
        <BotonAnadir />
        <Modal />
        
      </div>

      <MaterialTable
        columns={Columnas}
        data={Datos}
        title="Demo Title"
        actions={[
          {
            icon: "save",
            tooltip: "Save User",
            // onClick: (event, rowData) => alert("You saved " + rowData.name)
          },
          (rowData) => ({
            icon: "delete",
            tooltip: "Delete User",
            // onClick: (event, rowData) => confirm("You want to delete " + rowData.name)
          }),
        ]}
        options={{
          actionsColumnIndex: -1,
        }}
      />
    </div>
  );
}

function getData(TipoData){
  const url= process.env.MONGODB_URI
  const dbName= process.env.MONGODB_DB

  //cadena de conexion a la base de datos
  const client = new MongoClient(url,{
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    return url;
} 
