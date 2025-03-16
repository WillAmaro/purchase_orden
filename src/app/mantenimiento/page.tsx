"use client";
import { DataGrid } from "@mui/x-data-grid/DataGrid";
import styles from "./page.module.css";
import { GridColDef } from "@mui/x-data-grid";
import { useEffect, useMemo, useState } from "react";
import BaseIcon from "./IconButton";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
export type DataGridRowActionProps = {
  show: boolean;
  onClick: (props: any) => void;
  disabled?: boolean;
  loading?: boolean;
};
import FileDownloadRoundedIcon from "@mui/icons-material/FileDownloadRounded";
import DownloadDoneRoundedIcon from "@mui/icons-material/DownloadDoneRounded";
import VisibilityIcon from "@mui/icons-material/Visibility";

import HighlightOffOutlinedIcon from "@mui/icons-material/HighlightOffOutlined";
export type DataGridRowActionCustomizeProps = {
  show: boolean;
  onClick: (props: any) => void;
  disabled?: boolean;
  loading?: boolean;
  disabledStatuses?: number[];
};
import { Button, CircularProgress, Typography } from "@mui/material";
import { useRouter } from "next/navigation";

export type DataGridRowActionsProps = {
  // [key:string] : DataGridRowActionProps
  edit?: DataGridRowActionProps;
  export?: DataGridRowActionProps;
  confirm?: DataGridRowActionCustomizeProps;
  refused?: DataGridRowActionCustomizeProps;
  watch?: DataGridRowActionProps;
  delete?: DataGridRowActionProps;
};

