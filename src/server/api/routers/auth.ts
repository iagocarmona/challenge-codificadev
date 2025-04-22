/* eslint-disable @typescript-eslint/no-unused-vars */
import { firestore } from '@/lib/firebase.admin';
import { createTRPCRouter, publicProcedure } from '@/server/api/trpc';
import { registerSchema } from '@/server/validations/register.schema';
import { TRPCError } from '@trpc/server';
import bcrypt from 'bcryptjs';

const usersCollection = firestore.collection('users');

export const authRouter = createTRPCRouter({
  register: publicProcedure
    .input(registerSchema)
    .mutation(async ({ input }) => {
      const { password, confirmPassword, acceptPolicy, ...user } = input;

      if (!acceptPolicy) {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'Usuário não aceitou as políticas.',
        });
      }

      try {
        const existingUserSnap = await usersCollection
          .where('email', '==', user.email)
          .limit(1)
          .get();

        if (!existingUserSnap.empty) {
          throw new TRPCError({
            code: 'CONFLICT',
            message: 'Usuário já existe.',
          });
        }

        if (password !== confirmPassword) {
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: 'As senhas devem ser iguais.',
          });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = {
          ...user,
          password: hashedPassword,
          createdAt: new Date(),
        };

        const userRef = await usersCollection.add(newUser);
        const userSnapshot = await userRef.get();

        const { password: _, ...userDataWithoutPassword } =
          userSnapshot.data()!;

        return {
          id: userSnapshot.id,
          ...userDataWithoutPassword,
        };
      } catch (error) {
        console.error(error);

        if (error instanceof TRPCError) throw error;

        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Erro ao registrar usuário',
        });
      }
    }),
});
