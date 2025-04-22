import { firestore } from '@/lib/firebase.admin';
import { createTRPCRouter, protectedProcedure } from '@/server/api/trpc';
import { uploadFileSchema } from '@/server/validations/files';
import { TRPCError } from '@trpc/server';
import { v4 as uuidv4 } from 'uuid';

const MAX_FILE_UPLOAD_SIZE = 4.5 * 1024 * 1024; // 4.5 MB

export const filesRouter = createTRPCRouter({
  upload: protectedProcedure
    .input(uploadFileSchema)
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;

      if (!userId) {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: 'Não autorizado',
        });
      }

      const { filename, file } = input;
      let buffer: Buffer;

      try {
        buffer = Buffer.from(file, 'base64');
      } catch (e) {
        console.error(e);
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Arquivo base64 inválido',
        });
      }

      if (buffer.length > MAX_FILE_UPLOAD_SIZE) {
        throw new TRPCError({
          code: 'PAYLOAD_TOO_LARGE',
          message: 'Arquivo deve ter no máximo 4.5MB',
        });
      }

      try {
        const filesCollection = firestore.collection('files');
        const fileId = uuidv4();

        const newFile = {
          id: fileId,
          userId,
          filename,
          size: buffer.length,
          mimeType: 'application/octet-stream', // ou detectar dinamicamente
          base64: file, // 🔥 salva o base64 diretamente no Firestore
          createdAt: new Date(),
        };

        await filesCollection.doc(fileId).set(newFile);

        return {
          ok: true,
          fileId,
          filename,
        };
      } catch (error) {
        console.error('Erro ao salvar arquivo no Firestore:', error);

        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Erro ao salvar arquivo no banco de dados',
        });
      }
    }),
});
