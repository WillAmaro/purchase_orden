'use client'

import { useEffect, useState } from "react";
import OrderDetailView from "./View";

export default function OrderDetailContainer({ orderId }: { orderId: string }) {
    const [data, setData] = useState<any>({}); // Inicialmente no tenemos datos
    const [loading, setLoading] = useState(true); // Para saber si estamos cargando los datos
    const [error, setError] = useState<string | null>(null); // Para manejar errores
  
    // Cargar datos cuando el componente se monte
    useEffect(() => {
      const fetchOrderData = async () => {
        try {
          // Suponiendo que 'authToken' está almacenado en localStorage
          const authToken = localStorage.getItem('authToken');
          if (!authToken) {
            throw new Error('No se encontró el token de autenticación');
          }
  
          const response = await fetch(`https://backendordencompra.azurewebsites.net/api/OrdenCompra/getordencompra/${orderId}`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${authToken}`,
            },
          });
  
          if (!response.ok) {
            throw new Error(`Error al obtener los detalles de la orden: ${response.status}`);
          }
  
          const fetchedData = await response.json();
          setData(fetchedData.data); // Suponiendo que la respuesta contiene un objeto 'data'
        } catch (error) {
          setError('Hubo un error al cargar los datos');
          console.error('Error:', error);
        } finally {
          setLoading(false); // Ya sea exitoso o no, dejamos de cargar
        }
      };
  
      fetchOrderData();
    }, [orderId]);
  
    // Mostrar loading o error si es necesario

    // Una vez que tengamos los datos, los pasamos a OrderDetailView
    return <OrderDetailView data={data} />;
  }