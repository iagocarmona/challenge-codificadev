'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Form } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { FormInputComponent } from '@/components/forms/formInput/formInput.component';
import {
  maskCellphone,
  maskCNPJ,
  maskDecimalWithAcronym,
  maskOnlyText,
  unmaskCellphone,
  unmaskCNPJ,
  unmaskDecimal,
} from '@/common/utils/masksUtils';
import { Separator } from '@/components/ui/separator';
import { api } from '@/trpc/react';
import {
  IClientUpdateTypes,
  updateClientSchema,
} from '@/server/validations/client';
import { ISheetEditClient } from './sheetEditClient.types';
import { LoadingContent } from '@/components/LoadingContent';
import { FormSelectComponent } from '@/components/forms/formSelectInput/formSelectInput.component';

export const SheetEditClient: React.FC<ISheetEditClient> = ({
  side,
  isOpen,
  setIsOpen,
  refetch,
  clientId,
}) => {
  const { toast } = useToast();
  const { data: clientRes, isLoading: loadingClient } =
    api.clients.getById.useQuery({ id: clientId! });

  const updateMutation = api.clients.update.useMutation({
    onSuccess: async () => {
      if (refetch) await refetch();
      setIsOpen(false);

      toast?.({
        title: 'Sucesso',
        description: 'Cliente atualizado',
        variant: 'default',
      });
    },
    onError: (err) => {
      toast?.({
        title: 'Erro',
        description: err.message,
        variant: 'destructive',
      });
    },
  });

  const form = useForm<IClientUpdateTypes>({
    resolver: zodResolver(updateClientSchema),
    defaultValues: {
      id: clientRes?.data.id || '',
      name: clientRes?.data.name || '',
      email: clientRes?.data.email || '',
      phone: clientRes?.data.phone || '',
      cnpj: clientRes?.data.cnpj || '',
      status: clientRes?.data.status || 'active',
      monthlyPayment: clientRes?.data.monthlyPayment || '0',
    },
    mode: 'onChange',
  });

  const onSubmit = async (data: IClientUpdateTypes) => {
    try {
      await updateMutation.mutateAsync({ ...data });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetContent side={side} className="min-w-[40vw] xl:min-w-[30vw]">
        <SheetHeader className="flex flex-col gap-2">
          <SheetTitle className="text-2xl">Editar Cliente</SheetTitle>
          <SheetDescription>
            Atualize os dados do cliente abaixo
          </SheetDescription>
        </SheetHeader>
        {loadingClient ? (
          <LoadingContent textLoading="Carregando dados..." />
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <Separator className="my-4" />

              <div className="grid grid-cols-2 gap-4">
                <FormInputComponent
                  control={form.control}
                  name="name"
                  label="Nome"
                  type="text"
                  mask={maskOnlyText}
                  placeholder="Nome completo"
                  maxLength={30}
                  className="col-span-4"
                />
                <FormInputComponent
                  control={form.control}
                  name="email"
                  label="Email"
                  type="email"
                  placeholder="exemplo@dominio.com"
                  maxLength={50}
                  className="col-span-4"
                />
                <FormInputComponent
                  control={form.control}
                  name="phone"
                  label="Telefone"
                  type="text"
                  mask={maskCellphone}
                  unmask={unmaskCellphone}
                  placeholder="(XX) XXXXX-XXXX"
                  maxLength={15}
                  className="col-span-2"
                />
                <FormInputComponent
                  control={form.control}
                  name="cnpj"
                  label="CNPJ"
                  mask={maskCNPJ}
                  unmask={unmaskCNPJ}
                  placeholder="XX.XXX.XXX/XXXX-XX"
                  maxLength={18}
                  className="col-span-2"
                />
                <FormInputComponent
                  control={form.control}
                  name="monthlyPayment"
                  label="Pagamento Mensal"
                  mask={maskDecimalWithAcronym}
                  unmask={unmaskDecimal}
                  placeholder="R$ 0,00"
                  className="col-span-2"
                />
                <FormSelectComponent
                  control={form.control}
                  name="status"
                  label="Status"
                  options={[
                    { value: 'active', textValue: 'Ativo' },
                    { value: 'inactive', textValue: 'Inativo' },
                  ]}
                  placeholder="Selecione..."
                  className="col-span-1"
                  hasEmptyOption
                />
              </div>

              <div className="mt-6 flex justify-end">
                <Button type="submit" disabled={form.formState.isSubmitting}>
                  {form.formState.isSubmitting ? 'Atualizando...' : 'Atualizar'}
                </Button>
              </div>
            </form>
          </Form>
        )}
      </SheetContent>
    </Sheet>
  );
};
