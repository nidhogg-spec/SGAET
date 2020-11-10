// import React,{useState,useEffect} from 'react'
import {useState} from 'react'
import MaterialTable from "material-table";
import ModalPTuristico from './ModalPTuristico/modalPTuristico'

let columns=[
  { title: "Nomber Programa", field: "name" },
  { title: "Localizacion", field: "surname" },
  { title: "Duracion Dias", field: "dayduration", type: "numeric" },
  { title: "Duracion Noches", field: "nightduration", type: "numeric" },
]
let data=[
  {
    name: "Mehmet",
    surname: "Baran",
    dayduration: 10,
    nightduration: 15,
    birthCity: 63,
  },
]

export default function Home() {
  const [showM,setShowM] = useState(false)

  const showModal = () =>{
    setShowM(true)
  }

  return (
    <div>
      {console.log(showM)}
      <ModalPTuristico show={showM}>Hola Modal</ModalPTuristico>
      <MaterialTable
      columns={columns}
      data={data}
      title="Programas Turisticos"
      actions={[
        {
          icon: () =>{
            return <img src="/resources/remove_red_eye-24px.svg"/>
          },
          tooltip: "Show User",
          onClick: (event, rowdata) => {
            showModal()
          }
        },
        () => ({
          icon: "delete",
          tooltip: "Delete User",
        }),
        {
          icon: () =>{
            return <img src="/resources/edit-black-18dp.svg"/>
          },
          tooltip: "Edit User",
        },
      ]}
      options={{
        actionsColumnIndex: -1,
      }}
      />
    </div>
  )
}
