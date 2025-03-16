import ViewContainer from '@/components/Maintenance/View/Content';



// Componente de la página
export default async function Page({ params }: any) {
  

  return (
    <ViewContainer orderId={params.id}  />
  );
}
