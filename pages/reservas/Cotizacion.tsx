// Paquetes
import { ironOptions } from "@/utils/config";
import { withIronSessionSsr } from "iron-session/next";
import { useState } from "react";
import { useRouter } from "next/router";

// Interfaces
import {
  clienteProspectoInterface,
  programaTuristicoInterface,
  reservaCotizacionInterface
} from "@/utils/interfaces/db";

// Componentes
import Fase1 from "@/components/ComponentesUnicos/Reservas/Cotizacion/Fase_1";
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
    </div>
  );
}

export const getServerSideProps = withIronSessionSsr(
  async function getServerSideProps({ req, res, query }) {
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
