import MaterialTable from 'material-table'
import {useState} from 'react'
export default function RenderImage() {

  const [columns, setColumns] = useState([
    { title: 'Name', field: 'name' },
    { title: 'Surname', field: 'surname', initialEditValue: 'initial edit value' },
    { title: 'Birth Year', field: 'birthYear', type: 'numeric' },
    {
      title: 'Birth Place',
      field: 'birthCity',
      lookup: { 
        nombre1: 'Hilton jardines' ,
        nombre2: 'qaaaaaaaaaa' ,
        nombre3: 'Hotel 2' ,
        nombre4: 'sadf' ,
        nombre5: 'dsfgdsfg' 
      },
    },
  ]);

  const [data, setData] = useState([
    { name: 'Mehmet', surname: 'Baran', birthYear: 1987, birthCity: 63 },
    { name: 'Zerya Betül', surname: 'Baran', birthYear: 2017, birthCity: 34 },
  ]);

  return (
    <MaterialTable
      title="Editable Preview"
      columns={columns}
      data={data}
      editable={{
        onRowAdd: newData =>
          new Promise((resolve, reject) => {
            setTimeout(() => {
              setData([...data, newData]);
              
              resolve();
            }, 1000)
          }),
        onRowUpdate: (newData, oldData) =>
          new Promise((resolve, reject) => {
            setTimeout(() => {
              const dataUpdate = [...data];
              const index = oldData.tableData.id;
              dataUpdate[index] = newData;
              setData([...dataUpdate]);

              resolve();
            }, 1000)
          }),
        onRowDelete: oldData =>
          new Promise((resolve, reject) => {
            setTimeout(() => {
              const dataDelete = [...data];
              const index = oldData.tableData.id;
              dataDelete.splice(index, 1);
              setData([...dataDelete]);
              
              resolve()
            }, 1000)
          }),
      }}
    />
  )
}
  