import AutoFormulario from "@/components/Formulario_V2/AutoFormulario/AutoFormulario";
import React, { useState, useEffect } from "react";

export default function Prueba() {
  const [Prueba_array, setPrueba_array] = useState({texto7:[]});
  return (
    <div>
      <AutoFormulario
        Formulario={{
          title: "Prueba de guardado de datos",
          secciones: [
            {
              subTitle: "Datos",
              componentes: [
                {
                  tipo: "texto",
                  Title: "texto",
                  KeyDato: "texto1",
                },
                {
                  tipo: "fecha",
                  Title: "texto",
                  KeyDato: "texto2",
                },
                {
                  tipo: "granTexto",
                  Title: "texto",
                  KeyDato: "texto3",
                },
                {
                  tipo: "selector",
                  Title: "texto",
                  KeyDato: "texto4",
                  SelectOptions: [{ value: "valor", texto: "hola" }],
                },
                {
                  tipo: "numero",
                  Title: "texto",
                  KeyDato: "texto5",
                  InputStep: 1,
                },
                {
                  tipo: "money",
                  Title: "texto",
                  KeyDato: "texto6",
                },
                {
                  tipo: "tablaSimple",
                  Title: "texto",
                  KeyDato: "texto7",
                  columnas: [
                    { title: "Name", field: "name" },
                    { title: "Surname", field: "surname" },
                  ],
                },
              ],
            },
          ],
        }}
        ModoEdicion={true}
        Dato={Prueba_array}
        setDato={setPrueba_array}
      />
    </div>
  );
}
