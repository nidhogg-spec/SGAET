// componentes
import { Snackbar, Alert, AlertColor } from "@mui/material";
import React, { useState } from "react";

// Interfaces
export interface alertViewerData {
  show: boolean;
  aletType: AlertColor;
  message: string;
}
interface props {
  alertViewerData: alertViewerData;
  setData: React.Dispatch<React.SetStateAction<alertViewerData>>;
}

export function AlertViewer({ alertViewerData, setData }: props) {
  // const [open, setOpen] = useState(false);
  const handleClose = (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }
    setData({
      ...alertViewerData,
      show: false
    });
  };
  return (
    <>
      <Snackbar
        open={alertViewerData.show}
        autoHideDuration={6000}
        onClose={handleClose}
        sx={{
          "& .MuiPaper-root": {
            backgroundColor: "#d32f2f",
            color: "white"
          }
        }}
      >
        <Alert
          onClose={handleClose}
          severity={alertViewerData.aletType}
          variant="filled"
        >
          {alertViewerData.message}
        </Alert>
      </Snackbar>
    </>
  );
}
