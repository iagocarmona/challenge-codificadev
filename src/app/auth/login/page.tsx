'use client';

import {
  AlertCircle,
  ArrowRight,
  Eye,
  EyeOff,
  LoaderCircle,
  Mail,
} from 'lucide-react';
import Link from 'next/link';
import { FcGoogle } from 'react-icons/fc';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useState } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { signIn } from 'next-auth/react';
import { Form } from '@/components/ui/form';
import { FormInputComponent } from '@/components/forms/formInput/formInput.component';

export default function LoginPage(): JSX.Element {
  const [seePass, setSeePass] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [loadingGoogle, setLoadingGoogle] = useState(false);

  const PasswordIcon = seePass ? EyeOff : Eye;

  const formSchema = z.object({
    username: z
      .string()
      .email('Por favor, insira um endereço de e-mail válido.'),
    password: z
      .string()
      .min(6, { message: 'A senha deve ter pelo menos 6 caracteres.' })
      .max(20, { message: 'A senha pode ter no máximo 20 caracteres.' }),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: '',
      password: '',
    },
  });

  async function onSubmit(data: z.infer<typeof formSchema>) {
    setDisabled(true);
    const result = await signIn('credentials', { ...data, redirect: false });
    if (result && result.status === 401) {
      setErrorMessage('E-mail ou senha incorreto.');
    } else if (result && result.status === 200) {
      window.location.href = '/dashboard';
      setErrorMessage('');
      form.reset();
    } else {
      setErrorMessage('Houve um erro inexperado, tente novamente mais tarde.');
    }
    setDisabled(false);
  }

  async function handleGoogleSignIn() {
    try {
      setLoadingGoogle(true);
      await signIn('google', { callbackUrl: '/dashboard' });
    } catch (error) {
      console.error('Erro no login com Google:', error);
      setLoadingGoogle(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="grid w-full gap-6 pb-6">
          <div>
            <h1 className="mt-8 text-xl font-bold text-foreground">
              Bem vindo ao desafio
            </h1>
            <p className="text-sm text-muted-foreground">Codifica Dev</p>
          </div>
          <div className="grid gap-4">
            <FormInputComponent
              control={form.control}
              label="E-mail"
              name="username"
              type="text"
              placeholder="Digite seu e-mail"
              maxLength={100}
              required
              className="py-6 pl-11"
              disabled={disabled}
              icon={
                <Mail
                  size={18}
                  className="pointer-events-none absolute left-4 top-4 flex items-center text-muted-foreground"
                />
              }
            />
            <FormInputComponent
              control={form.control}
              name="password"
              label="Senha"
              type={seePass ? 'text' : 'password'}
              placeholder="Digite sua senha"
              required
              disabled={disabled}
              className="py-6 pl-11"
              icon={
                <PasswordIcon
                  size={18}
                  className="absolute left-4 top-4 flex cursor-pointer items-center text-muted-foreground"
                  onClick={() => setSeePass(!seePass)}
                />
              }
            />
            <div className="flex w-full items-center justify-between">
              <Link
                href="/auth/forgotpassword"
                className="text-xs text-primary hover:underline"
              >
                Esqueceu sua senha?
              </Link>

              <Link
                href="/auth/register"
                className="text-xs text-muted-foreground hover:underline"
              >
                <span className="font-semibold">Cadastre-se</span>
              </Link>
            </div>

            <Button
              className="w-full bg-primary py-6 font-medium"
              type="submit"
              disabled={disabled}
            >
              {disabled && <LoaderCircle className="mr-1 h-5 animate-spin" />}
              Entrar
              <ArrowRight size={18} className="ml-1" />
            </Button>

            {/* Google auth */}
            <div
              className={`border-gray-30 flex h-auto w-full items-center justify-center rounded-md border py-2 transition ${
                loadingGoogle
                  ? 'cursor-not-allowed opacity-70'
                  : 'cursor-pointer hover:bg-foreground/20'
              }`}
              onClick={loadingGoogle ? undefined : handleGoogleSignIn}
            >
              {loadingGoogle ? (
                <LoaderCircle className="h-5 w-5 animate-spin" />
              ) : (
                <>
                  <FcGoogle size={30} />
                  <span className="ml-2">Login com o Google</span>
                </>
              )}
            </div>
            {errorMessage && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Não foi possivel fazer login</AlertTitle>
                <AlertDescription>{errorMessage}</AlertDescription>
              </Alert>
            )}
          </div>
        </div>
      </form>
    </Form>
  );
}
