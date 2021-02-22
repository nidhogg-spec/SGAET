import { useRouter } from "next/router";
import styles from "@/globalStyles/Proveedor.module.css";
import MaterialTable from "material-table";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { resetServerContext } from "react-beautiful-dnd";
//componentes
import AutoFormulario from "@/components/Formulario_V2/AutoFormulario/AutoFormulario";
import LoadingComp from "@/components/Loading/Loading";
resetServerContext();
export default function TipoProveedor(props = { APIpath }) {
  //Variables
  const [Proveedor, setProveedor] = useState({
    Estado: "1",
    tipo: "Hotel",
    TipoMoneda: "Dolar"
  });
  const [ProveedorContacto, setProveedorContacto] = useState([]);
  const [ProveedorBanco, setProveedorBanco] = useState([]);
  const [provDinamico, setprovDinamico] = useState("hotel");
  const [Loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (Proveedor["tipo"] == undefined) return;
    setprovDinamico(Proveedor["tipo"].toLowerCase());
  }, [Proveedor["tipo"]]);
  //Acciones de botones
  const HandleGuardar = async () => {
    //Validar que tipo es correcto
    if (Proveedor.nombre == null) {
      alert("Llene el Campo Nombre Comercial");
    } else {
      setLoading(true);
      Proveedor.Contacto = ProveedorContacto;
      Proveedor.DatosBancarios = ProveedorBanco;
      if (
        !confirm(
          `El tipo de proveedor actual es ${Proveedor["tipo"]}, ¿Es correcto? (Este dato no se podra cambiar despues)`
        )
      ) {
        setLoading(false);
        return;
      }
      let result = await axios.post(
        props.APIpath + "/api/proveedores/listaProveedores",
        {
          accion: "Create",
          data: Proveedor
        }
      );
      router.push(
        `/Proveedores/${Proveedor["tipo"]}/${result.data["IdProveedor"]}`
      );
    }
  };

  return (
    <div>
      <LoadingComp Loading={Loading} />
      <h1>{Proveedor.nombre}</h1>
      <button onClick={HandleGuardar}>
        <img src="/resources/save-black-18dp.svg" />
      </button>

      <a href="#ProductoServicio_area">Productos/Servicios</a>
      <AutoFormulario
        Formulario={{
          title: "Datos de Proveedor",
          secciones: [
            {
              subTitle: "",
              componentes: [
                {
                  tipo: "selector",
                  Title: "Tipo de Proveedor",
                  KeyDato: "tipo",
                  SelectOptions: [
                    { value: "Hotel", texto: "Hotel" },
                    { value: "Agencia", texto: "Agencia" },
                    { value: "Guia", texto: "Guia" },
                    {
                      value: "TransporteTerrestre",
                      texto: "Transporte Terrestre"
                    },
                    { value: "Restaurante", texto: "Restaurante" },
                    { value: "SitioTuristico", texto: "Sitio Turistico" },
                    {
                      value: "TransporteFerroviario",
                      texto: "Transporte Ferroviario"
                    },
                    { value: "Otro", texto: "Otro" }
                  ]
                },
                {
                  tipo: "texto",
                  Title: "Razon Social",
                  KeyDato: "RazonSocial"
                },
                {
                  tipo: "texto",
                  Title: "Nombre Comercial",
                  KeyDato: "nombre"
                },
                {
                  tipo: "selector",
                  Title: "Tipo de Documento",
                  KeyDato: "TipoDocumento",
                  SelectOptions: [
                    { value: "DNI", texto: "DNI" },
                    { value: "RUC", texto: "RUC" },
                    {
                      value: "CarnetExtranjeria",
                      texto: "Carnet de Extranjeria"
                    }
                  ]
                },
                {
                  tipo: "texto",
                  Title: "Numero de Documento",
                  KeyDato: "NroDocumento"
                },
                {
                  tipo: "texto",
                  Title: "Direccion fiscal",
                  KeyDato: "DireccionFiscal"
                },
                {
                  tipo: "selector",
                  Title: "Tipo de Moneda",
                  KeyDato: "TipoMoneda",
                  SelectOptions: [
                    { value: "Sol", texto: "Soles" },
                    { value: "Dolar", texto: "Dolares" }
                  ]
                },
                {
                  tipo: "texto",
                  Title: "Enlace al Documento",
                  KeyDato: "EnlaceDocumento"
                },
                {
                  tipo: "texto",
                  Title: "Numero de telefono o celular principal",
                  KeyDato: "NumeroPrincipal"
                },
                {
                  tipo: "texto",
                  Title: "Email principal",
                  KeyDato: "EmailPrincipal"
                },
                {
                  tipo: "selector",
                  Title: "Estado",
                  KeyDato: "Estado",
                  SelectOptions: [
                    { value: 0, texto: "Inactivo" },
                    { value: 1, texto: "Activo" }
                  ]
                }
              ]
            },
            {
              subTitle: "Representantante Legal",
              componentes: [
                {
                  tipo: "texto",
                  Title: "Nombre del Gerente General",
                  KeyDato: "NombreRepresentanteLegal"
                },
                {
                  tipo: "texto",
                  Title: "Numero del documento de identidad",
                  KeyDato: "NroDocIdentRepresentanteLegal"
                }
              ]
            }
            // {
            //   subTitle: "Representantante Legal",
            //   componentes: [
            //     {
            //       tipo: "selector",
            //       Title: "Numero de estrellas",
            //       KeyDato: "NEstrellas",
            //       SelectOptions: [
            //         { value: 0, texto: "0" },
            //     { value: 1, texto: "1" },
            //     { value: 2, texto: "2" },
            //     { value: 3, texto: "3" },
            //     { value: 4, texto: "4" },
            //     { value: 5, texto: "5" },
            //       ],
            //     },
            //     {
            //       tipo: "texto",
            //       Title: "Numero del documento de identidad",
            //       KeyDato: "NroDocIdentRepresentanteLegal",
            //     },
            //   ],
            // }
          ]
        }}
        Dato={Proveedor}
        setDato={setProveedor}
        ModoEdicion={true}
        key={"AutoFormulario001"}
      />
      <div className={styles.divDatosPrincipal}>
        <div className={styles.Proveedor}>
          <h2>Otros Datos</h2>

          {provDinamico == "hotel" ? (
            <>
              <AutoFormulario
                Formulario={{
                  title: "Datos de Proveedor",
                  secciones: [
                    {
                      subTitle: "",
                      componentes: [
                        {
                          tipo: "selector",
                          Title: "Numero de estrellas",
                          KeyDato: "NEstrellas",
                          SelectOptions: [
                            { value: 0, texto: "0" },
                            { value: 1, texto: "1" },
                            { value: 2, texto: "2" },
                            { value: 3, texto: "3" },
                            { value: 4, texto: "4" },
                            { value: 5, texto: "5" }
                          ]
                        }
                      ]
                    }
                  ]
                }}
                Dato={Proveedor}
                setDato={setProveedor}
                ModoEdicion={true}
                key={"AutoFormulario001"}
              />
            </>
          ) : provDinamico == "restaurante" ? (
            <>
              <AutoFormulario
                Formulario={{
                  title: "Datos de Proveedor",
                  secciones: [
                    {
                      subTitle: "",
                      componentes: [
                        {
                          tipo: "selector",
                          Title: "Numero de Tenedores",
                          KeyDato: "NTenedores",
                          SelectOptions: [
                            { value: 0, texto: "0" },
                            { value: 1, texto: "1" },
                            { value: 2, texto: "2" },
                            { value: 3, texto: "3" },
                            { value: 4, texto: "4" },
                            { value: 5, texto: "5" }
                          ]
                        }
                      ]
                    }
                  ]
                }}
                Dato={Proveedor}
                setDato={setProveedor}
                ModoEdicion={true}
                key={"AutoFormulario001"}
              />
            </>
          ) : null}
          <MaterialTable
            title="Datos de Contacto"
            columns={[
              { field: "NombreContac", title: "Nombre del Contacto" },
              { field: "Area", title: "Area de trabajo" },
              { field: "Numero", title: "Telefono/Celular" },
              { field: "Email", title: "Email" }
            ]}
            data={ProveedorContacto}
            editable={{
              onRowAdd: (newData) =>
                new Promise((resolve, reject) => {
                  setTimeout(() => {
                    setProveedorContacto([...ProveedorContacto, newData]);

                    resolve();
                  }, 1000);
                }),
              onRowUpdate: (newData, oldData) =>
                new Promise((resolve, reject) => {
                  setTimeout(() => {
                    const dataUpdate = [...ProveedorContacto];
                    const index = oldData.tableData.id;
                    dataUpdate[index] = newData;
                    setProveedorContacto([...dataUpdate]);

                    resolve();
                  }, 1000);
                }),
              onRowDelete: (oldData) =>
                new Promise((resolve, reject) => {
                  setTimeout(() => {
                    const dataDelete = [...ProveedorContacto];
                    const index = oldData.tableData.id;
                    dataDelete.splice(index, 1);
                    setProveedorContacto([...dataDelete]);

                    resolve();
                  }, 1000);
                })
            }}
          />
          <MaterialTable
            title="Datos de Cuentas Bancarias"
            columns={[
              { field: "Banco", title: "Banco" },
              { field: "Beneficiario", title: "Beneficiario" },
              {
                field: "TipoCuenta",
                title: "Tipo de Cuenta Bancaria"
              },
              {
                field: "TipoDocumento",
                title: "Tipo de Documento",
                lookup: { RUC: "RUC", DNI: "DNI" }
              },
              { field: "NumDoc", title: "Numero de Documento" },
              { field: "Cuenta", title: "Numero de Cuenta" },
              { field: "CCI", title: "CCI" }
            ]}
            data={ProveedorBanco}
            editable={{
              onRowAdd: (newData) =>
                new Promise((resolve, reject) => {
                  setTimeout(() => {
                    setProveedorBanco([...ProveedorBanco, newData]);

                    resolve();
                  }, 1000);
                }),
              onRowUpdate: (newData, oldData) =>
                new Promise((resolve, reject) => {
                  setTimeout(() => {
                    const dataUpdate = [...ProveedorBanco];
                    const index = oldData.tableData.id;
                    dataUpdate[index] = newData;
                    setProveedorBanco([...dataUpdate]);

                    resolve();
                  }, 1000);
                }),
              onRowDelete: (oldData) =>
                new Promise((resolve, reject) => {
                  setTimeout(() => {
                    const dataDelete = [...ProveedorBanco];
                    const index = oldData.tableData.id;
                    dataDelete.splice(index, 1);
                    setProveedorBanco([...dataDelete]);

                    resolve();
                  }, 1000);
                })
            }}
          />
        </div>
      </div>
    </div>
  );
}

export async function getServerSideProps(context) {
  return {
    props: {
      APIpath: process.env.API_DOMAIN
    }
  };
}

function deepEqual(object1, object2) {
  const keys1 = Object.keys(object1);
  const keys2 = Object.keys(object2);

  if (keys1.length !== keys2.length) {
    return false;
  }

  for (const key of keys1) {
    const val1 = object1[key];
    const val2 = object2[key];
    const areObjects = isObject(val1) && isObject(val2);
    if (
      (areObjects && !deepEqual(val1, val2)) ||
      (!areObjects && val1 !== val2)
    ) {
      return false;
    }
  }

  return true;
}

function isObject(object) {
  return object != null && typeof object === "object";
}
