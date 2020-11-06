// import React,{useState,useEffect} from 'react'
import MaterialTable from "material-table";

export default function Home() {
  return (
    <div>
      <MaterialTable
      columns={[
        { title: "Nomber Programa", field: "name" },
        { title: "Localizacion", field: "surname" },
        { title: "Duracion Dias", field: "birthYear", type: "numeric" },
        { title: "Duracion Noches", field: "birthYear", type: "numeric" },
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
      title="Programas Turisticos"
      />
    </div>
  )
}
