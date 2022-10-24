import { SystemLogUsecase } from "@/src/application/usecases/systemLog.usecase";
import { ironOptions } from "@/utils/config";
import { systemLogInterface } from "@/utils/interfaces/db";
import axios from "axios";
import { withIronSessionSsr } from "iron-session/next";
import * as uuid from "uuid";

//interfaces
interface logsListColums extends systemLogInterface {
  id: string;
}
interface props {
  LogsList: logsListColums[];
}

// Estilos
import globalStyles from "@/globalStyles/modules/global.module.css";
import styles from "@/globalStyles/SystemLog.module.css";
import botones from "@/globalStyles/modules/boton.module.css";
import { Box } from "@mui/material";
import { DataGrid, GridColumns } from "@mui/x-data-grid";
import { useEffect, useState } from "react";

export default function SystemLog({ LogsList }: props) {
  const [LogListData, setLogListData] = useState<any>([]);
  useEffect(() => {
    setLogListData(LogsList.map(val=>{
      return{
        id:val.id,
        IdSystemLog:val.IdSystemLog,
        User: val.User.Email,
        Accion: val.Accion,
        Descripcion: val.Descripcion,
        CreatedAt: val.CreatedAt
      }
    }))
  }, [LogsList]);
  const columnasProgramasTuristicosSeleccionadosDatagrid: GridColumns<any> = [
    {
      field: "IdSystemLog",
      headerName: "Id"
    },
    {
      field: "User",
      headerName: "User",
      width: 200
    },
    {
      field: "Accion",
      headerName: "Accion"
    },
    {
      field: "Descripcion",
      headerName: "Descripcion",
      width: 400
    },
    {
      field: "CreatedAt",
      headerName: "Fecha creacion",
      width: 200
    }
  ];
  return (
    <div className={`${globalStyles.main_work_space_container}`}>
      <div className={`${globalStyles.title_and_buttons_container}`}>
        <h1>Logs de sistema</h1>
      </div>
      <Box sx={{ height: 400, width: "100%" }}>
        <DataGrid
          rows={LogListData}
          columns={columnasProgramasTuristicosSeleccionadosDatagrid}
          pageSize={10}
          rowsPerPageOptions={[5]}
          componentsProps={{ columnMenu: true }}
        />
      </Box>
    </div>
  );
}

export const getServerSideProps = withIronSessionSsr(
  async function getServerSideProps({ req, res }) {
    const user = req.session.user;
    if (!user) {
      return {
        redirect: {
          permanent: false,
          destination: "/login"
        }
      };
    }

    if (user.tipoUsuario !== "Administrador") {
      return {
        redirect: {
          permanent: false,
          destination: "/Home"
        }
      };
    }

    const log = new SystemLogUsecase();
    const LogsListWitoutId = await log.list();
    const LogsList = LogsListWitoutId.map((val) => {
      return {
        _id: "",
        id: uuid.v1(),
        ...val
      };
    });
    return {
      props: {
        LogsList: LogsList
      }
    };
  },
  ironOptions
);
