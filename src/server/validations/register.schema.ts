import { z } from 'zod';

export const registerSchema = z
  .object({
    name: z.string().trim().min(3, 'Nome precisa ter pelo menos 3 caracteres.'),
    email: z
      .string()
      .trim()
      .min(1, 'Email precisa ser preenchido')
      .email('Email inválido.')
      .toLowerCase(),
    cellphone: z.string().trim().min(1, 'Telefone precisa ser preenchido'),
    password: z
      .string()
      .trim()
      .refine((value) => value.length >= 9, {
        message: 'Senha precisa ter pelo menos 9 caracteres.',
      }),
    confirmPassword: z
      .string()
      .trim()
      .min(9, 'Confirmação de senha é obrigatória.'),
    acceptPolicy: z.boolean().refine((value) => value, {
      message: 'Você precisa aceitar os termos e condições',
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'As senhas não coincidem.',
    path: ['confirmPassword'],
  });

export type RegisterSchemaTypes = z.infer<typeof registerSchema>;

export const DefaultRegisterValues = {
  name: '',
  email: '',
  cellphone: '',
  password: '',
  confirmPassword: '',
  acceptPolicy: false,
};
