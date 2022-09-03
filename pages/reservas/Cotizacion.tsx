// Paquetes
import { ironOptions } from "@/utils/config";
import { withIronSessionSsr } from "iron-session/next";
import { useState } from "react";
import { useRouter } from "next/router";
import { resetServerContext } from "react-beautiful-dnd";

// Interfaces
import {
  clienteProspectoInterface,
  programaTuristicoInterface,
  reservaCotizacionInterface
} from "@/utils/interfaces/db";

// Componentes
import Fase1 from "@/components/ComponentesUnicos/Reservas/Cotizacion/Fase_1";
import Fase2 from "@/components/ComponentesUnicos/Reservas/Cotizacion/Fase_2";
import Fase3 from "@/components/ComponentesUnicos/Reservas/Cotizacion/Fase_3";
import Loader from "@/components/Loading/Loading";

// Estilos
import styles from "@/globalStyles/Cotizacion.module.css";
import botones from "@/globalStyles/modules/boton.module.css";
import globalStyles from "@/globalStyles/modules/global.module.css";


export default function RealizarCotizacion() {
  const router = useRouter();
  const [Loading, setLoading] = useState(false);
  const [Fase, setFase] = useState(1);
  const [cliente, setcliente] = useState<clienteProspectoInterface>(
    {} as clienteProspectoInterface
  );
  const [Cotizacion, setCotizacion] = useState<reservaCotizacionInterface>();

  return (
    <div
      className={`${globalStyles.main_work_space_container} ${styles.mainContainer}`}
    >
      <Loader Loading={Loading} />
      <h1>Generacion de nueva reserva/cotizacion</h1>
      <Fase1
        open={false}
        setOpen={() => {}}
        fase={Fase}
        setFase={setFase}
        clienteProspecto={cliente}
        setClienteProspecto={setcliente as any}
      />
      <Fase2
        fase={Fase}
        setFase={setFase}
        Cotizacion={Cotizacion}
        setCotizacion={setCotizacion}
        ClienteProspecto={cliente}
      />
      <Fase3
        fase={Fase}
        setFase={setFase}
        Cotizacion={Cotizacion}
        setCotizacion={setCotizacion}
        ClienteProspecto={cliente}
      />
    </div>
  );
}

export const getServerSideProps = withIronSessionSsr(
  async function getServerSideProps({ req, res, query }) {
    resetServerContext();
    const user = req.session.user;
    if (!user) {
      return {
        redirect: {
          permanent: false,
          destination: "/login"
        }
      };
    }
    //---------------------------------------------------------------------------------------------------------------------

    const APIpath = process.env.API_DOMAIN;
    // const APIpathGeneral = process.env.API_DOMAIN + "/api/general";

    return {
      props: {
        APIpath: APIpath
        // APIpathGeneral: APIpathGeneral,
      }
    };
  },
  ironOptions
);
