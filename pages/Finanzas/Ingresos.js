import MaterialTable from "material-table";
import { MongoClient } from "mongodb";
import BotonAñadir from "@/components/BotonAnadir/BotonAnadir";
import { withSSRContext } from "aws-amplify";
import { useEffect, useState } from "react";

export default function Ingresos({ DatosIngreso, DatosEgreso, Reportes }) {
  // console.log(DatosIngreso)
  const [datoTablaIngreso, setDatoTablaIngreso] = useState();
  const [datoTablaEgreso, setDatoTablaEgreso] = useState();
  const [
    datoTablaEgresoAdministrativo,
    setDatoTablaEgresoAdministrativo
  ] = useState();
  /*Estados de para calculra los valores de finanzas*/
  // const [comision, setComision] = useState()
  const [nPasajeros, setNPasajeros] = useState();
  const [adelantoNeto, setAdelantoNeto] = useState();

  const [sumaAdelantoNeto, setSumaAdelantoNeto] = useState();
  const [sumaTotalDolares, setSumaTotalDolares] = useState();

  const [datoFechaSeleccionado, setFechaSeleccionado] = useState("nofecha");

  let ColumnasIngresos = [
    { title: "ID", field: "IdIngreso", hidden: true },
    { title: "Fecha de Inicio", field: "FechaInicio", type: "date" },
    { title: "Codigo Grupo", field: "CodGrupo" },
    { title: "Nombre Grupo", field: "NombreGrupo" },
    { title: "Nro. Pasajeros", field: "Npasajeros", type: "numeric" },
    { title: "N° Voucher Servicios", field: "NVoucherServ" },
    { title: "Fecha Entrega", field: "FecEntrega", type: "date" },
    { title: "Cuenta", field: "Cuenta" },
    { title: "Total", field: "Total", type: "numeric" },
    { title: "Comision", field: "Comision" },
    { title: "Total Neto", field: "SumaTotalNeto", editable: "never" },
    { title: "Adelanto", field: "Adelanto", type: "numeric" },
    { title: "Adelanto Neto", field: "AdelantoNeto", editable: "never" },
    { title: "Saldo", field: "Saldo", editable: "never" }
  ];
  let ColumnasEgresosOperativos = [
    { title: "ID", field: "IdEgreso", hidden: true },
    { title: "FechaGasto", field: "FechaGasto", type: "date" },
    { title: "Soles", field: "Soles", type: "numeric" },
    { title: "Dolares", field: "Dolares", type: "numeric" },
    { title: "Tasa", field: "TasaCambio", type: "numeric" },
    { title: "Total Dolares", field: "TotalDolares", editable: "never" },
    { title: "Saldo Actual", field: "SaldoActual", editable: "never" },
    { title: "Utilidad Operario", field: "UtilOpera", editable: "never" }
  ];
  useEffect(() => {
    let x = 0;
    let datos_egreso_fecha = [];
    let datos_ingreso_fecha = DatosIngreso.find((value, index, obj) => {
      let fecha = new Date(value.FechaInicio);
      // fecha = Date.parse()
      x = fecha.getMonth() + 1;
      if (x == datoFechaSeleccionado) {
        datos_egreso_fecha.push(DatosEgreso[index]);
      }
      return x == datoFechaSeleccionado;
    });
    if (datos_ingreso_fecha == undefined) {
      datos_ingreso_fecha = [];
    }
    setDatoTablaIngreso([datos_ingreso_fecha]);
    setDatoTablaEgreso(datos_egreso_fecha);
  }, [datoFechaSeleccionado]);

  useEffect(() => {
    let sumIngreso = 0;
    let sumEgreso = 0;
    DatosIngreso.map((x, index) => {
      let y = parseInt(DatosEgreso[index].TotalDolares);
      sumIngreso = sumIngreso + x.AdelantoNeto;
      sumEgreso = sumEgreso + y;
    });
    setSumaAdelantoNeto(sumIngreso);
    setSumaTotalDolares(sumEgreso);
  }, [datoTablaIngreso]);

  function PasarSuma() {
    let x = {};
    x = { SumaAdelantoNeto: sumaAdelantoNeto, SumaTotalNeto: sumaTotalDolares };
    fetch(`http://localhost:3000/api/finanzas/reportesfinanzas`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        idProducto: Reportes[0].IdReporteFinanza,
        data: x,
        accion: "update"
      })
    })
      .then((r) => r.json())
      .then((data) => {
        alert(data.message);
      });
  }
  return (
    <div>
      <form>
        <select onChange={(e) => setFechaSeleccionado(e.target.value)}>
          <option selected value="">
            Seleccione filtro
          </option>
          <option value="1">Enero</option>
          <option value="2">Febrero</option>
          <option value="3">Marzo</option>
          <option value="4">Abril</option>
          <option value="5">Mayo</option>
          <option value="6">Junio</option>
          <option value="7">Julio</option>
          <option value="8">Agosto</option>
          <option value="9">Septiembre</option>
          <option value="10">Octubre</option>
          <option value="11">Noviembre</option>
          <option value="12">Diciembre</option>
        </select>
      </form>
      Este es Ingreso
      <MaterialTable
        title="Ingresos"
        data={datoTablaIngreso}
        columns={ColumnasIngresos}
        editable={{
          onRowAdd: (newData) =>
            new Promise((resolve, reject) => {
              setTimeout(() => {
                fetch(`http://localhost:3000/api/finanzas/ingresos`, {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    data: newData,
                    accion: "create"
                  })
                })
                  .then((r) => r.json())
                  .then((data) => {
                    alert(data.message);
                  });
                setDatoTablaIngreso([...datoTablaIngreso, newData]);

                resolve();
              }, 1000);
            }),
          onRowUpdate: (newData, oldData) =>
            new Promise((resolve, reject) => {
              setTimeout(() => {
                let comision = newData.Total * 0.1;
                let totalNeto = newData.Total - comision;
                let adelantoNeto = newData.Adelanto - comision;
                let saldo = totalNeto - adelantoNeto;

                let y = {};
                let calc = {
                  Comision: comision,
                  TotalNeto: totalNeto,
                  AdelantoNeto: adelantoNeto,
                  Saldo: saldo
                };
                const dataUpdate = [...datoTablaIngreso];
                const index = oldData.tableData.id;

                y = Object.assign(newData, calc);

                dataUpdate[index] = y;

                setDatoTablaIngreso([...dataUpdate]);

                fetch(`http://localhost:3000/api/finanzas/ingresos`, {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    idProducto: dataUpdate[index].IdIngreso,
                    data: dataUpdate[index],
                    accion: "update"
                  })
                })
                  .then((r) => r.json())
                  .then((data) => {
                    alert(data.message);
                  });

                setAdelantoNeto(adelantoNeto);
                setNPasajeros(newData.Npasajeros);

                resolve();
              }, 1000);
            })
        }}
        options={{
          actionsColumnIndex: -1
        }}
      />
      <MaterialTable
        title="Egresos Operativos"
        data={datoTablaEgreso}
        columns={ColumnasEgresosOperativos}
        editable={{
          onRowAdd: (newData) =>
            new Promise((resolve, reject) => {
              setTimeout(() => {
                fetch(`http://localhost:3000/api/finanzas/egresos`, {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    data: newData,
                    accion: "create"
                  })
                })
                  .then((r) => r.json())
                  .then((data) => {
                    alert(data.message);
                  });
                setDatoTablaEgreso([...datoTablaEgreso, newData]);

                resolve();
              }, 1000);
            }),
          onRowUpdate: (newData, oldData) =>
            new Promise((resolve, reject) => {
              setTimeout(() => {
                let totalDolares =
                  newData.Soles / newData.TasaCambio + newData.Dolares;
                let saldoActual = adelantoNeto - totalDolares;
                let utilOperador = 50 * nPasajeros;
                let y = {};
                let x = {};
                console.log(totalDolares);

                let calc = {
                  TotalDolares: totalDolares.toFixed(2),
                  SaldoActual: saldoActual.toFixed(2),
                  UtilOpera: utilOperador.toFixed(2)
                  // SumaTotalDolares: sumaTotalDolares,
                  // SumaAdelantoNeto: sumaAdelantoNeto
                };
                const dataUpdate = [...datoTablaEgreso];
                const index = oldData.tableData.id;

                y = Object.assign(newData, calc);

                dataUpdate[index] = y;

                setDatoTablaEgreso([...dataUpdate]);

                fetch(`http://localhost:3000/api/finanzas/egresos`, {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    idProducto: dataUpdate[index].IdEgreso,
                    data: dataUpdate[index],
                    accion: "update"
                  })
                })
                  .then((r) => r.json())
                  .then((data) => {
                    alert(data.message);
                  });

                resolve();
              }, 1000);
            })
        }}
        options={{
          actionsColumnIndex: -1
        }}
      />
    </div>
  );
}
export async function getServerSideProps({ req, res }) {
  const url = process.env.MONGODB_URI;
  const dbName = process.env.MONGODB_DB;

  let DatosEgreso = [];
  let DatosIngreso = [];
  let Reportes = [];

  const { Auth } = withSSRContext({ req });
  try {
    const user = await Auth.currentAuthenticatedUser();
  } catch (err) {
    res.writeHead(302, { Location: "/" });
    res.end();
  }

  let client = new MongoClient(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });

  /* Consulta para extraer los datos de Clientes */
  try {
    let client = new MongoClient(url, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    client = new MongoClient(url, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    await client.connect();
    const dbo = client.db(dbName);
    const collection = dbo.collection("Ingreso");

    let result = await collection
      .find({})
      .project({
        _id: 0
      })
      .toArray();
    DatosIngreso = result;
  } catch (error) {
    console.log("error - " + error);
  } finally {
    client.close();
  }
  try {
    let client = new MongoClient(url, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    client = new MongoClient(url, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    await client.connect();
    const dbo = client.db(dbName);
    const collection = dbo.collection("Egreso");

    let result = await collection
      .find({})
      .project({
        _id: 0
      })
      .toArray();
    DatosEgreso = result;
  } catch (error) {
    console.log("error - " + error);
  } finally {
    client.close();
  }

  try {
    let client = new MongoClient(url, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    client = new MongoClient(url, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    await client.connect();
    const dbo = client.db(dbName);
    const collection = dbo.collection("ReportesFinanzas");

    let result = await collection
      .find({})
      .project({
        _id: 0
      })
      .toArray();
    Reportes = result;
  } catch (error) {
    console.log("error - " + error);
  } finally {
    client.close();
  }

  return {
    props: {
      DatosIngreso: DatosIngreso,
      DatosEgreso: DatosEgreso,
      Reportes: Reportes
    }
  };
}
