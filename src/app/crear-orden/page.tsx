'use client'
import { useState } from 'react';
import { TextField, Button, Box, IconButton, Typography } from '@mui/material';
import { AddCircle, RemoveCircle } from '@mui/icons-material';
import { useRouter } from 'next/navigation'; // Importa el hook de enrutamiento de Next.js

export default function CreateOrder() {
  const [cliente, setCliente] = useState('');
  const [fechaCreacion, setFechaCreacion] = useState('');
  const [productos, setProductos] = useState([
    { id: 0, producto: '', cantidad: 0, precioUnitario: 0, subTotal: 0 },
  ]);

  const router = useRouter();

  // Función para manejar el cambio de cantidad
  const handleCantidadChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    const newProductos = [...productos];
    newProductos[index].cantidad = value;
    newProductos[index].subTotal = (value|0) * (newProductos[index].precioUnitario|0);
    setProductos(newProductos);
  };

  // Función para manejar el cambio de precio unitario
  const handlePrecioUnitarioChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    const newProductos = [...productos];
    newProductos[index].precioUnitario = value;
    newProductos[index].subTotal = (newProductos[index].cantidad|0) * (value|0);
    setProductos(newProductos);
  };

  // Función para agregar un nuevo producto
  const handleAddProduct = () => {
    setProductos([
      ...productos,
      { id: productos.length, producto: '', cantidad: 0, precioUnitario: 0, subTotal: 0 },
    ]);
  };

  // Función para eliminar un producto
  const handleRemoveProduct = (index: number) => {
    const newProductos = productos.filter((_, i) => i !== index);
    setProductos(newProductos);
  };

  // Función para enviar la orden a la API
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Obtener el token del localStorage
    const authToken = localStorage.getItem('authToken');

    if (!authToken) {
      console.error('No se encontró el token de autenticación');
      return; // Si no hay token, no continuar con la solicitud
    }

    // Convertir fechaCreacion a formato ISO 8601 con zona horaria UTC
    const formattedFechaCreacion = new Date(fechaCreacion).toISOString(); // Esto genera una fecha en formato 'YYYY-MM-DDTHH:mm:ss.sssZ'

    const orden = {
      id: 0,
      cliente,
      fechaCreacion: formattedFechaCreacion, // Usar la fecha formateada
      ordenCompraDetDtos: productos,
    };

    try {
      const response = await fetch('https://backendordencompra.azurewebsites.net/api/OrdenCompra/setordencompra', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`, // Agregar el token al header Authorization
        },
        body: JSON.stringify(orden), // Convertimos el objeto a JSON
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Orden creada con éxito', data);
        router.push('/test'); // Redirigir a la página de ordenes
      } else {
        console.error('Error al crear la orden:', response.status);
      }
    } catch (error) {
      console.error('Error en la solicitud:', error);
    }
  };

  // Función para regresar a la página principal
  const handleGoBack = () => {
    router.push("/"); // Redirige al home
  };

  return (
    <div style={{
      display: "flex", justifyContent: "center", alignItems: "center", margin: "auto", width: "100%", height: "100%",
      fontFamily: "Lato"
    }}>
      <div style={{ padding: '2rem', backgroundColor: '#f4f4f9', borderRadius: '8px', maxWidth: '600px', margin: '2rem', gap: "1rem", display: "flex", flexDirection: "column" }}>
        <span style={{ marginBottom: "2rem", fontWeight: "bold" }}>
          CREAR NUEVA ORDEN DE COMPRA
        </span>

        {/* Botón de Regresar */}
        <Button 
          variant="outlined" 
          color="primary" 
          onClick={handleGoBack} 
          sx={{ alignSelf: 'flex-start', marginBottom: '1rem' , color:"white", background:"black", border:"none" }}
        >
          Regresar
        </Button>

        <form onSubmit={handleSubmit}>
          <Box display="flex" flexDirection="column" gap={2} width="100%">
            <TextField
              label="CLIENTE"
              variant="outlined"
              value={cliente}
              onChange={(e) => setCliente(e.target.value)}
              required
              fullWidth
              sx={{ marginBottom: '1rem', height: "40px" }}
            />
            <TextField
              label="FECHA DE CREACION"
              variant="outlined"
              type="datetime-local"
              value={fechaCreacion}
              onChange={(e) => setFechaCreacion(e.target.value)}
              required
              InputLabelProps={{
                shrink: true,
              }}
              fullWidth
              sx={{ marginBottom: '1rem', height: "40px", fontSize: "12px" }}
            />
            {productos.map((producto, index) => (
              <Box key={index} display="flex" flexDirection="column" gap={2}>
                <span>PRODUCTO</span>
                <TextField
                  label="PRODUCTO"
                  variant="outlined"
                  value={producto.producto}
                  onChange={(e) => {
                    const newProductos = [...productos];
                    newProductos[index].producto = e.target.value;
                    setProductos(newProductos);
                  }}
                  required
                  fullWidth
                  sx={{ marginBottom: '1rem', height: "40px" }}
                />
                <TextField
                  label="CANTIDAD"
                  variant="outlined"
                  type="number"
                  value={producto.cantidad}
                  onChange={(e: any) => handleCantidadChange(index, e)}
                  required
                  fullWidth
                  sx={{ marginBottom: '1rem', height: "40px" }}
                />
                <TextField
                  label="PRECIO UNITARIO"
                  variant="outlined"
                  type="number"
                  value={producto.precioUnitario}
                  onChange={(e: any) => handlePrecioUnitarioChange(index, e)}
                  required
                  fullWidth
                  sx={{ marginBottom: '1rem', height: "40px" }}
                />
                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                    SubTotal: {producto.subTotal}
                  </Typography>
                  {productos.length > 1 && (
                    <IconButton color="error" onClick={() => handleRemoveProduct(index)}>
                      <RemoveCircle />
                    </IconButton>
                  )}
                </Box>
              </Box>
            ))}

            <Button
              variant="outlined"
              color="primary"
              onClick={handleAddProduct}
              sx={{ marginTop: '1rem', marginBottom: '1rem', width: '200px', marginLeft: 'auto', display: 'block' , color:"white",background:"black", border:"none"}}
            >
              Agregar Producto
            </Button>

            <Button
              type="submit"
              variant="contained"
              sx={{
                backgroundColor: "black",
                color: "white",
                marginTop: '1rem',
                width: '100%',
                padding: '12px',
                '&:hover': {
                  backgroundColor: '#333',
                }
              }}
            >
              Crear Orden
            </Button>
          </Box>
        </form>
      </div>
    </div>
  );
}
