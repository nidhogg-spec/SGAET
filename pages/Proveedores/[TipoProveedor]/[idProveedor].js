import { useRouter } from 'next/router'
import TablaProveedores from '../../../components/ContactoProveedor/ContactoProveedor'
import MaterialTable from "material-table";

export default function TipoProveedor({Columnas, Datos}){
    const router = useRouter();
    const { idProveedor } = router.query;

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
            <TablaProveedores/>
        </div>
    )
}
export async function getServerSideProps(context) {
    let Columnas = [
      { title: "Servicio", field: "servicio" },
      { title: "Precio", field: "precio" },
      { title: "Caracteristicas", field: "descripcion" },
    ];
    let Datos=[]
    const uruId=context.query.idProveedor

    await fetch(process.env.API_DOMAIN+'/api/proveedores/restaurante')
    .then(r=> r.json())
    .then(data1=>{
      data1.data.map((datosResult)=>{
            if(uruId==datosResult.idProveedor){
                Datos.push({
                    servicio: datosResult.nombreServicio,
                    precio: datosResult.precioDolares,
                    descripcion: datosResult.descripcionServicio,
                })
            }
           
        })
    })
    return {
      props:{
        Columnas: Columnas, Datos:Datos
      }}
  }
