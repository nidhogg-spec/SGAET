import MaterialTable from "material-table";
import React, { useState, useEffect } from "react";

const TablaDevolucion = (
  {
    Data,
    setData,
    callback_create,
    callback_delete,
    callback_update,
  }
) => {
    const columns=[
        { title: 'Descripcion', field: 'Descripcion' },
        { title: 'Devolucion', field: 'Devolucion', type:'currency',currencySetting:'PEN' },
    ]
  return (
    <>
      <MaterialTable
        columns={columns}
        data={Data}
        title={"Devoluciones"}
        editable={{
          onRowAdd: (newData) =>
            new Promise((resolve, reject) => {
              setTimeout(() => {
                setData([...Data, newData]);
                if (callback_create != null) callback_create();
                resolve();
              }, 1000);
            }),
          onRowUpdate: (newData, oldData) =>
            new Promise((resolve, reject) => {
              setTimeout(() => {
                const dataUpdate = [...Data];
                const index = oldData.tableData.id;
                dataUpdate[index] = newData;
                setData([...dataUpdate]);
                if (callback_update != null) callback_update();
                resolve();
              }, 1000);
            }),
          onRowDelete: (oldData) =>
            new Promise((resolve, reject) => {
              setTimeout(() => {
                const dataDelete = [...Data];
                const index = oldData.tableData.id;
                dataDelete.splice(index, 1);
                setData([...dataDelete]);
                if (callback_delete != null) callback_delete();
                resolve();
              }, 1000);
            }),
        }}
      />
    </>
  );
};

export default TablaDevolucion;
