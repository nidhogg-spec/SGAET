import TablaSimple from "@/components/Formulario_V2/TablaSimple/TablaSimple";
import { useState } from "react";
import { useRouter } from "next/router";
import { useFormik } from "formik";

export interface ItinerarioProps {

}
interface IItinerario_Data {
  Resumen: String;
  Itinerario: Array<object>;
  Incluye: Array<object>;
  NoIncluye: Array<object>;
}
const Itinerario: React.SFC<ItinerarioProps> = () => {
  //Estados
  const [Itinerario_Data, setItinerario_Data] = useState({
    Incluye: [],
    Itinerario: [],
    NoIncluye: [],
    Resumen: ""
  } as IItinerario_Data);
  const [Estado_Editando, setEstado_Editando] = useState(true);
  const [Loading, setLoading] = useState(false);
  const router = useRouter();
  //-----------------------------------------------------
  const formik = useFormik({
    initialValues: {
      Incluye: [],
      Itinerario: [],
      NoIncluye: [],
      Resumen: ""
    },
    onSubmit: values => {
      alert(JSON.stringify(values, null, 2));
    },
  });



  return (
    <div>
      <h1>Itinerario</h1>
      <form action="">
        <label htmlFor="resumen">Resumen</label>
        <textarea
          id=""
          name="resumen"
          value={formik.values.Resumen}
          onChange={formik.handleChange}
          cols={30}
          rows={10}
        />

        <label htmlFor="resumen">Itinerario</label>
        <TablaSimple
          Title=""
          ModoEdicion={Estado_Editando}
          setDato={(x: object) => { setItinerario_Data(x as IItinerario_Data); }}
          KeyDato={"Itinerario"}
          Dato={Itinerario_Data["Itinerario"]}
          columnas={[
            //@ts-ignore
            { title: 'Dia', field: 'Dia', type: 'numeric' },
            //@ts-ignore
            { title: 'Hora', field: 'Hora' },
            //@ts-ignore
            { title: 'Actividad', field: 'Actividad' },
          ]}
          key={"ItinerarioTable"}
        />

        <label htmlFor="resumen">Incluye</label>
        <TablaSimple
          Title=""
          ModoEdicion={Estado_Editando}
          setDato={(x: object) => { setItinerario_Data(x as IItinerario_Data); }}
          KeyDato={"Incluye"}
          Dato={Itinerario_Data["Incluye"]}
          columnas={[
            //@ts-ignore
            { title: 'Item', field: 'Item' },
          ]}
          key={"IncluyeTable"}
        />

        <label htmlFor="resumen">No incluye</label>
        <TablaSimple
          Title=""
          ModoEdicion={Estado_Editando}
          setDato={(x: object) => { setItinerario_Data(x as IItinerario_Data); }}
          KeyDato={"NoIncluye"}
          Dato={Itinerario_Data["NoIncluye"]}
          columnas={[
            //@ts-ignore
            { title: 'Item', field: 'Item' },
          ]}
          key={"NoIncluyeTable"}
        />


      </form>
    </div>
  );
  // async function HandleGuardar(params: type) {
  //   //Validaciones a realizar
  //   // if (Proveedor.nombre == null) {
  //   //   alert("Llene el Campo Nombre Comercial");
  //   //   return;
  //   // }

  //   //Una vez que este validado, guardar
  //   setLoading(true);
  //   Itinerario_Data.tipo = provDinamico;

  //   if (
  //     !confirm(
  //       `El tipo de proveedor actual es ${Proveedor["tipo"]}, ¿Es correcto? (Este dato no se podra cambiar despues)`
  //     )
  //   ) {
  //     setLoading(false);
  //     return;
  //   }
  //   let result = await axios.post(
  //     props.APIpath + "/api/proveedores/listaProveedores",
  //     {
  //       accion: "Create",
  //       data: Proveedor
  //     }
  //   );
  //   router.push(
  //     `/Proveedores/${Proveedor["tipo"]}/${result.data["IdProveedor"]}`
  //   );
  // }
}



export default Itinerario;
