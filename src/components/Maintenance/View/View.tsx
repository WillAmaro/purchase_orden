'use client'

import { Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button } from '@mui/material';
import { useRouter } from 'next/navigation';

interface Product {
  id: number;
  producto: string;
  cantidad: number;
  precioUnitario: number;
  subTotal: number;
}

interface OrderDetailProps {
  data: {
    id: number;
    cliente: string;
    fechaCreacion: string;
    ordenCompraDetDtos: Product[];
  };
}

export default function OrderDetailView({ data }: OrderDetailProps) {
  const router = useRouter(); // Obtén el router
  console.log(data,"<->")
  // Desestructuramos directamente la data
  const { id, cliente, fechaCreacion, ordenCompraDetDtos } = data;

  // Convertir la fecha en un formato legible
  const formattedFechaCreacion = new Date(fechaCreacion).toLocaleString();

  // Función para regresar a la página principal
  const handleGoBack = () => {
    router.push("/"); // Redirige al home
  };

  return (
    <div style={{ padding: "20px", display: "flex", flexDirection: "column", gap: "1rem" }}>
         <Button 
        variant="outlined" 
        color="primary" 
        onClick={handleGoBack} 
        sx={{ alignSelf: 'flex-start', marginBottom: '1rem', color:"white",background:"black" }}
      >
        Regresar
      </Button>
      <span style={{ fontSize: "20px", textTransform: "uppercase", fontWeight: "bold", paddingBottom: "2rem" }}>
        Detalles de la Orden de Compra
      </span>
      
      {/* Botón de Regresar */}
     

      <div style={{ backgroundColor: '#f7f7f7', padding: 3, borderRadius: 2 }}>
        <Typography variant="h6" color="primary">INFORMACION GENERAL:</Typography>
        <Typography><strong>ID de la Orden:</strong> {id}</Typography>
        <Typography><strong>Cliente:</strong> {cliente}</Typography>
        <Typography><strong>Fecha de Creación:</strong> {formattedFechaCreacion}</Typography>
      </div>

      <Box mb={3}>
        <Typography variant="h6" color="primary">PRODUCTOS:</Typography>
        <Paper sx={{ borderRadius: 2, overflow: 'hidden' }}>
          <TableContainer>
            <Table>
              <TableHead sx={{ backgroundColor: '#f0f0f0' }}>
                <TableRow>
                  <TableCell><strong>Producto</strong></TableCell>
                  <TableCell><strong>Cantidad</strong></TableCell>
                  <TableCell><strong>Precio Unitario</strong></TableCell>
                  <TableCell><strong>SubTotal</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {ordenCompraDetDtos?.length > 0 ? (
                  ordenCompraDetDtos.map((producto) => (
                    <TableRow key={producto.id}>
                      <TableCell>{producto.producto}</TableCell>
                      <TableCell>{producto.cantidad}</TableCell>
                      <TableCell>{producto.precioUnitario.toFixed(2)}</TableCell>
                      <TableCell>{producto.subTotal.toFixed(2)}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} align="center" sx={{ color: '#888' }}>
                      No hay productos disponibles
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Box>
    </div>
  );
}
