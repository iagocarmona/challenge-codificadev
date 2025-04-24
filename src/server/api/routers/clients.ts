/* eslint-disable @typescript-eslint/no-unused-vars */
import { createTRPCRouter, protectedProcedure } from '@/server/api/trpc';
import { paginationSchema } from '@/server/validations/pagination';
import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import { firestore } from '@/lib/firebase.admin';
import {
  createClientSchema,
  updateClientSchema,
} from '@/server/validations/client';
import type { IClientCreateTypes } from '@/server/validations/client';
import type {
  FirestoreDataConverter,
  QueryDocumentSnapshot,
} from 'firebase-admin/firestore';

// Reaproveita os tipos do Zod
export type Client = IClientCreateTypes & {
  id: string;
  createdBy: string;
  createdAt: Date;
  updatedAt?: Date;
};

// Converter Firestore ↔ Client
const clientConverter: FirestoreDataConverter<Client> = {
  toFirestore(client: Client) {
    const { id, ...data } = client;
    return data;
  },
  fromFirestore(snapshot: QueryDocumentSnapshot) {
    const data = snapshot.data()!;
    return {
      id: snapshot.id,
      name: data.name,
      email: data.email,
      phone: data.phone,
      cnpj: data.cnpj,
      status: data.status,
      monthlyPayment: data.monthlyPayment,
      createdBy: data.createdBy,
      createdAt: data.createdAt.toDate(),
      updatedAt: data.updatedAt?.toDate(),
    };
  },
};

// Coleção tipada
const clientsCollection = firestore
  .collection('clients')
  .withConverter(clientConverter);

export const clientsRouter = createTRPCRouter({
  create: protectedProcedure
    .input(createClientSchema)
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;
      if (!userId)
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: 'Não autorizado',
        });

      // verifica duplicidade
      const snap = await clientsCollection
        .where('email', '==', input.email)
        .limit(1)
        .get();
      if (!snap.empty)
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Email já cadastrado',
        });

      // cria
      const newRef = await clientsCollection.add({
        id: '',
        ...input,
        createdBy: userId,
        createdAt: new Date(),
      });
      const client = (await newRef.get()).data();
      return { ok: true, data: client };
    }),

  getById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;
      if (!userId)
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: 'Não autorizado',
        });

      const snap = await clientsCollection.doc(input.id).get();
      if (!snap.exists)
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Cliente não encontrado',
        });

      const client = snap.data();
      if (client?.createdBy !== userId)
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'Acesso não permitido',
        });

      return { ok: true, data: client };
    }),

  getAll: protectedProcedure
    .input(paginationSchema)
    .query(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;
      if (!userId)
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: 'Não autorizado',
        });

      const { page, limit } = input;
      const offset = (page - 1) * limit;

      const [querySnap, countSnap] = await Promise.all([
        clientsCollection
          .where('createdBy', '==', userId)
          .orderBy('createdAt', 'desc')
          .offset(offset)
          .limit(limit)
          .get(),
        clientsCollection.where('createdBy', '==', userId).get(),
      ]);

      const data = querySnap.docs.map((doc) => doc.data());
      const total = countSnap.size;

      return {
        ok: true,
        data,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      };
    }),

  update: protectedProcedure
    .input(updateClientSchema)
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;
      if (!userId)
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: 'Não autorizado',
        });

      const docRef = clientsCollection.doc(input.id);
      const snap = await docRef.get();
      if (!snap.exists)
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Cliente não encontrado',
        });

      const existing = snap.data();
      if (existing?.createdBy !== userId)
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'Acesso não permitido',
        });

      await docRef.update({ ...input, updatedAt: new Date() });
      const updated = (await docRef.get()).data();
      return { ok: true, data: updated };
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;
      if (!userId)
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: 'Não autorizado',
        });

      const docRef = clientsCollection.doc(input.id);
      const snap = await docRef.get();
      if (!snap.exists)
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Cliente não encontrado',
        });

      const client = snap.data();
      if (client?.createdBy !== userId)
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'Acesso não permitido',
        });

      await docRef.delete();
      return { ok: true, message: 'Cliente deletado com sucesso' };
    }),
});
