import { z } from 'zod';

export const createClientSchema = z.object({
  name: z.string().min(1, 'Por favor, insira um nome válido.'),
  email: z.string().email('Por favor, insira um endereço de email válido.'),
  phone: z.string().min(10, 'Por favor, insira um telefone válido'),
  cnpj: z.string().min(14, 'Por favor, insira um CNPJ válido'),
  status: z.preprocess(
    // se vier string vazia, converte pra undefined
    (val) => (val === '' ? undefined : val),
    z.enum(['active', 'inactive'], {
      errorMap: () => ({ message: 'Este item é obrigatório' }),
    }),
  ),
  monthlyPayment: z.string().min(1, 'Por favor, insira um valor valido'),
});

export const updateClientSchema = createClientSchema.extend({
  id: z.string(),
});

// export const updateAvatarSchema = z.object({
//   avatarUrl: z.string().min(1, 'Por favor, insira uma imagem válida'),
//   clientId: z.string().min(1, 'Por favor, insira um ID válido'),
// });

export type IClientCreateTypes = z.infer<typeof createClientSchema>;
export type IClientUpdateTypes = z.infer<typeof updateClientSchema>;

export const defaultCreateClientValues = {
  name: '',
  email: '',
  phone: '',
  cnpj: '',
  status: 'active' as 'active' | 'inactive',
  monthlyPayment: '',
};
