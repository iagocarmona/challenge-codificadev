'use client';

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
} from '@/utils/masksUtils';
import { Separator } from '@/components/ui/separator';
import { api } from '@/trpc/react';
import { FormFileInputComponent } from '@/components/forms/formFileInput/formFileInput.component';
import { blobUrlToBase64 } from '@/common/utils/files';
import {
  createClientSchema,
  defaultCreateClientValues,
  IClientCreateTypes,
} from '@/server/validations/client';
import { ISheetCreateClient } from './sheetCreateClient.types';

export const SheetCreateClient: React.FC<ISheetCreateClient> = ({
  side,
  isOpen,
  setIsOpen,
  refetch,
}) => {
  const { toast } = useToast();

  const createUser = api.clients.create.useMutation();
  const { mutateAsync: uploadFile } = api.files.upload.useMutation();

  const form = useForm<IClientCreateTypes>({
    resolver: zodResolver(createClientSchema),
    defaultValues: defaultCreateClientValues,
    mode: 'onChange',
  });

  const onSubmit = async (data: IClientCreateTypes) => {
    try {
      let avatarRealUrl = '';
      if (data.avatarUrl) {
        const base64 = await blobUrlToBase64(data.avatarUrl);

        const result = await uploadFile({
          filename: `avatar_${data.name}`,
          file: base64,
        });

        avatarRealUrl = result.file;
      }

      await createUser.mutateAsync({
        ...data,
        avatarUrl: avatarRealUrl,
      });

      setIsOpen(false);
      if (refetch) refetch();

      toast({
        title: 'Sucesso',
        description: 'Dados atualizados com sucesso',
        variant: 'default',
      });
    } catch (error) {
      toast({
        title: 'Erro',
        description:
          (error as { message?: string })?.message ||
          'Ocorreu um erro inesperado',
        variant: 'destructive',
      });
      console.error(error);
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetContent
        side={side}
        className="min-w-[40vw] items-center overflow-auto xl:min-w-[30vw]"
      >
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <SheetHeader className="mx-2 mb-12 flex">
              <div className="mb-8 flex flex-col">
                <SheetTitle className="text-2xl">
                  Criar um Novo Cliente
                </SheetTitle>
                <SheetDescription className="mt-4 text-sm">
                  Informe os dados abaixo de seu cliente
                </SheetDescription>
              </div>

              <div className="flex w-full justify-center">
                <FormFileInputComponent
                  control={form.control}
                  name="avatarUrl"
                  label="Imagem do cliente"
                  type="file"
                  accept=".jpg, .jpeg, .png"
                />
              </div>
            </SheetHeader>

            <Separator />

            <div className="mx-2 mb-12 mt-8 grid grid-cols-4 items-center gap-8">
              <div className="col-span-4">
                <FormInputComponent
                  control={form.control}
                  name="name"
                  label="Nome"
                  type="text"
                  mask={maskOnlyText}
                  placeholder="Nome completo"
                  maxLength={30}
                />
              </div>
              <div className="col-span-4">
                <FormInputComponent
                  control={form.control}
                  name="email"
                  label="Email"
                  type="email"
                  placeholder="exemplo@exemplo.com"
                  maxLength={30}
                />
              </div>
              <div className="col-span-2">
                <FormInputComponent
                  control={form.control}
                  name="phone"
                  label="Telefone"
                  type="text"
                  mask={maskCellphone}
                  unmask={unmaskCellphone}
                  placeholder="(XX) XXXXX-XXXX"
                  maxLength={15}
                />
              </div>
              <div className="col-span-2">
                <FormInputComponent
                  control={form.control}
                  name="cnpj"
                  label="CNPJ"
                  mask={maskCNPJ}
                  unmask={unmaskCNPJ}
                  placeholder="XX.XXX.XXX/XXXX-XX"
                  maxLength={18}
                />
              </div>
              <div className="col-span-2">
                <FormInputComponent
                  control={form.control}
                  name="monthlyPayment"
                  label="Pagamento Mensal"
                  mask={maskDecimalWithAcronym}
                  unmask={unmaskDecimal}
                  placeholder="R$ 0,00"
                  maxLength={30}
                />
              </div>
            </div>

            <div className="flex justify-center md:justify-end">
              <Button
                type="submit"
                disabled={createUser.isPending || form.formState.isSubmitting}
              >
                {createUser.isPending ? 'Criando cliente...' : 'Criar cliente'}
              </Button>
            </div>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
};
