// import React,{useState,useEffect} from 'react'
import { colors } from "@material-ui/core";

import MaterialTable from "material-table";


let columns=[
  { title: "Nomber Programa", field: "name" },
  { title: "Localizacion", field: "surname" },
  { title: "Duracion Dias", field: "dayduration", type: "numeric" },
  { title: "Duracion Noches", field: "nightduration", type: "numeric" },
  {
    title: "",
    field: "icon",
    type: "icon"
  },
]
let data=[
  {
    name: "Mehmet",
    surname: "Baran",
    dayduration: 10,
    nightduration: 15,
    birthCity: 63,
    icon: tableEyeIcon
  },
]

export default function Home() {

  return (
    <div>
      <MaterialTable
      columns={columns}
      data={data}
      icons= {tableEyeIcon,tablePenIcon}
      title="Programas Turisticos"
      />
    </div>
  )
}
