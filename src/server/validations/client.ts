import { z } from 'zod';

export const createClientSchema = z.object({
  name: z.string().min(1, 'Por favor, insira um nome válido.'),
  email: z.string().email('Por favor, insira um endereço de email válido.'),
  phone: z.string().min(10, 'Por favor, insira um telefone válido'),
  avatarUrl: z.string().nullable(),
  cnpj: z.string().min(14, 'Por favor, insira um CNPJ válido'),
  status: z.enum(['active', 'inactive']).default('active'),
  monthlyPayment: z.string().min(1, 'Por favor, insira um valor valido'),
});

export const updateAvatarSchema = z.object({
  avatarUrl: z.string().min(1, 'Por favor, insira uma imagem válida'),
  clientId: z.string().min(1, 'Por favor, insira um ID válido'),
});

export type IClientCreateTypes = z.infer<typeof createClientSchema>;

export const defaultCreateClientValues = {
  name: '',
  email: '',
  phone: '',
  avatarUrl: '',
  cnpj: '',
  status: 'active' as 'active' | 'inactive',
  monthlyPayment: '',
};
