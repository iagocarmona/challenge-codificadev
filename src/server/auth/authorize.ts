import { type User } from 'next-auth';
import { loginSchema } from '@/server/validations/auth';
import bcrypt from 'bcryptjs';
import { firestore } from '@/lib/firebase.admin';

export async function authorize(
  credentials: Record<'username' | 'password', string> | undefined,
): Promise<User | null> {
  try {
    const creds = await loginSchema.parseAsync(credentials);

    // Procurar o usuário no Firestore
    const userSnapshot = await firestore
      .collection('users')
      .where('email', '==', creds.username.toLowerCase())
      .limit(1)
      .get();

    if (userSnapshot.empty) {
      return null;
    }

    const userDoc = userSnapshot.docs[0];
    const userData = userDoc?.data();

    // Verificar senha usando bcryptjs
    const isValidPassword = await bcrypt.compare(
      creds.password,
      userData?.password,
    );

    if (!isValidPassword) {
      return null;
    }

    // Montar o objeto que o NextAuth espera
    const returnUser: User = {
      id: userDoc?.id ?? '',
      name: userData?.name,
      email: userData?.email,
    };

    return returnUser;
  } catch (error) {
    console.error('Erro no authorize:', error);
    return null;
  }
}
