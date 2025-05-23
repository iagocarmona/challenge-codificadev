'use client';

import { BreadcrumbUpdater } from '@/contexts/breadcrumb';
import { Button } from '@/components/ui/button';
import { UserPlus } from 'lucide-react';
import { api } from '@/trpc/react';
import { LoadingContent } from '@/components/LoadingContent';
import { toast } from '@/hooks/use-toast';
import { useState } from 'react';
import { ClientCard } from '@/components/clientCard/clientCard.component';
import { IFirebaseClient } from '@/components/clientCard/clientCard.types';
import { SheetCreateClient } from '@/components/modals/createClient/sheetCreateClient.component';
import { SheetEditClient } from '@/components/modals/EditStudent/sheetEditClient.component';

const breadcrumbItems = [
  {
    label: 'Home',
    href: '/dashboard',
  },
  {
    label: 'Clientes',
    href: '/clients',
  },
];

export default function ClientsPage() {
  const [showSheet, setShowSheet] = useState(false);

  const [showEdit, setShowEdit] = useState(false);
  const [editClientId, setEditClientId] = useState<string | null>(null);

  const {
    data: clientsApi,
    refetch,
    isLoading,
  } = api.clients.getAll.useQuery({
    page: 1,
    limit: 10,
  });
  const deleteClientApi = api.clients.delete.useMutation({
    onSuccess: () => {
      refetch();
    },
    onError: (error) => {
      toast({
        title: 'Erro ao deletar cliente',
        description: error.message,
      });
    },
  });
  const clientsData = clientsApi?.data as Array<IFirebaseClient>;

  if (isLoading) {
    return <LoadingContent textLoading="Carregando clientes..." />;
  }

  const handleDeleteClient = async (clientId: string) => {
    await deleteClientApi.mutate({ id: clientId });
    toast({
      title: 'Sucesso',
      description: 'Cliente deletado com sucesso',
    });
  };

  const handleEdit = (id: string) => {
    setEditClientId(id);
    setShowEdit(true);
  };

  return (
    <div className="w-full">
      <BreadcrumbUpdater items={breadcrumbItems} />

      <main className="flex flex-col gap-6 py-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Clientes</h1>
          <Button onClick={() => setShowSheet(true)}>
            <UserPlus className="mr-2 h-4 w-4" />
            Criar cliente
          </Button>
        </div>

        <div className="flex flex-col gap-4">
          {clientsData?.map((client: IFirebaseClient) => (
            <ClientCard
              key={client.id}
              data={client}
              onDelete={() => handleDeleteClient(client.id)}
              onEdit={handleEdit}
            />
          ))}
        </div>

        {showSheet && (
          <SheetCreateClient
            side="right"
            isOpen={showSheet}
            setIsOpen={setShowSheet}
            refetch={refetch}
          />
        )}

        {showEdit && editClientId && (
          <SheetEditClient
            side="right"
            isOpen={showEdit}
            setIsOpen={(open) => setShowEdit(open)}
            clientId={editClientId}
            refetch={refetch}
          />
        )}
      </main>
    </div>
  );
}