export default function Page() {
  const [list, setList] = useState<any[]>([]);
  const router = useRouter()
  // Función para obtener todas las ordenes de compra utilizando el token
  const getOrdenCompras = async () => {
    const token = localStorage.getItem("authToken"); // Obtener el token del localStorage

    if (!token) {
      console.error("No se encontró el token en el localStorage");
      return;
    }

    try {
      const response = await fetch(
        "https://backendordencompra.azurewebsites.net/api/OrdenCompra/getallordencompra?currentPage=1&pageSize=100&filterValue=w&filterBy=1",
        {
          method: "POST", // Petición GET
          headers: {
            Authorization: `Bearer ${token}`, // Agregar el token en el encabezado Authorization
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setList(data.data.data);
      } else {
        console.error("Error en la solicitud:", response.status);
      }
    } catch (error) {
      console.error("Error en la solicitud:", error);
    }
  };

  console.log("Datos de orden de compra:", list);

  const login = async () => {
    // Datos a enviar en el cuerpo de la solicitud POST
    const requestBody = {
      userName: "aawilliam15@gmail.com",
      password: "user.BYS.2@21",
    };

    try {
      // Realizando el fetch con el método POST
      const response = await fetch(
        "https://backendordencompra.azurewebsites.net/api/ServiceAccount/login",
        {
          method: "POST", // Configuramos el método como POST
          headers: {
            "Content-Type": "application/json", // Especificamos que estamos enviando JSON
          },
          body: JSON.stringify(requestBody), // Convertimos el objeto a JSON
        }
      );

      // Si la respuesta es exitosa, la procesamos
      if (response.ok) {
        const data = await response.json(); // Aquí puedes manejar la respuesta

        // Asumiendo que la respuesta contiene un campo 'token'
        const token = data.data.token; // Ajusta según el campo real en la respuesta

        if (token) {
          // Almacenar el token en el localStorage
          localStorage.setItem("authToken", token);
          document.cookie = `authToken=${token}; path=/; secure; samesite=strict;`;

          getOrdenCompras();
          // O puedes usar sessionStorage si prefieres que el token se elimine cuando se cierre el navegador
          // sessionStorage.setItem("authToken", token);

          console.log("Token almacenado:", token);

          // Actualiza el estado si es necesario
          setList(data);
        } else {
          console.error("No se recibió un token en la respuesta.");
        }
      } else {
        console.error("Error en la solicitud:", response.status);
      }
    } catch (error) {
      console.error("Error en la solicitud:", error);
    }
  };

  useEffect(() => {
    login();
  }, []);

  const formatToDate = (value: Date): string => {
    const dateFormatter = new Intl.DateTimeFormat("es-ES", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
    const formattedDate = dateFormatter.format(value);
    return formattedDate;
  };

  const columns: GridColDef<[number]>[] = [
    { field: "id", headerName: "ID", width: 90 },
    {
      field: "cliente",
      headerName: "CLIENTE",
      width: 150,
      editable: true,
      flex: 1,
    },
    {
      field: "fechaCreacion",
      headerName: "FECHA CREACION",
      width: 150,
      editable: true,
      valueGetter: (value: string) => {
        if (value) return new Date(value);
      },
      valueFormatter: (value: Date) => {
        if (value) return formatToDate(value);
      },
    },
  ];

  const onEdit = () => {};
  const onView = (item:any) => {
    router.push(`/ver-orden/${item.id}`)
  };
  const onDelete = async (item: any) => {
    console.log(item);
    
    // Obtener el token del localStorage
    const authToken = localStorage.getItem('authToken');
    
    if (!authToken) {
      console.error('No se encontró el token de autenticación');
      return;
    }
  
    try {
      // Construir la URL para el pedido específico
      const url = `https://backendordencompra.azurewebsites.net/api/OrdenCompra/deleteordencompra/${item.id}`;
  
      // Realizar la solicitud DELETE
      const response = await fetch(url, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${authToken}`,  // Agregar el token al header Authorization
          'Content-Type': 'application/json',
        },
      });
  
      if (response.ok) {
        const data = await response.json();
        getOrdenCompras()
        console.log('Producto eliminado con éxito:', data);
        // Puedes agregar alguna lógica para actualizar la interfaz, como recargar la lista
      } else {
        console.error('Error al eliminar el producto:', response.status);
      }
    } catch (error) {
      console.error('Error en la solicitud de eliminación:', error);
    }
  };
  
  const rowActions: DataGridRowActionsProps = {
    edit: {
      show: true,
      onClick: onEdit,
      disabled: false,
    },

    watch: {
      show: true,
      onClick: onView,
    },
    delete: {
      show: true,
      onClick: onDelete,
      disabled: false,
    },
  };

  const headCellsByUser = useMemo(() => {
    if (Object.keys(rowActions).length > 0) {
      const WIDTH_PER_ACTION = 50;
      let width = Object.keys(rowActions).length * WIDTH_PER_ACTION;
      return [
        ...columns,
        ...[
          {
            field: "actions",
            type: "actions",
            width: width,
            getActions: (params: any) => {
              let actions: any[] = [];

              if (rowActions.edit?.show) {
                const editAct = (
                  <BaseIcon
                    disabled={false}
                    onPress={() => rowActions.edit?.onClick(params.row)}
                    hoverBgColor="primary.contrastText"
                  >
                    <EditIcon
                      fontSize="medium"
                      sx={{
                        "&:hover": {
                          fill: "black",
                        },
                      }}
                    />
                  </BaseIcon>
                );
                actions.push(editAct);
              }

              if (rowActions.export?.show) {
                const exportAct = (
                  <BaseIcon
                    onPress={() => rowActions.export?.onClick(params.row)}
                    disabled={rowActions.export?.disabled}
                    hoverBgColor="primary.contrastText"
                  >
                    {rowActions.export?.loading ? (
                      <CircularProgress
                        size={25}
                        color="secondary"
                        sx={{
                          "& .hover": {
                            background: "primary.contrastText",
                          },
                        }}
                      />
                    ) : (
                      <FileDownloadRoundedIcon
                        sx={{
                          "&:hover": {
                            fill: "black",
                          },
                        }}
                      />
                    )}
                  </BaseIcon>
                );
                actions.push(exportAct);
              }

              if (rowActions.confirm?.show) {
                const confirmAct = (
                  <BaseIcon
                    disabled={
                      rowActions?.confirm.disabled ||
                      (rowActions?.confirm?.disabledStatuses ?? []).includes(
                        params.row.status
                      )
                      // params.row.status === Status.Confirmed ||
                      // params.row.status === Status.Approved ||
                      // params.row.status === Status.Accounted
                    }
                    onPress={() => rowActions.confirm?.onClick(params.row)}
                    hoverBgColor="primary.contrastText"
                  >
                    {
                      <DownloadDoneRoundedIcon
                        sx={{
                          "&:hover": {
                            fill: "black",
                          },
                        }}
                      />
                    }
                  </BaseIcon>
                );
                actions.push(confirmAct);
              }

              if (rowActions.watch?.show) {
                const watchAct = (
                  <BaseIcon
                    disabled={rowActions?.watch.disabled}
                    hoverBgColor="primary.contrastText"
                    onPress={() => rowActions.watch?.onClick(params.row)}
                  >
                    <VisibilityIcon />
                  </BaseIcon>
                );
                actions.push(watchAct);
              }

              if (rowActions.refused?.show) {
                const refusedAct = (
                  <BaseIcon
                    onPress={() => rowActions.refused?.onClick(params.row)}
                    hoverBgColor="primary.contrastText"
                    disabled={
                      rowActions.refused?.disabled ||
                      (rowActions.refused?.disabledStatuses ?? []).includes(
                        params.row.status
                      )

                      // params.row.status !== Status.Confirmed
                    }
                  >
                    <HighlightOffOutlinedIcon
                      fontSize="medium"
                      sx={{
                        "&:hover": {
                          fill: "black",
                        },
                      }}
                    />
                  </BaseIcon>
                );
                actions.push(refusedAct);
              }

              if (rowActions.delete?.show) {
                const deleteAct = (
                  <BaseIcon
                    onPress={() => rowActions.delete?.onClick(params.row)}
                    hoverBgColor="primary.contrastText"
                    disabled={false}
                  >
                    <DeleteIcon
                      fontSize="medium"
                      sx={{
                        "&:hover": {
                          fill: "black",
                        },
                      }}
                    />
                  </BaseIcon>
                );
                actions.push(deleteAct);
              }

              return actions;
            },
          },
        ],
      ];
    }
    return columns;
  }, [columns, rowActions]);

  return (
    <div className={styles.page}>
      <div
        style={{
          width: "100%",
          display: "flex",
          flexDirection: "column",
          gap: "1rem",
        }}
      >
        <Button
          aria-label="A"
          sx={{
            background: "black",
            color: "white",
            width: "200px",
          }}

          onClick={()=>{router.push("/crear-orden")}}
        >
          AGREGAR NUEVA ORDEN
        </Button>
        <DataGrid
          rows={list}
          columns={headCellsByUser as any}
          initialState={{
            pagination: {
              paginationModel: {
                pageSize: 5,
              },
            },
          }}
          pageSizeOptions={[5]}
          checkboxSelection
          disableRowSelectionOnClick
        />
      </div>
    </div>
  );
}
