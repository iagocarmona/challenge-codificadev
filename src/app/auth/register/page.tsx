'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form } from '@/components/ui/form';
import { FormInputComponent } from '@/components/forms/formInput/formInput.component';
import { Button } from '@/components/ui/button';
import { Check, Eye, EyeOff, Mail, Smartphone, User, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { api } from '@/trpc/react';
import { maskCellphone, unmaskCellphone } from '@/common/utils/masksUtils';
import { FormCheckboxComponent } from '@/components/forms/formCheckboxInput/formCheckboxInput.component';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogClose,
} from '@/components/ui/dialog';
import Link from 'next/link';
import { TRPCError } from '@trpc/server';
import { signIn } from 'next-auth/react';
import {
  DefaultRegisterValues,
  registerSchema,
  RegisterSchemaTypes,
} from '@/server/validations/register.schema';
import { passwordRequirements } from '@/common/utils/regexUtils';

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { toast } = useToast();

  const form = useForm<RegisterSchemaTypes>({
    resolver: zodResolver(registerSchema),
    defaultValues: DefaultRegisterValues,
    mode: 'onChange',
  });

  const password = form.watch('password');
  const submitRegister = api.auth.register.useMutation();

  const isPasswordValid =
    password && passwordRequirements.every(({ regex }) => regex.test(password));

  const onSubmitRegister = async (data: RegisterSchemaTypes) => {
    try {
      await submitRegister.mutateAsync(data);
      toast({
        title: 'Sucesso',
        description: 'Usuário criado com sucesso',
        variant: 'default',
      });
      await signIn('credentials', { ...data, callbackUrl: '/dashboard' });
    } catch (error) {
      console.error('Erro ao criar conta:', error);
      const description =
        error instanceof TRPCError
          ? error.message
          : 'Foi encontrado um erro ao criar a conta, contate o suporte';
      toast({
        title: 'Erro ao criar conta',
        description,
        variant: 'destructive',
      });
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmitRegister)}
        className="mx-auto max-w-xs space-y-3"
      >
        <div>
          <FormInputComponent
            control={form.control}
            name="name"
            label="Nome completo"
            type="text"
            placeholder="Preencha o seu nome completo"
            required
            className="border border-input bg-muted text-foreground"
            icon={<User size={18} className="text-muted-foreground" />}
          />
        </div>

        <div>
          <FormInputComponent
            control={form.control}
            name="email"
            label="Email"
            type="email"
            placeholder="Preencha o seu email"
            required
            className="border border-input bg-muted text-foreground"
            icon={<Mail size={18} className="text-muted-foreground" />}
          />
        </div>

        <div>
          <FormInputComponent
            control={form.control}
            name="cellphone"
            label="Celular"
            type="text"
            placeholder="(00) 00000-0000"
            mask={maskCellphone}
            unmask={unmaskCellphone}
            required
            className="border border-input bg-muted text-foreground"
            icon={<Smartphone size={18} className="text-muted-foreground" />}
          />
        </div>

        <div className="relative">
          <FormInputComponent
            control={form.control}
            name="password"
            label="Senha"
            type={showPassword ? 'text' : 'password'}
            placeholder="Preencha a sua senha"
            required
            className="border border-input bg-muted pl-10 text-foreground"
          />
          <div
            className="absolute left-3 top-9 cursor-pointer text-muted-foreground"
            onClick={() => setShowPassword((prev) => !prev)}
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </div>
        </div>

        {password && (
          <div className="border-b pb-3">
            <ul className="mt-2 text-sm">
              {passwordRequirements.map(({ regex, message }, index) => (
                <li key={index} className="flex items-center gap-2">
                  {regex.test(password) ? (
                    <Check className="text-success" size={18} />
                  ) : (
                    <X className="text-destructive" size={18} />
                  )}
                  {message}
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="relative">
          <FormInputComponent
            control={form.control}
            name="confirmPassword"
            label="Confirmar senha"
            type={showPassword ? 'text' : 'password'}
            placeholder="Preencha a sua senha"
            required
            className="border border-input bg-muted pl-10 text-foreground"
          />
          <div
            className="absolute left-3 top-9 cursor-pointer text-muted-foreground"
            onClick={() => setShowPassword((prev) => !prev)}
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </div>
        </div>

        <div className="flex-row items-center py-4 text-sm">
          <FormCheckboxComponent
            control={form.control}
            name="acceptPolicy"
            rules={{ required: true }}
            labelElement={
              <>
                Aceito os termos de uso e{' '}
                <span
                  className="font-bold text-primary transition hover:opacity-80"
                  onClick={() => setIsModalOpen(true)}
                >
                  Política de Compartilhamento de dados
                </span>
              </>
            }
          />
        </div>

        {/* Modal da Política de Compartilhamento */}
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent className="max-w-2xl rounded-lg bg-background p-6 shadow-lg">
            <DialogTitle className="text-lg font-bold">
              Termos e condições
            </DialogTitle>

            <div className="max-h-96 border-separate overflow-y-auto border-l-2 border-r-2 px-4 text-sm text-card-foreground">
              <p className="text-justify">
                {Array.from(
                  { length: 150 },
                  () =>
                    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. ',
                ).join(' ')}
              </p>
            </div>

            <DialogClose asChild>
              <div className="mt-4 flex justify-center">
                <Button className="w-1/2 items-center justify-center rounded-md py-2 font-bold">
                  Fechar
                </Button>
              </div>
            </DialogClose>
          </DialogContent>
        </Dialog>

        <Button
          type="submit"
          className="w-full rounded-lg p-6 text-sm font-bold text-primary-foreground transition"
          disabled={
            !form.formState.isValid ||
            form.formState.isSubmitting ||
            !isPasswordValid
          }
        >
          {form.formState.isSubmitting ? 'Criando conta...' : 'Criar conta'}
        </Button>

        <p className="mt-4 text-center text-sm text-muted-foreground">
          Já tenho uma conta?{' '}
          <Link
            href="/auth/login"
            className="font-bold text-primary transition hover:opacity-80"
          >
            Fazer login
          </Link>
        </p>
      </form>
    </Form>
  );
}
