import { createTRPCRouter, protectedProcedure } from '@/server/api/trpc';
import { paginationSchema } from '@/server/validations/pagination';

import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import { firestore } from '@/lib/firebase.admin';
import {
  createClientSchema,
  updateAvatarSchema,
} from '@/server/validations/client';

const clientsCollection = firestore.collection('clients');

export const clientsRouter = createTRPCRouter({
  create: protectedProcedure
    .input(createClientSchema)
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;

      if (!userId) {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: 'Não autorizado',
        });
      }

      try {
        const existingSnapshot = await clientsCollection
          .where('email', '==', input.email)
          .limit(1)
          .get();

        if (!existingSnapshot.empty) {
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: 'Email já cadastrado',
          });
        }

        const newClientRef = await clientsCollection.add({
          email: input.email,
          name: input.name,
          phone: input.phone,
          cnpj: input.cnpj,
          avatarUrl: input.avatarUrl,
          status: input.status,
          monthlyPayment: input.monthlyPayment,
          createdAt: new Date(),
          createdBy: userId,
        });

        const createdClient = await newClientRef.get();

        return {
          ok: true,
          data: { id: createdClient.id, ...createdClient.data() },
        };
      } catch (error) {
        console.error(error);

        if (error instanceof TRPCError) throw error;

        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Não foi possível cadastrar cliente',
        });
      }
    }),

  updateAvatar: protectedProcedure
    .input(updateAvatarSchema)
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;

      if (!userId) {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: 'Não autorizado',
        });
      }

      const clientDoc = clientsCollection.doc(input.clientId);
      const clientSnap = await clientDoc.get();
      const clientData = clientSnap.data();

      if (clientData?.createdBy !== userId) {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'Você não tem permissão para alterar esse cliente.',
        });
      }

      if (!clientSnap.exists) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Cliente não existe',
        });
      }

      await clientDoc.update({
        avatarUrl: input.avatarUrl,
      });

      return {
        ok: true,
        message: 'Avatar atualizado com sucesso!',
      };
    }),

  getAll: protectedProcedure
    .input(paginationSchema)
    .query(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;

      if (!userId) {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: 'Não autorizado',
        });
      }

      const { page, limit } = input;
      const offset = (page - 1) * limit;

      try {
        const clientsQuerySnapshot = await clientsCollection
          .where('createdBy', '==', userId)
          .orderBy('createdAt', 'desc')
          .offset(offset)
          .limit(limit)
          .get();

        const clients = clientsQuerySnapshot.docs.map(
          (
            doc: FirebaseFirestore.QueryDocumentSnapshot<FirebaseFirestore.DocumentData>,
          ) => ({
            id: doc.id,
            ...doc.data(),
          }),
        );

        const totalSnapshot = await clientsCollection.get();
        const total = totalSnapshot.size;

        return {
          ok: true,
          data: clients,
          pagination: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
          },
        };
      } catch (error) {
        console.error(error);

        if (error instanceof TRPCError) throw error;

        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Não foi possível carregar clientes',
        });
      }
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;

      if (!userId) {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: 'Não autorizado',
        });
      }

      const clientDoc = clientsCollection.doc(input.id);
      const clientSnap = await clientDoc.get();

      if (!clientSnap.exists) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Cliente não encontrado',
        });
      }

      await clientDoc.delete();

      return {
        ok: true,
        message: 'Cliente deletado com sucesso',
      };
    }),
});
