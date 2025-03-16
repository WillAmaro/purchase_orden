import { cookies } from 'next/headers'; // Importar cookies desde next/headers
import OrderDetailView from "@/components/Maintenance/View/View";
import ViewContainer from '@/components/Maintenance/View/Content';

// Función para obtener los detalles de la orden por su ID
async function getAgreementById(agreementId: any, authToken: string) {
  try {
    const response = await fetch(`https://backendordencompra.azurewebsites.net/api/OrdenCompra/getordencompra/${agreementId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`, // Usar el token de autenticación
      },
    });

    if (!response.ok) {
      throw new Error(`Error al obtener los detalles de la orden: ${response.status}`);
    }

    const data = await response.json();
    return { data };
  } catch (error) {
    console.error('Error en la solicitud:', error);
    throw error; // Lanza el error para manejarlo en un nivel superior si es necesario
  }
}

// Componente de la página
export default async function Page({ params }: any) {
  // Obtener el token de las cookies en el servidor (con await)
  const cookieStore = await cookies(); // Usar await para obtener el valor de las cookies
  const authToken = cookieStore.get('authToken'); // Accede al token almacenado en las cookies

  // Si no hay token, mostrar un error
  if (!authToken || !authToken.value) {
    return <div>No se encontró el token de autenticación</div>;
  }

  // Obtener los detalles de la orden
  const { data } = await getAgreementById(params.id, authToken.value); // Usamos authToken.value ya que cookies().get() devuelve un objeto

  // Verificar que los datos existen antes de intentar mapearlos
  const ordenCompraDetDtos = data?.ordenCompraDetDtos || []; // Si no existe, asignar un arreglo vacío

  return (
    <ViewContainer orderId={params.id}  />
  );
}
