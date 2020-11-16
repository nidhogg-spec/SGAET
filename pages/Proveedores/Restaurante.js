import MaterialTable from "material-table";

export default function Restaurante({Datos,Columnas}){
    return(
        <div>
            <MaterialTable
            columns={Columnas}
            data={Datos}
            title="Lista de Restaurantes"
            actions= {[
              {
                icon: () =>{
                  return <img src="/resources/edit-black-18dp.svg"/>
                },
                tooltip: "Edit Proveedor",
                // onClick: (event, rowData) => alert("You saved " + rowData.name)
              },
              {
                icon: () =>{
                  return <img src="/resources/delete-black-18dp.svg"/>
                },
                tooltip: "Delete Proveedor",
                // onClick: (event, rowData) => alert("You saved " + rowData.name)
              },
            ]}
            options={{
              actionsColumnIndex: -1,
            }}
            >
            </MaterialTable>
        </div>
    )
}
export async function getStaticProps() {
    let Columnas = [
      { title: "ID", field: "id" },
      { title: "Servicio", field: "servicio" },
      { title: "Precio", field: "precio" },
      { title: "Caracteristicas", field: "descripcion" },
    ];
    let Datos=[]
    await fetch(process.env.API_DOMAIN+'/api/proveedores/restaurante')
    .then(r=> r.json())
    .then(data1=>{
      data1.data.map((datosResult)=>{
          Datos.push({
            id: datosResult.idProveedor,
            servicio: datosResult.nombreServicio,
            precio: datosResult.precioDolares,
            descripcion: datosResult.descripcionServicio,

          })
        })
    })
    return {
      props:{
        Columnas: Columnas, Datos:Datos
      }}
  }