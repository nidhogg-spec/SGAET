import MaterialTable from "material-table";

import { colors } from "@material-ui/core";

export default function Home() {
  let columns=[
    { title: "Adı", field: "name" },
    { title: "Soyadı", field: "surname" },
    { title: "Doğum Yılı", field: "birthYear", type: "numeric" },
    {
      title: "Doğum Yeri",
      field: "birthCity",
      lookup: { 34: "İstanbul", 63: "Şanlıurfa" },
    },
  ]
  let data=[
    {
      name: "Mehmet",
      surname: "Baran",
      birthYear: 1987,
      birthCity: 63,
    },
  ]
  return (
    <div>
      <MaterialTable
      columns={columns}
      data={Datos}
      title="Demo Title"
      
      />
    </div>
  )
}
